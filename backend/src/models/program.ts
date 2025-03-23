import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProgram {
  name: string;
  code: string;
}

export interface IProgramDocument extends Document<unknown, {}, IProgram> {
  _id: Types.ObjectId;
  name: string;
  code: string;
}

const ProgramSchema: Schema = new Schema<IProgram>(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProgram>("Program", ProgramSchema);
