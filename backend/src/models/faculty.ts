import mongoose, { Schema } from "mongoose";

export type IFalcuty = {
  falcutyId: string;
  falcutyName: string;
};

const falcutySchema = new Schema<IFalcuty>(
  {
    falcutyId: { type: String, required: true, unique: true },
    falcutyName: { type: String, required: true },
  },
  { timestamps: true }
);

const Falcuty = mongoose.model("Falcuty", falcutySchema);

export { Falcuty };
