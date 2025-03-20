import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentStatus extends Document {
  name: string; 
}

const StudentStatusSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStudentStatus>('StudentStatus', StudentStatusSchema);
