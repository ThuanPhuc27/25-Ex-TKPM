import mongoose, { Schema, Document, Types } from "mongoose";
import { MODEL_NAMES } from "../constants/collectionNames";

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
    facultyName: {
      type: String,
      required: true,
      unique: [
        true,
        'Faculty name must be unique (faculty with name "{VALUE}" already exists)',
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFaculty>(MODEL_NAMES.FACULTY, FacultySchema);
