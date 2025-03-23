import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFaculty {
  name: string;
  code: string;
}

export interface IFacultyDocument
  extends Document<unknown, {}, IFaculty>,
    IFaculty {
  _id: Types.ObjectId;
}

const FacultySchema: Schema = new Schema<IFaculty>(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFaculty>("Faculty", FacultySchema);
