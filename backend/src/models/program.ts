import mongoose, { Schema, Document, Types } from "mongoose";
import { MODEL_NAMES } from "../constants/collectionNames";

export interface IProgram {
  programName: string;
}

export interface IProgramDocument
  extends Document<unknown, {}, IProgram>,
    IProgram {
  _id: Types.ObjectId;
}

const ProgramSchema: Schema = new Schema<IProgram>(
  {
    programName: {
      type: String,
      required: true,
      unique: [
        true,
        'Program name must be unique (program with name "{VALUE}" already exists)',
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProgram>(MODEL_NAMES.PROGRAM, ProgramSchema);
