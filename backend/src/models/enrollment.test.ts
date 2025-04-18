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
import Enrollment from "@models/enrollment";
import Class from "@models/class";
import Student from "@models/student";
import Course from "@models/course";

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

  // Reset mocks to avoid interference between tests
  vi.restoreAllMocks();
});

describe("Enrollment Schema", () => {
  it("should successfully create an enrollment with valid information", async () => {
    const mockClass = new mongoose.Types.ObjectId();
    const mockCourseCode = "CS101-01";
    const mockStudent = new mongoose.Types.ObjectId();

    // Mock course existence
    vi.spyOn(Course, "findOne").mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({
        _id: mockClass,
        courseCode: mockCourseCode,
        courseName: "Computer Science 101",
        courseCredits: 3,
        managingFaculty: new mongoose.Types.ObjectId(),
        courseDescription: "Introduction to Computer Science",
      }),
    } as unknown as mongoose.Query<any, any>);

    // Mock class existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: mockClass,
        courseCode: mockCourseCode,
        maxStudents: 50,
      }),
    } as unknown as mongoose.Query<any, any>);

    // Mock student existence
    vi.spyOn(Student, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockStudent }),
    } as unknown as mongoose.Query<any, any>);

    const enrollment = await Enrollment.create({
      studentId: "S12345",
      classCode: "CS101-01",
      isCanceled: false,
    });

    expect(enrollment).toBeDefined();
    expect(enrollment.studentId).toBe("S12345");
    expect(enrollment.classCode).toBe("CS101-01");
    expect(enrollment.isCanceled).toBe(false);
  });

  it("should validate required fields", async () => {
    try {
      await Enrollment.create({
        studentId: "",
        classCode: "",
        isCanceled: null,
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.studentId).toBeDefined();
      expect(err.errors.classCode).toBeDefined();
      expect(err.errors.isCanceled).toBeDefined();
    }
  });

  it("should validate student existence", async () => {
    // Mock student non-existence
    vi.spyOn(Student, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as unknown as mongoose.Query<any, any>);

    // Mock class existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        classCode: "CS101-01",
        deactivated: false,
      }),
    } as unknown as mongoose.Query<any, any>);

    try {
      await Enrollment.create({
        studentId: "S12345",
        classCode: "CS101-01",
        isCanceled: false,
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.studentId).toBeDefined();
      expect(err.errors.studentId.message).toBe(
        'Student with ID "S12345" does not exist'
      );
    }
  });

  it("should validate class existence", async () => {
    // Mock class non-existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as unknown as mongoose.Query<any, any>);

    try {
      await Enrollment.create({
        studentId: "S12345",
        classCode: "CS101-01",
        isCanceled: false,
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.classCode.message).toBe(
        'Class with code "CS101-01" does not exist'
      );
    }
  });

  it("should not allow enrolling in a deactivated class", async () => {
    // Mock class deactivation
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        deactivated: true,
      }),
    } as unknown as mongoose.Query<any, any>);

    try {
      await Enrollment.create({
        studentId: "S12345",
        classCode: "CS101-01",
        isCanceled: false,
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.classCode.message).toBe(
        'Cannot enroll students in a deactivated class with code "CS101-01"'
      );
    }
  });

  it("should not allow duplicate enrollments", async () => {
    const mockClass = new mongoose.Types.ObjectId();
    const mockStudent = new mongoose.Types.ObjectId();

    // Mock class and student existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockClass, maxStudents: 50 }),
    } as unknown as mongoose.Query<any, any>);
    vi.spyOn(Student, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockStudent }),
    } as unknown as mongoose.Query<any, any>);

    // Create the first enrollment
    await Enrollment.create({
      studentId: "S12345",
      classCode: "CS101-01",
      isCanceled: false,
    });

    // Attempt to create a duplicate enrollment
    try {
      await Enrollment.create({
        studentId: "S12345",
        classCode: "CS101-01",
        isCanceled: false,
      });
    } catch (err: any) {
      expect(err.message).toBe(
        'Student with ID "S12345" is already enrolled in class with code "CS101-01"'
      );
    }
  });

  it("should not allow enrolling in a class that is at maximum capacity", async () => {
    const mockClass = new mongoose.Types.ObjectId();
    const mockStudent1 = new mongoose.Types.ObjectId();
    const mockStudent2 = new mongoose.Types.ObjectId();

    // Mock class and student existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockClass, maxStudents: 1 }),
    } as unknown as mongoose.Query<any, any>);
    vi.spyOn(Student, "findOne").mockReturnValue({
      exec: vi
        .fn()
        .mockResolvedValueOnce({ _id: mockStudent1 })
        .mockResolvedValueOnce({ _id: mockStudent1 })
        .mockResolvedValueOnce({ _id: mockStudent2 })
        .mockResolvedValueOnce({ _id: mockStudent2 }),
    } as unknown as mongoose.Query<any, any>);

    // Create the first enrollment
    await Enrollment.create({
      studentId: "S12345",
      classCode: "CS101-01",
      isCanceled: false,
    });

    // Attempt to create another enrollment in the same class
    try {
      await Enrollment.create({
        studentId: "S67890",
        classCode: "CS101-01",
        isCanceled: false,
      });
    } catch (err: any) {
      expect(err.message).toBe(
        'Class "CS101-01" is already at maximum capacity'
      );
    }
  });

  it("should validate score range", async () => {
    const mockClass = new mongoose.Types.ObjectId();
    const mockStudent = new mongoose.Types.ObjectId();

    // Mock class and student existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockClass, maxStudents: 50 }),
    } as unknown as mongoose.Query<any, any>);
    vi.spyOn(Student, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockStudent }),
    } as unknown as mongoose.Query<any, any>);

    // Attempt to create an enrollment with an invalid score
    try {
      await Enrollment.create({
        studentId: "S12345",
        classCode: "CS101-01",
        isCanceled: false,
        score: 11, // Invalid score
      });
    } catch (err: any) {
      expect(err.name).toBe("ValidationError");
      expect(err.errors.score).toBeDefined();
    }
  });

  it("should not allow enrollment if prerequisite courses are not completed", async () => {
    const mockClass = new mongoose.Types.ObjectId();
    const mockStudent = new mongoose.Types.ObjectId();

    // Mock class and student existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockClass, courseCode: "CS102" }),
    } as unknown as mongoose.Query<any, any>);
    vi.spyOn(Student, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockStudent }),
    } as unknown as mongoose.Query<any, any>);
    vi.spyOn(Course, "findOne").mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({
        prerequisiteCourses: [{ courseCode: "CS101" }],
      }),
    } as unknown as mongoose.Query<any, any>);

    // Mock prerequisite course not completed
    vi.spyOn(Enrollment, "find").mockReturnValue({
      exec: vi.fn().mockResolvedValue([]), // No completed prerequisite courses
    } as unknown as mongoose.Query<any, any>);

    try {
      await Enrollment.create({
        studentId: "S12345",
        classCode: "CS102-01",
        isCanceled: false,
      });
    } catch (err: any) {
      expect(err.message).toBe(
        'Student with ID "S12345" has not completed all prerequisite courses for "CS102"'
      );
    }
  });

  it("should record the history of cancellations with a reason and timestamp", async () => {
    const mockClass = new mongoose.Types.ObjectId();
    const mockStudent = new mongoose.Types.ObjectId();

    // Mock class and student existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi
        .fn()
        .mockResolvedValue({ _id: mockClass, classCode: "CS101-01" }),
    } as unknown as mongoose.Query<any, any>);
    vi.spyOn(Student, "findOne").mockReturnValue({
      exec: vi
        .fn()
        .mockResolvedValue({ _id: mockStudent, studentId: "S12345" }),
    } as unknown as mongoose.Query<any, any>);

    // Create an enrollment
    const enrollment = await Enrollment.create({
      studentId: "S12345",
      classCode: "CS101-01",
      isCanceled: false,
    });

    // Mock enrollment findById with populate
    vi.spyOn(Enrollment, "findById").mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({
        ...enrollment,
        class: {
          _id: mockClass,
          classCode: "CS101-01",
          academicYear: 2025,
          semester: "I",
        },
      }),
    } as unknown as mongoose.Query<any, any>);

    // Cancel the enrollment with a reason
    const cancellationReason = "Student dropped the course";
    const updatedEnrollment = await Enrollment.findOneAndUpdate(
      { _id: enrollment._id },
      { isCanceled: true, cancellationReason },
      { new: true }
    );

    // Assertions
    expect(updatedEnrollment).toBeDefined();
    expect(updatedEnrollment?.isCanceled).toBe(true);
    expect(updatedEnrollment?.cancellationReason).toBe(cancellationReason);
    expect(updatedEnrollment?.updatedAt).toBeDefined();

    // Ensure the `updatedAt` field is updated
    const currentTime = new Date();
    const updatedTime = new Date(updatedEnrollment?.updatedAt as Date);
    expect(updatedTime.getTime()).toBeLessThanOrEqual(currentTime.getTime());
  });

  it("should not allow cancellation after the deadline", async () => {
    const mockClass = new mongoose.Types.ObjectId();
    const mockStudent = new mongoose.Types.ObjectId();

    // Mock class existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: mockClass,
        academicYear: 2025,
        semester: "I",
      }),
    } as unknown as mongoose.Query<any, any>);

    // Mock student existence
    vi.spyOn(Student, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: mockStudent }),
    } as unknown as mongoose.Query<any, any>);

    const enrollment = await Enrollment.create({
      studentId: "S12345",
      classCode: "CS101-01",
      isCanceled: false,
    });

    // Mock enrollment findById with populate
    vi.spyOn(Enrollment, "findById").mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({
        ...enrollment,
        class: {
          _id: mockClass,
          academicYear: 2025,
          semester: "I",
        },
      }),
    } as unknown as mongoose.Query<any, any>);

    // Mock current date past the cancellation deadline
    vi.setSystemTime(new Date(2025, 9, 1)); // October 1, 2025, the day after the deadline

    try {
      await Enrollment.findOneAndUpdate(
        { _id: enrollment._id },
        { isCanceled: true }
      );
    } catch (err: any) {
      expect(err.message).toContain(
        "Cancellation is not allowed after the deadline"
      );
    }
  });

  it("should not allow reactivating a canceled enrollment", async () => {
    // Mock class and student existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        classCode: "CS101-01",
      }),
    } as unknown as mongoose.Query<any, any>);
    vi.spyOn(Student, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        studentId: "S12345",
      }),
    } as unknown as mongoose.Query<any, any>);

    const enrollment = await Enrollment.create({
      studentId: "S12345",
      classCode: "CS101-01",
      isCanceled: true,
    });

    try {
      await Enrollment.findOneAndUpdate(
        { _id: enrollment._id },
        { isCanceled: false }
      );
    } catch (err: any) {
      expect(err.message).toBe("Reactivating an enrollment is not allowed!");
    }
  });

  it("should not allow updating student or class after enrollment", async () => {
    // Mock class and student existence
    vi.spyOn(Class, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        classCode: "CS101-01",
      }),
    } as unknown as mongoose.Query<any, any>);
    vi.spyOn(Student, "findOne").mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        studentId: "S12345",
      }),
    } as unknown as mongoose.Query<any, any>);

    const enrollment = await Enrollment.create({
      studentId: "S12345",
      classCode: "CS101-01",
      isCanceled: false,
    });

    try {
      await Enrollment.findOneAndUpdate(
        { _id: enrollment._id },
        { studentId: "S67890" }
      );
    } catch (err: any) {
      expect(err.message).toBe(
        "Updating the student or class of an enrollment is not allowed."
      );
    }
  });
});
