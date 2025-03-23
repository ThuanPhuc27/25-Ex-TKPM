import mongoose, { Schema } from "mongoose";

export interface IIdentityDocument {
  type: "CMND" | "CCCD" | "passport";
  number: string;
  issueDate: Date;
  issuePlace: string;
  expirationDate: Date;
  hasChip?: boolean; // only for "CCCD" type
  issueCountry?: string; // only for "passport" type
  notes?: string; // only for "passport" type
}

export interface IAddress {
  street: string; // house number and street name
  ward: string; // ward or commune name
  district: string; // district or town name
  city: string; // city or province
  country: string;
}

export interface IStudent {
  studentId: string;
  fullName: string;
  birthDate: Date;
  sex: string;
  faculty: string;
  schoolYear: number;
  program: string;
  permanentAddress?: IAddress;
  temporaryAddress?: IAddress;
  mailingAddress?: IAddress;
  identityDocuments: IIdentityDocument[];
  nationality: string;
  email: string;
  phone: string;
  status: string;
}

export type IStudentWithId = IStudent & { _id?: mongoose.Types.ObjectId };

const addressSchema = new Schema<IAddress>(
  {
    street: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const identityDocumentSchema = new Schema<IIdentityDocument>(
  {
    type: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["cmnd", "cccd", "passport"],
      required: true,
    },
    number: { type: String, required: true },
    issueDate: { type: Date, required: true },
    issuePlace: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    hasChip: { type: Boolean, required: false },
    issueCountry: { type: String, required: false },
    notes: { type: String, required: false },
  },
  {
    _id: false,
  }
);

const studentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    sex: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["male", "female", "other"],
      default: "other",
    },
    faculty: { type: String, required: true },
    schoolYear: { type: Number, required: true },
    program: { type: String, required: true },
    permanentAddress: { type: addressSchema, required: false },
    temporaryAddress: { type: addressSchema, required: false },
    mailingAddress: { type: addressSchema, required: false },
    identityDocuments: {
      type: [identityDocumentSchema],
      required: true,
      minlength: 1,
    },
    nationality: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      trim: true,
      lowercase: true,
      default: "active",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;
