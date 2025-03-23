import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFaculty {
  facultyName: string;
}

export interface IFacultyDocument
  extends Document<unknown, {}, IFaculty>,
    IFaculty {
  _id: Types.ObjectId;
}

const FacultySchema: Schema = new Schema<IFaculty>(
  {
    facultyName: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFaculty>("Faculty", FacultySchema);
