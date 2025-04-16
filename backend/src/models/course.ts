import mongoose, { Types, Schema, Document, UpdateQuery } from "mongoose";
import { MODEL_NAMES } from "@collectionNames";

export interface ICourse {
  courseCode: string;
  courseName: string;
  courseCredits: number;
  managingFaculty: Types.ObjectId;
  courseDescription: string;

  prequisiteCourses?: Types.ObjectId[]; // Array of ObjectId references to other courses
  deactivated?: boolean; // Optional field to indicate if the course is deactivated

  createdAt?: Date; // Optional field to store the creation date
  updatedAt?: Date; // Optional field to store the last update date
}

export interface ICourseDocument
  extends Document<unknown, {}, ICourse>,
    ICourse {
  _id: Types.ObjectId;
}

const CourseSchema = new Schema<ICourse>(
  {
    courseCode: {
      type: String,
      required: true,
      unique: [
        true,
        'Course code must be unique (course with code "{VALUE}" already exists)',
      ],
    },
    courseName: {
      type: String,
      required: true,
    },
    courseCredits: {
      type: Number,
      required: true,
      min: [2, "Course credits cannot be less than 2"],
    },
    managingFaculty: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.FACULTY,
      required: true,
      validate: {
        validator: async function (v: Types.ObjectId) {
          console.log("mongoose.models: ", mongoose.models);
          const faculty = await mongoose.models[MODEL_NAMES.FACULTY]
            .findById(v)
            .exec();
          console.log("Faculty found:", faculty);
          return !!faculty;
        },
        message: 'Faculty with id "{VALUE}" does not exist',
      },
    },
    courseDescription: {
      type: String,
      required: true,
    },
    prequisiteCourses: [
      {
        type: Types.ObjectId,
        ref: MODEL_NAMES.COURSE,
        validate: {
          validator: async function (v: Types.ObjectId) {
            const course = await mongoose.models[MODEL_NAMES.COURSE]
              .findById(v)
              .exec();
            return !!course;
          },
          message: 'Course with id "{VALUE}" does not exist',
        },
      },
    ],
    deactivated: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

const DELETE_INTERVAL_IN_MINUTES = 1;

CourseSchema.pre("updateOne", async function () {
  const update: UpdateQuery<Partial<ICourse>> | null = this.getUpdate();
  if (!update) {
    return;
  }

  // Prevent updating the course code
  if (update?.courseCode) {
    throw new Error("Updating course code is not allowed.");
  }

  // Prevent updating course credits if they exist in enrollments
  const courseId = this.getFilter()._id;
  const existingEnrollments = await mongoose.models[MODEL_NAMES.ENROLLMENT]
    .exists({
      course: courseId,
    })
    .exec();

  if (existingEnrollments && update?.courseCredits) {
    throw new Error(
      "Updating course credits is not allowed as enrollments exist for this course."
    );
  }

  // Validate managing faculty if being updated
  if (update?.managingFaculty) {
    const existingFaculty = await mongoose.models[MODEL_NAMES.FACULTY].exists({
      _id: update.managingFaculty,
    });

    if (!existingFaculty) {
      throw new Error("The specified managing faculty does not exist.");
    }
  }
});

CourseSchema.pre("deleteOne", async function () {
  const courseId = this.getFilter()._id; // Get the course ID from the query
  const course: ICourse | null = await mongoose.models[MODEL_NAMES.COURSE]
    .findById(courseId)
    .exec();

  if (!course) {
    throw new Error(`Course with id ${courseId} not found`);
  }

  if (course.deactivated) {
    throw new Error(`Course "${course.courseCode}" is already deactivated.`);
  }

  const currentTimestamp = new Date().getTime();
  const createdAtTimestamp = new Date(
    course?.createdAt || currentTimestamp
  ).getTime();
  if (
    (currentTimestamp - createdAtTimestamp) / (1000 * 60) >=
    DELETE_INTERVAL_IN_MINUTES
  ) {
    throw new Error(
      `Course "${course.courseCode}" cannot be deleted. It can only be deleted within ${DELETE_INTERVAL_IN_MINUTES} minutes of creation.`
    );
  }

  // Check if the course has any classes associated with it
  const classes = await mongoose.models[MODEL_NAMES.CLASS].find({
    courseCode: course.courseCode,
  });

  if (classes.length == 0) {
    // If no classes are associated, proceed with deletion
    return;
  } else {
    await mongoose.models[MODEL_NAMES.CLASS]
      .updateOne(
        { courseCode: course.courseCode },
        { $set: { deactivated: true } }
      )
      .exec();
  }
});

const Course = mongoose.model<ICourse>(MODEL_NAMES.COURSE, CourseSchema);
export default Course;
