import mongoose, { Schema } from "mongoose";

export interface IStatus {
  statusId: string;
  statusName: string;
}

export interface IProgram {
  programId: string;
  programName: string;
}

export interface IInfo {
  statuses: {
    statusId: string;
    statusName: string;
  }[];
  programs: {
    programId: string;
    programName: string;
  }[];
}

const statusSchema = new Schema<IStatus>(
  {
    statusId: { type: String, required: true, unique: true },
    statusName: { type: String, required: true },
  },
  {
    id: false,
  }
);

const programSchema = new Schema<IProgram>(
  {
    programId: { type: String, required: true, unique: true },
    programName: { type: String, required: true },
  },
  {
    id: false,
  }
);

const infoSchema = new Schema<IInfo>(
  {
    statuses: [statusSchema],
    programs: [programSchema],
  },
  { timestamps: true }
);

const Info = mongoose.model("Info", infoSchema);

export default { Info };
