const { COLLECTION_NAMES } = require("../constants/collectionNames");

module.exports = {
  async up(db, client) {
    console.log("Migration started...");

    const programs = [
      {
        programName: "Bachelor of Computer Science",
      },
      {
        programName: "Master of Business Administration",
      },
      {
        programName: "Master of Science in Computer Science",
      },
      {
        programName: "Bachelor of Business Administration",
      },
    ];

    try {
      console.log("Inserting programs...");
      const result = await db
        .collection(COLLECTION_NAMES.PROGRAM)
        .insertMany(programs);
      console.log(`${result.insertedCount} programs added.`);
    } catch (error) {
      console.error("Error inserting programs:", error);
    }
  },

  async down(db, client) {
    console.log("Rollback started...");
    try {
      const result = await db
        .collection(COLLECTION_NAMES.PROGRAM)
        .deleteMany({});
      console.log(`${result.deletedCount} programs deleted.`);
    } catch (error) {
      console.error("Error deleting programs:", error);
    }
  },
};
