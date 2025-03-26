const { COLLECTION_NAMES } = require("../constants/collectionNames");

module.exports = {
  async up(db, client) {
    console.log("Migration started...");

    const faculties = [
      {
        facultyName: "Faculty of Law",
      },
      {
        facultyName: "Faculty of Business English",
      },
      {
        facultyName: "Faculty of Japanese",
      },
      {
        facultyName: "Faculty of French",
      },
    ];

    try {
      console.log("Inserting faculties...");
      const result = await db
        .collection(COLLECTION_NAMES.FACULTY)
        .insertMany(faculties);
      console.log(`${result.insertedCount} faculties added.`);
    } catch (error) {
      console.error("Error inserting faculties:", error);
    }
  },

  async down(db, client) {
    console.log("Rollback started...");
    try {
      const result = await db
        .collection(COLLECTION_NAMES.FACULTY)
        .deleteMany({});
      console.log(`${result.deletedCount} faculties deleted.`);
    } catch (error) {
      console.error("Error deleting faculties:", error);
    }
  },
};
