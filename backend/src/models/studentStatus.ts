import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStudentStatus {
  statusName: string;
}

export interface IStudentStatusDocument
  extends Document<unknown, {}, IStudentStatus>,
    IStudentStatus {
  _id: Types.ObjectId;
}

const StudentStatusSchema: Schema = new Schema<IStudentStatus>(
  {
    statusName: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStudentStatus>(
  "StudentStatus",
  StudentStatusSchema
);
