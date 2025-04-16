import mongoose, { Types, Schema, Document } from "mongoose";
import { MODEL_NAMES } from "@collectionNames";

export interface IClass {
  classCode: string; // Unique identifier for the class
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
      unique: [
        true,
        'Class code must be unique (class with code "{VALUE}" already exists)',
      ],
    },
    courseCode: {
      type: String,
      required: true,
      validate: {
        validator: async function (v: string) {
          const course = await mongoose.models[MODEL_NAMES.COURSE].findOne({
            courseCode: v,
          });
          return !!course;
        },
        message: 'Course with code "{VALUE}" does not exist',
      },
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
  }
});

export default mongoose.model<IClass>(MODEL_NAMES.CLASS, ClassSchema);
