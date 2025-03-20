import { Falcuty, IFalcuty } from "@models/faculty";

const createFaculty = async (faculty: IFalcuty) => {
  const newFaculty = new Falcuty(faculty);
  return await newFaculty.save();
};

const renameFaculty = async (facultyId: string, newName: string) => {
  return await Falcuty.findOneAndUpdate(
    { facultyId: facultyId },
    { falcutyName: newName }
  ).exec();
};

const getAllFaculties = async () => {
  return await Falcuty.find().exec();
};

const getFacultyByName = async (facultyName: string) => {
  return await Falcuty.find({ facultyName }).exec();
};
