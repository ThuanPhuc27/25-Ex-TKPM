import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStudentStatus {
  name: string;
}

export interface IStudentStatusDocument
  extends Document<unknown, {}, IStudentStatus> {
  _id: Types.ObjectId;
  name: string;
}

const StudentStatusSchema: Schema = new Schema<IStudentStatus>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStudentStatus>(
  "StudentStatus",
  StudentStatusSchema
);
