import { getAllStudents, importStudent } from "@repositories/studentRepository";
import { Request, Response } from "express";
import { json2xml, xml2js, xml2json } from "xml-js";
import { parseStringPromise } from "xml2js";
import logger from "../logger";
import { http } from "../constants/httpStatusCodes";
import { IStudent, IStudentWithId } from "@models/student";
import { Document } from "mongoose";

export const exportAllStudentsController = async (
  req: Request,
  res: Response
) => {
  try {
    let format = req.query.format;
    if (!format) {
      format = "json";
    } else {
      format = format.toString().trim().toLowerCase();
      if (format !== "xml" && format !== "json") {
        res.status(http.BAD_REQUEST).send({
          reason: "Invalid format. Please use 'json' or 'xml'",
        });
        return;
      }
    }

    const allStudents: IStudent[] = await getAllStudents();
    const timestamp = new Date().toISOString();
    if (format === "json") {
      res
        .contentType("application/json")
        .attachment(`students-${timestamp}.json`)
        .send(JSON.stringify(allStudents));
      logger.info(`[database]: Exported all students to JSON`);
    } else {
      const formattedStudents = {
        _declaration: {
          _attributes: {
            version: "1.0",
            encoding: "utf-8",
          },
        },
        students: {
          student: allStudents.map((student: IStudent) => ({
            ...(student as any as Document<unknown, {}, IStudent>).toObject(),
          })),
        },
      };
      logger.info(JSON.stringify(formattedStudents));
      const xmlContent = json2xml(JSON.stringify(formattedStudents), {
        compact: true,
        spaces: 2,
      });
      res
        .contentType("application/xml")
        .attachment(`students-${timestamp}.xml`)
        .send(xmlContent);
      logger.info(`[database]: Exported all students to XML`);
    }
  } catch (error) {
    logger.error(`[database]: Cannot export all students - ${error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ reason: `Cannot export all students - ${error}` });
  }
};

type TextWrappedObject = { [key: string]: { _text: string } | any };

function unwrapText<T extends TextWrappedObject>(
  jsonArray: T[]
): Record<string, any>[] {
  return jsonArray.map((obj) => {
    let newObj: Record<string, any> = {};
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === "object" && "_text" in obj[key]) {
        newObj[key] = obj[key]._text; // Extract the text value
      } else {
        newObj[key] = obj[key]; // Keep other values as they are
      }
    }
    return newObj;
  });
}

export const importStudentsController = async (req: Request, res: Response) => {
  let importedStudents: IStudent[] = [];
  const contentType = req.get("content-type");
  switch (contentType) {
    case "application/json":
      try {
        importedStudents = req.body;
      } catch (error: any) {
        logger.error(
          `[database]: Cannot parse JSON data - ${error?.message || error}`
        );
        res.status(http.BAD_REQUEST).send({
          reason: "Can't parse JSON data - " + error,
        });
        return;
      }
      break;
    case "application/xml":
      const xmlData = req.body as Buffer;
      // console.log(xmlData.toString());

      let jsonData: string;
      try {
        jsonData = xml2json(xmlData.toString(), {
          compact: true,
          spaces: 2,
        });
        // console.log(jsonData);
      } catch (error: any) {
        logger.error(
          `[database]: Cannot parse XML data to JSON - ${
            error?.message || error
          }`
        );
        res.status(http.BAD_REQUEST).send({
          reason: "Can't parse XML data to JSON - " + error,
        });
        return;
      }

      try {
        const parsedJsonData = JSON.parse(jsonData);
        const studentsContainer = parsedJsonData.students as TextWrappedObject;

        importedStudents = (
          unwrapText(studentsContainer.student as any[]) as IStudentWithId[]
        ).map((student) => {
          delete student._id;
          return student;
        });
        // console.log(JSON.stringify(importedStudents));
      } catch (error: any) {
        logger.error(
          `[database]: Cannot parse JSON data - ${error?.message || error}`
        );
        res.status(http.BAD_REQUEST).send({
          reason: "Can't parse JSON data - " + error,
        });
        return;
      }

      // try {
      //   const conversionResult: Object = xml2js(xmlData.toString());
      //   console.log(JSON.stringify(conversionResult));

      //   // type StudentAttributes = Record<string, string>;

      //   // interface StudentElement {
      //   //   type: string;
      //   //   name: string;
      //   //   attributes: StudentAttributes;
      //   // }

      //   // interface StudentsContainer {
      //   //   type: string;
      //   //   name: string;
      //   //   elements: StudentElement[];
      //   // }

      //   // interface RootObject {
      //   //   elements: StudentsContainer[];
      //   // }

      //   // function extractAttributes(data: RootObject): StudentAttributes[] {
      //   //   return data.elements.flatMap((container) =>
      //   //     container.elements.map((student) => student.attributes)
      //   //   );
      //   // }

      //   // importedStudents = extractAttributes(
      //   //   conversionResult as RootObject
      //   // ) as unknown as IStudentWithId[];

      //   importedStudents = (conversionResult as any).students
      //     .student as IStudentWithId[];
      // } catch (error: any) {
      //   logger.error(
      //     `[database]: Cannot parse XML data - ${error?.message || error}`
      //   );
      //   res.status(http.BAD_REQUEST).send({
      //     reason: "Can't parse XML data - " + error,
      //   });
      //   return;
      // }

      // try {
      //   importedStudents = await parseStringPromise(xmlData.toString());
      // } catch (error: any) {
      //   logger.error(
      //     `[database]: Cannot parse XML data - ${error?.message || error}`
      //   );
      //   res.status(http.BAD_REQUEST).send({
      //     reason: "Can't parse XML data - " + error,
      //   });
      //   return;
      // }
      break;
    default:
      res.status(http.BAD_REQUEST).send({
        reason:
          "Invalid content type. Please use 'application/json' or 'application/xml'",
      });
  }

  // Save imported students to database
  const replacedStudents: Record<string, IStudentWithId | null> = {};
  const failedStudents: Record<string, string> = {};
  for (const student of importedStudents) {
    try {
      const replacedStudent = await importStudent(student);
      replacedStudents[`${student.studentId}`] = replacedStudent;
    } catch (error: any) {
      logger.error(
        `[database]: Cannot import student with student id ${student.studentId} - ${error}`
      );
      failedStudents[student.studentId] = error?.message || "Unknown error";
    }
  }
  res.status(http.OK).json({
    replacedStudents,
    failedStudents,
  });
};
