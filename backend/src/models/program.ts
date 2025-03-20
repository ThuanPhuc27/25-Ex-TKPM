import mongoose, { Schema, Document } from 'mongoose';

export interface IProgram extends Document {
  name: string; 
  code: string; 
}

const ProgramSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }, 
  },
  { timestamps: true }
);

export default mongoose.model<IProgram>('Program', ProgramSchema);
