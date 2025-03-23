const { COLLECTION_NAMES } = require("../constants/collectionNames");

module.exports = {
  async up(db, client) {
    console.log("Migration started...");

    const studentStatuses = [
      { statusName: "Active" },
      { statusName: "Graduated" },
      { statusName: "Dropped Out" },
      { statusName: "Paused" },
    ];

    try {
      console.log("Inserting student statuses...");
      const result = await db
        .collection(COLLECTION_NAMES.STUDENT_STATUS)
        .insertMany(studentStatuses);
      console.log(`${result.insertedCount} student statuses added.`);
    } catch (error) {
      console.error("Error inserting student statuses:", error);
    }
  },

  async down(db, client) {
    console.log("Rollback started...");
    try {
      const result = await db
        .collection(COLLECTION_NAMES.STUDENT_STATUS)
        .deleteMany({});
      console.log(`${result.deletedCount} student statuses deleted.`);
    } catch (error) {
      console.error("Error deleting student statuses:", error);
    }
  },
};
