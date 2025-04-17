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
import Class from "@models/class";
import Course, { ICourse } from "@models/course";
import Enrollment from "@models/enrollment";
import { IntentionalError } from "@utils/intentionalError";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect Mongoose to the in-memory database
  await mongoose.connect(uri);
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

describe("Class Schema", () => {
  it("should successfully create a class with valid information", async () => {
    const mockCourse = new mongoose.Types.ObjectId();

    // Mock course existence
    vi.spyOn(Course, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockCourse, deactivated: false }),
    } as unknown as mongoose.Query<any, any>);

    const classDoc = await Class.create({
      classCode: "CS101-01",
      courseCode: "CS101",
      academicYear: 2025,
      semester: "I",
      lecturers: [],
      maxStudents: 50,
      schedule: "Mon-Wed 9:00-11:00",
      classroom: "Room 101",
    });

    expect(classDoc).toBeDefined();
    expect(classDoc.classCode).toBe("CS101-01");
    expect(classDoc.courseCode).toBe("CS101");
    expect(classDoc.academicYear).toBe(2025);
    expect(classDoc.semester).toBe("I");
    expect(classDoc.maxStudents).toBe(50);
    expect(classDoc.schedule).toBe("Mon-Wed 9:00-11:00");
    expect(classDoc.classroom).toBe("Room 101");
  });

  it("should validate required fields", async () => {
    try {
      await Class.create({
        classCode: "",
        courseCode: "",
        academicYear: null,
        semester: "",
        maxStudents: null,
        schedule: "",
        classroom: "",
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.classCode).toBeDefined();
      expect(err.errors.courseCode).toBeDefined();
      expect(err.errors.academicYear).toBeDefined();
      expect(err.errors.semester).toBeDefined();
      expect(err.errors.maxStudents).toBeDefined();
      expect(err.errors.schedule).toBeDefined();
      expect(err.errors.classroom).toBeDefined();
    }
  });

  it("should validate unique classCode", async () => {
    const mockCourse = new mongoose.Types.ObjectId();

    // Mock course existence
    vi.spyOn(Course, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockCourse, deactivated: false }),
    } as unknown as mongoose.Query<any, any>);

    // Create the first class with a unique classCode
    await Class.create({
      classCode: "CS101-01",
      courseCode: "CS101",
      academicYear: 2025,
      semester: "I",
      lecturers: [],
      maxStudents: 50,
      schedule: "Mon-Wed 9:00-11:00",
      classroom: "Room 101",
    });

    // Attempt to create another class with the same classCode
    try {
      await Class.create({
        classCode: "CS101-01", // Duplicate classCode
        courseCode: "CS101",
        academicYear: 2025,
        semester: "I",
        lecturers: [],
        maxStudents: 50,
        schedule: "Tue-Thu 10:00-12:00",
        classroom: "Room 102",
      });
    } catch (err: any) {
      expect(err.name).toBe("MongoServerError");
      expect(err.code).toBe(11000); // Duplicate key error code
      expect(err.keyPattern).toHaveProperty("classCode");
    }
  });

  it("should validate course existence and not allow deactivated courses", async () => {
    const mockCourse = new mongoose.Types.ObjectId();

    // Mock course existence and deactivation
    vi.spyOn(Course, "findOne")
      .mockReturnValueOnce({
        exec: vi.fn().mockResolvedValue(null), // Course does not exist
      } as unknown as mongoose.Query<any, any>)
      .mockReturnValueOnce({
        exec: vi.fn().mockResolvedValue({ _id: mockCourse, deactivated: true }), // Course is deactivated
      } as unknown as mongoose.Query<any, any>);

    try {
      await Class.create({
        classCode: "CS101-01",
        courseCode: "CS101",
        academicYear: 2025,
        semester: "I",
        maxStudents: 50,
        schedule: "Mon-Wed 9:00-11:00",
        classroom: "Room 101",
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.courseCode).toBeDefined();
    }

    try {
      await Class.create({
        classCode: "CS101-01",
        courseCode: "CS101",
        academicYear: 2025,
        semester: "I",
        maxStudents: 50,
        schedule: "Mon-Wed 9:00-11:00",
        classroom: "Room 101",
      });
    } catch (err: any) {
      expect(err.message).toBe(
        'Course with code "CS101" is deactivated and cannot be used'
      );
    }
  });

  it("should not allow deleting a class if students are enrolled", async () => {
    const mockClass = new mongoose.Types.ObjectId();

    // Mock enrollment existence
    vi.spyOn(Enrollment, "exists").mockReturnValue({
      exec: vi.fn().mockResolvedValue(true),
    } as unknown as mongoose.Query<any, any>);

    const classDoc = await Class.create({
      classCode: "CS101-01",
      courseCode: "CS101",
      academicYear: 2025,
      semester: "I",
      maxStudents: 50,
      schedule: "Mon-Wed 9:00-11:00",
      classroom: "Room 101",
    });

    try {
      await Class.findOneAndDelete({ _id: classDoc._id });
    } catch (err: any) {
      expect(err).toBeInstanceOf(IntentionalError);
      expect(err.message).toBe(
        `Class "${classDoc.classCode}" cannot be deleted because students are enrolled. The class has been deactivated instead.`
      );
    }

    const updatedClass = await Class.findById(classDoc._id);
    expect(updatedClass?.deactivated).toBe(true);
  });

  it("should validate semester values", async () => {
    try {
      await Class.create({
        classCode: "CS101-01",
        courseCode: "CS101",
        academicYear: 2025,
        semester: "IV", // Invalid semester
        maxStudents: 50,
        schedule: "Mon-Wed 9:00-11:00",
        classroom: "Room 101",
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.semester).toBeDefined();
    }
  });

  it("should validate maxStudents minimum value", async () => {
    try {
      await Class.create({
        classCode: "CS101-01",
        courseCode: "CS101",
        academicYear: 2025,
        semester: "I",
        maxStudents: 0, // Below minimum value
        schedule: "Mon-Wed 9:00-11:00",
        classroom: "Room 101",
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.maxStudents).toBeDefined();
    }
  });

  it("should populate the course field when querying a class", async () => {
    const mockFaculty = new mongoose.Types.ObjectId();

    // Mock faculty existence
    vi.spyOn(Faculty, "findById").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockFaculty }),
    } as unknown as mongoose.Query<any, any>);

    const mockCourse = await Course.create({
      courseCode: "CS101",
      courseName: "Intro to Computer Science",
      courseCredits: 3,
      managingFaculty: mockFaculty,
      courseDescription: "An introductory course to computer science.",
    });

    vi.spyOn(Course, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue(mockCourse),
    } as unknown as mongoose.Query<any, any>);

    const classDoc = await Class.create({
      classCode: "CS101-01",
      courseCode: "CS101",
      academicYear: 2025,
      semester: "I",
      lecturers: [],
      maxStudents: 50,
      schedule: "Mon-Wed 9:00-11:00",
      classroom: "Room 101",
    });

    const populatedClass = (await Class.find({ _id: classDoc._id }).exec())[0];
    expect(populatedClass).toBeDefined();
    expect(populatedClass!!.course).toBeDefined();
    expect((populatedClass!!.course as unknown as ICourse).courseCode).toBe(
      mockCourse.courseCode
    );
    expect((populatedClass!!.course as unknown as ICourse).courseName).toBe(
      mockCourse.courseName
    );
  });
});
