import {
  describe,
  it,
  expect,
  beforeEach,
  afterAll,
  beforeAll,
  vi,
} from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Faculty from "@models/faculty";
import Course from "@models/course";
import Class from "@models/class";
import Enrollment from "@models/enrollment";
import { IntentionalError } from "@utils/intentionalError";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect Mongoose to the in-memory database
  await mongoose.connect(uri);

  // Add the Faculty model to the in-memory database
  await Faculty.create({
    facultyName: "Faculty of Science",
  });
});

afterAll(async () => {
  // Disconnect and stop the in-memory MongoDB instance
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = await mongoose.connection.db?.collections();
  for (const collection of collections || []) {
    await collection.deleteMany({});
  }
});

describe("Course Schema", () => {
  it("should successfully create a course with valid information and prerequisite courses", async () => {
    const mockManagingFaculty = new mongoose.Types.ObjectId();
    const mockPrerequisiteCourse1 = new mongoose.Types.ObjectId();
    const mockPrerequisiteCourse2 = new mongoose.Types.ObjectId();

    // Mock managing faculty existence
    vi.spyOn(Faculty, "findById").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockManagingFaculty }),
    } as unknown as mongoose.Query<any, any>);

    // Mock prerequisite courses existence
    vi.spyOn(Course, "findById")
      .mockReturnValueOnce({
        exec: vi.fn().mockResolvedValue({ _id: mockPrerequisiteCourse1 }),
      } as unknown as mongoose.Query<any, any>)
      .mockReturnValueOnce({
        exec: vi.fn().mockResolvedValue({ _id: mockPrerequisiteCourse2 }),
      } as unknown as mongoose.Query<any, any>);

    const course = await Course.create({
      courseCode: "CS102",
      courseName: "Data Structures",
      courseCredits: 4,
      managingFaculty: mockManagingFaculty,
      courseDescription: "An in-depth course on data structures.",
      prequisiteCourses: [mockPrerequisiteCourse1, mockPrerequisiteCourse2],
    });

    expect(course).toBeDefined();
    expect(course.courseCode).toBe("CS102");
    expect(course.courseName).toBe("Data Structures");
    expect(course.courseCredits).toBe(4);
    expect(course.managingFaculty.toString()).toBe(
      mockManagingFaculty.toString()
    );
    expect(course.courseDescription).toBe(
      "An in-depth course on data structures."
    );
    expect(course.prequisiteCourses).toHaveLength(2);
    expect(course.prequisiteCourses!![0].toString()).toBe(
      mockPrerequisiteCourse1.toString()
    );
    expect(course.prequisiteCourses!![1].toString()).toBe(
      mockPrerequisiteCourse2.toString()
    );
  });

  it("should validate required fields", async () => {
    try {
      await Course.create({
        courseCode: "",
        courseName: "",
        courseCredits: null,
        managingFaculty: null,
        courseDescription: "",
      });
    } catch (err: any) {
      // Ensure the error is a Mongoose ValidationError
      expect(err.name).toBe("ValidationError");
      expect(err.errors.courseCode).toBeDefined();
      expect(err.errors.courseName).toBeDefined();
      expect(err.errors.courseCredits).toBeDefined();
      expect(err.errors.managingFaculty).toBeDefined();
      expect(err.errors.courseDescription).toBeDefined();
    }
  });

  it("should validate unique courseCode", async () => {
    const mockManagingFaculty = new mongoose.Types.ObjectId();
    vi.spyOn(Faculty, "findById").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: mockManagingFaculty,
      }),
      then: vi.fn(),
      catch: vi.fn(),
    } as unknown as mongoose.Query<any, any>);

    await Course.create({
      courseCode: "CS101",
      courseName: "Intro to CS",
      courseCredits: 3,
      managingFaculty: mockManagingFaculty,
      courseDescription: "Description",
    });

    try {
      await Course.create({
        courseCode: "CS101", // Duplicate courseCode
        courseName: "Advanced CS",
        courseCredits: 4,
        managingFaculty: mockManagingFaculty,
        courseDescription: "Another description",
      });
    } catch (err: any) {
      expect(err.name).toBe("MongoServerError");
      expect(err.code).toBe(11000); // Duplicate key error code
      expect(err.keyPattern).toHaveProperty("courseCode");
    }
  });

  it("should validate minimum courseCredits", async () => {
    try {
      await Course.create({
        courseCode: "CS101",
        courseName: "Intro to CS",
        courseCredits: 1, // Below the minimum value
        managingFaculty: new mongoose.Types.ObjectId(),
        courseDescription: "Description",
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.courseCredits).toBeDefined();
    }
  });

  it("should validate managingFaculty existence", async () => {
    try {
      await Course.create({
        courseCode: "CS101",
        courseName: "Intro to CS",
        courseCredits: 3,
        managingFaculty: new mongoose.Types.ObjectId(), // Non-existent faculty
        courseDescription: "Description",
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.managingFaculty).toBeDefined();
    }
  });

  it("should not allow updating courseCode", async () => {
    const mockManagingFaculty = new mongoose.Types.ObjectId();

    const course = await Course.create({
      courseCode: "CS101",
      courseName: "Intro to CS",
      courseCredits: 3,
      managingFaculty: mockManagingFaculty,
      courseDescription: "Description",
    });

    try {
      await Course.findOneAndUpdate(
        { _id: course._id },
        { courseCode: "CS102" }
      );
    } catch (err: any) {
      expect(err.message).toBe("Updating course code is not allowed.");
    }
  });

  it("should not allow updating courseCredits if enrollments exist", async () => {
    const mockManagingFaculty = new mongoose.Types.ObjectId();
    const mockEnrollment = new mongoose.Types.ObjectId();

    vi.spyOn(Enrollment, "exists").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: mockEnrollment,
      }),
    } as unknown as mongoose.Query<any, any>);

    const course = await Course.create({
      courseCode: "CS101",
      courseName: "Intro to CS",
      courseCredits: 3,
      managingFaculty: mockManagingFaculty,
      courseDescription: "Description",
    });

    try {
      await Course.findOneAndUpdate({ _id: course._id }, { courseCredits: 4 });
    } catch (err: any) {
      expect(err.message).toBe(
        "Updating course credits is not allowed as enrollments exist for this course."
      );
    }
  });

  it("should not allow deleting a course after the allowed interval", async () => {
    const mockManagingFaculty = new mongoose.Types.ObjectId();

    const course = await Course.create({
      courseCode: "CS101",
      courseName: "Intro to CS",
      courseCredits: 3,
      managingFaculty: mockManagingFaculty,
      courseDescription: "Description",
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // Created 2 minutes ago
    });

    try {
      await Course.findOneAndDelete({ _id: course._id });
    } catch (err: any) {
      expect(err.message).toBe(
        `Course "CS101" cannot be deleted. It can only be deleted within 1 minutes of creation.`
      );
    }
  });

  it("should deactivate a course instead of deleting if classes exist", async () => {
    const mockManagingFaculty = new mongoose.Types.ObjectId();

    vi.spyOn(Class, "find").mockReturnValue({
      exec: vi
        .fn()
        .mockResolvedValue([{ courseCode: "CS101", deactivated: false }]),
    } as unknown as mongoose.Query<any, any>);
    vi.spyOn(Class, "updateOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      }),
    } as unknown as mongoose.Query<any, any>);

    const course = await Course.create({
      courseCode: "CS101",
      courseName: "Intro to CS",
      courseCredits: 3,
      managingFaculty: mockManagingFaculty,
      courseDescription: "Description",
    });

    try {
      await Course.findOneAndDelete({ _id: course._id });
    } catch (err: any) {
      expect(err).toBeInstanceOf(IntentionalError);
      expect(err.message).toBe(
        `Course "${course.courseCode}" cannot be deleted because it has associated classes. The course has been deactivated instead.`
      );
    }

    const updatedCourse = await Course.findById(course._id);
    expect(updatedCourse?.deactivated).toBe(true);

    const deletedCourse = await Course.findById(course._id);
    expect(deletedCourse).not.toBeNull();
  });

  it("should validate prerequisite courses existence", async () => {
    const mockManagingFaculty = new mongoose.Types.ObjectId();
    const nonExistentCourseId = new mongoose.Types.ObjectId();

    try {
      await Course.create({
        courseCode: "CS101",
        courseName: "Intro to CS",
        courseCredits: 3,
        managingFaculty: mockManagingFaculty,
        courseDescription: "Description",
        prequisiteCourses: [nonExistentCourseId],
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors["prequisiteCourses.0"]).toBeDefined();
    }
  });

  it("should allow updating course name, description, and managing faculty", async () => {
    const mockManagingFaculty = new mongoose.Types.ObjectId();
    const newManagingFaculty = new mongoose.Types.ObjectId();

    vi.spyOn(Faculty, "findById").mockReturnValueOnce({
      exec: vi.fn().mockResolvedValue({ _id: newManagingFaculty }),
    } as unknown as mongoose.Query<any, any>);
    vi.spyOn(Faculty, "exists").mockReturnValueOnce({
      exec: vi.fn().mockResolvedValue(true),
    } as unknown as mongoose.Query<any, any>);

    const course = await Course.create({
      courseCode: "CS101",
      courseName: "Intro to CS",
      courseCredits: 3,
      managingFaculty: mockManagingFaculty,
      courseDescription: "Description",
    });

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: course._id },
      {
        courseName: "Advanced CS",
        courseDescription: "Updated description",
        managingFaculty: newManagingFaculty,
      },
      { new: true }
    );

    expect(updatedCourse?.courseName).toBe("Advanced CS");
    expect(updatedCourse?.courseDescription).toBe("Updated description");
    expect(updatedCourse?.managingFaculty.toString()).toBe(
      newManagingFaculty.toString()
    );
  });
});
