import mongoose, { Schema } from "mongoose";

export interface IIdentityDocument {
  type: "CMND" | "CCCD" | "passport"; // Loại giấy tờ
  number: string; // Số giấy tờ
  issueDate: Date; // Ngày cấp
  issuePlace: string; // Nơi cấp
  expirationDate: Date; // Ngày hết hạn
  hasChip?: boolean; // Chỉ áp dụng cho CCCD, có gắn chip hay không
  countryIssued?: string; // Quốc gia cấp, chỉ áp dụng cho passport
  notes?: string; // Ghi chú, nếu có
}

export type IStudentWithId = IStudent & { _id: mongoose.Types.ObjectId };

export interface IAddress {
  street: string; // Số nhà, tên đường
  ward: string; // Phường/Xã
  district: string; // Quận/Huyện
  city: string; // Tỉnh/Thành phố
  country: string; // Quốc gia
}

export interface IStudent {
  studentId: string;
  fullName: string;
  birthDate: Date;
  sex: string;
  faculty: string;
  schoolYear: number;
  program: string;
  permanentAddress?: IAddress; // Địa chỉ thường trú
  temporaryAddress?: IAddress; // Địa chỉ tạm trú
  mailingAddress?: IAddress; // Địa chỉ nhận thư
  identityDocuments: IIdentityDocument[]; // Giấy tờ chứng minh nhân thân
  nationality: string; // Quốc tịch
  email: string;
  phone: string;
  status: string;
}

const studentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    sex: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
    faculty: { type: String, required: true },
    schoolYear: { type: Number, required: true },
    program: { type: String, required: true },
    permanentAddress: {
      street: { type: String, required: true },
      ward: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    temporaryAddress: {
      street: { type: String },
      ward: { type: String },
      district: { type: String },
      city: { type: String },
      country: { type: String },
    },
    mailingAddress: {
      street: { type: String },
      ward: { type: String },
      district: { type: String },
      city: { type: String },
      country: { type: String },
    },
    identityDocuments: [
      {
        type: { type: String, enum: ["CMND", "CCCD", "passport"], required: true },
        number: { type: String, required: true },
        issueDate: { type: Date, required: true },
        issuePlace: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        hasChip: { type: Boolean },
        countryIssued: { type: String },
        notes: { type: String },
      },
    ],
    nationality: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Graduated", "Dropped out", "Paused"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;
