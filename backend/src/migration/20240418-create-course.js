const { COLLECTION_NAMES } = require("../constants/collectionNames");

module.exports = {
  async up(db, client) {
    console.log("Migration started...");

    const courses = [
      {
        courseCode: "LAW101",
        courseName: "Introduction to Law",
        courseCredits: 3,
        courseDescription: "An introductory course to the basics of law.",
        prequisiteCourses: [],  // Example: No prerequisites
        deactivated: false,
      },
      {
        courseCode: "ENG201",
        courseName: "Business English",
        courseCredits: 3,
        courseDescription: "A course designed to improve business communication in English.",
        prequisiteCourses: [],  // Example: No prerequisites
        deactivated: false,
      },
      {
        courseCode: "JPN301",
        courseName: "Advanced Japanese",
        courseCredits: 4,
        courseDescription: "An advanced course on Japanese language and culture.",
        prequisiteCourses: ["60b8b6e3e6d9e431f4a23b1e"],  // Example prerequisite course ObjectId
        deactivated: false,
      },
    ];

    try {
      console.log("Inserting courses...");
      const result = await db
        .collection(COLLECTION_NAMES.COURSE)
        .insertMany(courses);
      console.log(`${result.insertedCount} courses added.`);
    } catch (error) {
      console.error("Error inserting courses:", error);
    }
  },

  async down(db, client) {
    console.log("Rollback started...");
    try {
      const result = await db
        .collection(COLLECTION_NAMES.COURSE)
        .deleteMany({});
      console.log(`${result.deletedCount} courses deleted.`);
    } catch (error) {
      console.error("Error deleting courses:", error);
    }
  },
};
