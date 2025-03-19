import mongoose, { Schema } from "mongoose";

export interface IStudent {
  studentId: string;
  fullName: string;
  birthDate: Date;
  sex: string;
  faculty: string;
  schoolYear: number;
  program: string;
  address: string;
  email: string;
  phone: string;
  status: string;
}

export type IStudentWithId = IStudent & { _id: mongoose.Types.ObjectId };

// Mongoose checks to make sure that every path in your schema is defined in your document interface
// But it does NOT check for paths that exist in your document interface but not in your schema.
const studentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: true },
    fullName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    sex: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
    faculty: { type: String, required: true },
    schoolYear: { type: Number, required: true },
    program: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Graduated", "Dropped out", "Paused"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;
