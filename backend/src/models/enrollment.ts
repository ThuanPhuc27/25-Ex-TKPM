import mongoose, { Types, Schema, Document, UpdateQuery } from "mongoose";
import { MODEL_NAMES } from "@collectionNames";
import { IClassDocument } from "@models/class";
import { IStudentWithId } from "@models/student";
import { ICourseDocument } from "@models/course";

export interface IEnrollment {
  student?: Types.ObjectId; // Reference to the student (optional, populated in middleware)
  studentId: string; // Reference to the student by their ID (string)
  class?: Types.ObjectId; // Reference to the class (optional, populated in middleware)
  classCode: string; // Reference to the class by its code (string)
  isCanceled: boolean; // Indicates if the enrollment has been canceled
  cancellationReason?: string; // Optional field for cancellation reason
  score?: number; // Optional field for storing the score of the student in the class, may expand to `scores` in the future

  createdAt?: Date; // Store the date of enrollment creation
  updatedAt?: Date; // Store the cancel date if the enrollment is canceled
}

export interface IEnrollmentDocument
  extends Document<unknown, {}, IEnrollment>,
    IEnrollment {
  _id: Types.ObjectId;
}

const EnrollmentSchema: Schema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.STUDENT,
      required: false, // Optional, populated in middleware
    },
    studentId: {
      type: String,
      required: true,
      validate: {
        validator: async function (v: string) {
          const student = await mongoose.models[MODEL_NAMES.STUDENT]
            .findOne({
              studentId: v,
            })
            .exec();
          return !!student;
        },
        message: 'Student with ID "{VALUE}" does not exist',
      },
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.CLASS,
      required: false, // Optional, populated in middleware
    },
    classCode: {
      type: String,
      required: true,
      validate: [
        {
          validator: async function (v: string) {
            const classDoc = await mongoose.models[MODEL_NAMES.CLASS]
              .findOne({
                classCode: v,
              })
              .exec();
            return !!classDoc;
          },
          message: 'Class with code "{VALUE}" does not exist',
        },
        {
          validator: async function (v: string) {
            const classDoc = await mongoose.models[MODEL_NAMES.CLASS]
              .findOne({
                classCode: v,
              })
              .exec();
            return !classDoc?.deactivated;
          },
          message:
            'Cannot enroll students in a deactivated class with code "{VALUE}"',
        },
      ],
    },
    isCanceled: {
      type: Boolean,
      required: true,
      default: false,
    },
    cancellationReason: {
      type: String,
      required: false,
    },
    score: {
      type: Number,
      required: false, // Optional, as scores may not be assigned immediately
      min: [0, "Score cannot be less than 0"],
      max: [10, "Score cannot be greater than 10"],
      default: 0,

    },
  },
  { timestamps: true }
);

// Middleware to handle creation
EnrollmentSchema.pre("save", async function () {
  const enrollment: IEnrollment = this as unknown as IEnrollmentDocument;

  // Populate the `class` field using `classCode`
  const existingClass: IClassDocument | null = await mongoose.models[
    MODEL_NAMES.CLASS
  ]
    .findOne({ classCode: enrollment.classCode })
    .exec();
  if (!existingClass) {
    throw new Error(`Class with code "${enrollment.classCode}" does not exist`);
  }
  enrollment.class = existingClass._id;

  // Populate the `student` field using `studentId`
  const existingStudent: IStudentWithId | null = await mongoose.models[
    MODEL_NAMES.STUDENT
  ]
    .findOne({
      studentId: enrollment.studentId,
    })
    .exec();
  if (!existingStudent) {
    throw new Error(`Student with ID "${enrollment.studentId}" does not exist`);
  }
  enrollment.student = existingStudent._id;

  // Check if the student is already enrolled in the class
  const existingEnrollment = await mongoose.models[MODEL_NAMES.ENROLLMENT]
    .findOne({
      student: enrollment.student,
      class: enrollment.class,
      isCanceled: false,
    })
    .exec();
  if (existingEnrollment) {
    throw new Error(
      `Student with ID "${enrollment.studentId}" is already enrolled in class with code "${enrollment.classCode}"`
    );
  }

  // Check prerequisite courses
  const courseDoc: ICourseDocument = await mongoose.models[MODEL_NAMES.COURSE]
    .findOne({ courseCode: existingClass.courseCode })
    .populate("prequisiteCourses")
    .exec();
  const populatedPrequisiteCourses: IClassDocument[] =
    (courseDoc?.prequisiteCourses as any[]) || [];
  if (courseDoc?.prequisiteCourses?.length) {
    const completedCourses = await mongoose.models[MODEL_NAMES.ENROLLMENT].find(
      {
        student: enrollment.student,
        classCode: {
          $in: populatedPrequisiteCourses.map((c) => c.courseCode),
        },
        isCanceled: false,
      }
    );
    if (completedCourses.length < populatedPrequisiteCourses.length) {
      throw new Error(
        `Student with ID "${enrollment.studentId}" has not completed all prerequisite courses for "${existingClass.courseCode}"`
      );
    }
  }

  // Check class capacity
  const enrollmentCount = await mongoose.models[
    MODEL_NAMES.ENROLLMENT
  ].countDocuments({
    class: enrollment.class,
    isCanceled: false,
  });
  if (enrollmentCount >= existingClass.maxStudents) {
    throw new Error(
      `Class "${enrollment.classCode}" is already at maximum capacity`
    );
  }
});

/**
 * Represents the offset in months to calculate the next year.
 * This constant is used to determine the number of months
 * required to transition from the current year to the next year.
 */
const NEXT_YEAR = 12;
/**
 * A mapping of semester identifiers to their corresponding start month offsets.
 *
 * - `I`: Represents the first semester, starting in September of the current year.
 * - `II`: Represents the second semester, starting in February of the next year.
 * - `III`: Represents the third semester, starting in July of the next year.
 *
 * The offsets are calculated relative to the current year or the next year.
 */
const SEMESTER_START_MONTH_OFFSET = {
  I: 8, // September (current year)
  II: NEXT_YEAR + 1, // February (next year)
  III: NEXT_YEAR + 6, // July (next year)
} as const;

/**
 * Represents the number of months added to the semester start date
 * to calculate the enrollment cancellation deadline.
 *
 * For example, if the semester starts in September (month 8) and the offset is 1,
 * the cancellation deadline will be the 1st of October (month 9).
 *
 * @constant
 */
const DEADLINE_MONTH_OFFSET = 1; // 1 month after the semester start

// Middleware to handle updates
EnrollmentSchema.pre("findOneAndUpdate", async function () {
  const update: UpdateQuery<Partial<IEnrollment>> | null = this.getUpdate();
  if (!update) {
    return;
  }

  const enrollmentId = this.getFilter()._id;
  const enrollment: IEnrollment = await mongoose.models[MODEL_NAMES.ENROLLMENT]
    .findById(enrollmentId)
    .populate("class")
    .exec();

  if (!enrollment) {
    throw new Error(`Enrollment with ID ${enrollmentId} not found`);
  }

  // if (enrollment.isCanceled) {
  //   throw new Error("Cannot update a canceled enrollment.");
  // }

  // Prevent updating the student or class after enrollment
  if (
    update?.student ||
    update?.studentId ||
    update?.class ||
    update?.classCode
  ) {
    throw new Error(
      "Updating the student or class of an enrollment is not allowed."
    );
  }

  // Validate cancellation
  if (update?.isCanceled === false) {
    throw new Error("Reactivating an enrollment is not allowed!");
  }

  // Validate score update
  if (update?.score !== undefined) {
    if (update.score < 0 || update.score > 10) {
      throw new Error("Score must be between 0 and 10.");
    }
    return; // No need to check further if only the score is being updated
  }

  // Extract the populated class document
  const classDoc = enrollment.class as any as IClassDocument;

  // Calculate the semester start month and year
  const semesterStartMonth = SEMESTER_START_MONTH_OFFSET[classDoc.semester];
  if (semesterStartMonth === undefined) {
    throw new Error(`Invalid semester "${classDoc.semester}" found`);
  }

  const cancellationDeadline = new Date(
    classDoc.academicYear +
      (semesterStartMonth + DEADLINE_MONTH_OFFSET) / NEXT_YEAR,
    (semesterStartMonth + DEADLINE_MONTH_OFFSET) % NEXT_YEAR,
    1 // First day of the month
  );

  const currentDate = new Date();
  if (currentDate > cancellationDeadline) {
    throw new Error(
      `Cancellation is not allowed after the deadline (${cancellationDeadline.toDateString()})`
    );
  }
});

// Populate the student and class fields when finding enrollments
EnrollmentSchema.pre("find", function () {
  this.populate("student").populate("class");
});

export default mongoose.model<IEnrollment>(
  MODEL_NAMES.ENROLLMENT,
  EnrollmentSchema
);
