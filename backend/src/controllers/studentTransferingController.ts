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

// Hàm unwrapText đệ quy để loại bỏ tất cả `_text`
function unwrapText<T extends TextWrappedObject>(
  jsonArray: T[]
): Record<string, any>[] {
  return jsonArray.map((obj) => {
    let newObj: Record<string, any> = {};

    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (Object.keys(obj[key]).length === 0) {
          newObj[key] = ""; // Nếu object rỗng, gán thành chuỗi rỗng
        } else if ("_text" in obj[key]) {
          newObj[key] = obj[key]._text; // Nếu có _text, lấy giá trị
        } else {
          newObj[key] = unwrapText([obj[key]])[0]; // Gọi đệ quy nếu là object lồng nhau
        }
      } else {
        newObj[key] = obj[key]; // Giữ nguyên nếu không phải object
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
          reason:
            "Imported JSON data is not in the correct form (should be an array of student objects)",
        });
        return;
      }

      break;
    case "application/xml":
      const xmlData = req.body as Buffer;
      console.log("xmlData", xmlData);

      let jsonData: string;
      try {
        jsonData = xml2json(xmlData.toString(), {
          compact: true,
          spaces: 2,
        });
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
        console.log("parsedJsonData", JSON.stringify(parsedJsonData));
        const studentsContainer = parsedJsonData.students as TextWrappedObject;

        importedStudents = (
          unwrapText(studentsContainer.student as any[]) as IStudentWithId[]
        ).map((student) => {
          // Remove _id field from the student object
          delete student._id;
          return student;
        });
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
    default:
      res.status(http.BAD_REQUEST).send({
        reason:
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
      console.log("studnet", JSON.stringify(student));
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
