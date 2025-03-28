import { getAllStudents, importStudent } from "@repositories/studentRepository";
import { Request, Response } from "express";
import { json2xml, xml2json } from "xml-js";
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
          message: "Invalid format. Please use 'json' or 'xml'",
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
  } catch (error: any) {
    logger.error(
      `[database]: Cannot export all students - ${error.message ?? error}`
    );
    res.status(http.INTERNAL_SERVER_ERROR).send({
      message: `${error.message ?? error}`,
    });
  }
};

type TextWrappedObject = { [key: string]: { _text: string } | any };

// Recursive unwrapText function to remove all `_text` properties
function unwrapText<T extends TextWrappedObject>(
  jsonArray: T[]
): Record<string, any>[] {
  return jsonArray.map((obj) => {
    let newObj: Record<string, any> = {};

    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (Object.keys(obj[key]).length === 0) {
          newObj[key] = ""; // If object is empty, assign an empty string
        } else if ("_text" in obj[key]) {
          newObj[key] = obj[key]._text; // If _text exists, take its value
        } else {
          newObj[key] = unwrapText([obj[key]])[0]; // Recursively call if nested object
        }
      } else {
        newObj[key] = obj[key]; // Keep as is if not an object
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
      importedStudents = req.body;
      if (!Array.isArray(importedStudents)) {
        logger.error(
          `[database]: Imported JSON data is not in the correct form (should be an array of student objects)`
        );
        res.status(http.BAD_REQUEST).send({
          message:
            "Imported JSON data is not in the correct form (should be an array of student objects)",
        });
        return;
      }
      break;
    case "application/xml":
      const xmlData = req.body as Buffer;
      // console.log("xmlData", xmlData);

      let jsonData: string;
      try {
        jsonData = xml2json(xmlData.toString(), {
          compact: true,
          spaces: 2,
          // alwaysArray: true,
        });
      } catch (error: any) {
        logger.error(
          `[database]: Cannot parse XML data to JSON - ${
            error.message ?? error
          }`
        );
        res.status(http.BAD_REQUEST).send({
          message: `Can't parse XML data to JSON - ${error.message ?? error}`,
        });
        return;
      }

      try {
        const parsedJsonData = JSON.parse(jsonData);
        // console.log("parsedJsonData", JSON.stringify(parsedJsonData));

        const studentsContainer = (
          Array.isArray(parsedJsonData.students.student)
            ? parsedJsonData.students.student
            : [parsedJsonData.students.student]
        ) as TextWrappedObject[];
        // console.log(JSON.stringify(studentsContainer));

        importedStudents = unwrapText(studentsContainer) as IStudentWithId[];
      } catch (error: any) {
        logger.error(
          `[database]: Cannot parse JSON data - ${error.message ?? error}`
        );
        res.status(http.BAD_REQUEST).send({
          message: `Can't parse JSON data - ${error.message ?? error}`,
        });
        return;
      }
      break;
    default:
      res.status(http.BAD_REQUEST).send({
        message:
          "Invalid content type. Please use 'application/json' or 'application/xml'",
      });
      return;
  }

  // Save imported students to database
  const replacedStudents: Record<string, IStudentWithId | null> = {};
  //console.log("importedStudents", importedStudents);
  const failedStudents: Record<string, string> = {};
  for (const student of importedStudents) {
    try {
      const replacedStudent = await importStudent(student);

      replacedStudents[`${student.studentId}`] = replacedStudent;
    } catch (error: any) {
      logger.error(
        `[database]: Cannot import student with student id ${
          student.studentId
        } - ${error.message ?? error}`
      );
      failedStudents[student.studentId] = error.message ?? "Unknown error";
    }
  }
  res.status(http.OK).json({
    replacedStudents,
    failedStudents,
  });
};
