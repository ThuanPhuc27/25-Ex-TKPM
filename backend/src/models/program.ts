import mongoose, { Schema, Document, Types } from "mongoose";

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
    programName: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProgram>("Program", ProgramSchema);
