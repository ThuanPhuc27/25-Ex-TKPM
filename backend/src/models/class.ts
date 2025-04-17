import mongoose, { Types, Schema, Document } from "mongoose";
import { MODEL_NAMES } from "@collectionNames";
import { ICourseDocument } from "./course";
import { IntentionalError } from "@utils/intentionalError";

export interface IClass {
  classCode: string; // Unique identifier for the class
  course?: Types.ObjectId; // Reference to the course (optional, populated in middleware)
  courseCode: string; // Reference to the course by its code (string)
  academicYear: number; // Academic year
  semester: "I" | "II" | "III"; // Semester as Roman numerals

  lecturers: Types.ObjectId[]; // List of lecturers (empty for now)
  maxStudents: number; // Maximum number of students
  schedule: string; // Class schedule (e.g., "Mon-Wed 9:00-11:00")
  classroom: string; // Classroom location

  deactivated?: boolean; // Optional field to indicate if the class is deactivated
}

export interface IClassDocument extends Document<unknown, {}, IClass>, IClass {
  _id: Types.ObjectId;
}

const ClassSchema: Schema = new Schema<IClass>(
  {
    classCode: {
      type: String,
      required: true,
      unique: true,
    },
    course: {
      type: Types.ObjectId,
      required: false,
      ref: MODEL_NAMES.COURSE,
    },
    courseCode: {
      type: String,
      required: true,
      validate: [
        {
          validator: async function (v: string) {
            const course = await mongoose.models[MODEL_NAMES.COURSE].findOne({
              courseCode: v,
            });
            return !!course;
          },
          message: 'Course with code "{VALUE}" does not exist',
        },
        {
          validator: async function (v: string) {
            const course: ICourseDocument | null = await mongoose.models[
              MODEL_NAMES.COURSE
            ].findOne({
              courseCode: v,
            });
            if (course && course.deactivated) {
              return false; // Course is deactivated
            }
            return true;
          },
          message:
            'Course with code "{VALUE}" is deactivated and cannot be used',
        },
      ],
    },
    academicYear: {
      type: Number,
      required: true,
    },
    semester: {
      type: String,
      required: true,
      enum: ["I", "II", "III"], // Roman numerals for semesters
      message: 'Semester must be one of "I", "II", or "III", got "{VALUE}"',
    },
    lecturers: {
      type: [Schema.Types.ObjectId],
      ref: MODEL_NAMES.LECTURER,
      default: [],
    },
    maxStudents: {
      type: Number,
      required: true,
      min: [1, "Maximum number of students must be at least 1"],
    },
    schedule: {
      type: String,
      required: true,
    },
    classroom: {
      type: String,
      required: true,
    },
    deactivated: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

// Populate the course field when saving a new class
// or updating an existing class with a new courseCode
ClassSchema.pre("save", async function () {
  if (this.isNew || this.isModified("courseCode")) {
    const course: IClassDocument | null = await mongoose.models[
      MODEL_NAMES.COURSE
    ].findOne({
      courseCode: this.courseCode,
    });

    if (!course) {
      throw new Error(`Course with code "${this.courseCode}" does not exist`);
    }

    this.course = course._id;
  }
});

// Populate the course field when finding classes
ClassSchema.pre("find", function () {
  this.populate("course");
});

ClassSchema.pre("findOneAndDelete", async function () {
  const classId = this.getFilter()._id; // Get the class ID from the query
  const classDoc: IClass | null = await mongoose.models[MODEL_NAMES.CLASS]
    .findById(classId)
    .exec();

  if (!classDoc) {
    throw new Error(`Class with id ${classId} not found`);
  }

  if (classDoc.deactivated) {
    throw new Error(`Class "${classDoc.classCode}" is already deactivated.`);
  }

  // Check if there are any students enrolled in the class
  const enrollmentExists = await mongoose.models[MODEL_NAMES.ENROLLMENT].exists(
    {
      class: classId,
    }
  );

  if (enrollmentExists) {
    // If students are enrolled, set the class as deactivated instead of deleting
    await mongoose.models[MODEL_NAMES.CLASS].updateOne(
      { _id: classId },
      { $set: { deactivated: true } }
    );

    throw new IntentionalError(
      `Class "${classDoc.classCode}" cannot be deleted because students are enrolled. The class has been deactivated instead.`
    );
  }
});

export default mongoose.model<IClass>(MODEL_NAMES.CLASS, ClassSchema);
