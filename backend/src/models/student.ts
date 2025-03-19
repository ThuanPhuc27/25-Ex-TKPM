import mongoose, { Schema, Document } from 'mongoose';

// Tạo interface cho model
export interface IStudent extends Document {
  studentId: string;
  fullName: string;
  birthDate: Date;
  sex: string;
  faculty: string;
  schoolYear: number;
  program: string;
  address: string;
  email: string;
  phone: string;
  status: string;
}

// Tạo schema cho model
const studentSchema: Schema<IStudent> = new Schema(
  {
    studentId: { type: String, required: true },
    fullName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    sex: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    faculty: { type: String, required: true },
    schoolYear: { type: Number, required: true },
    program: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true } 
);

// Tạo mongoose model từ schema
export default mongoose.model<IStudent>('Student', studentSchema);

