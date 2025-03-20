module.exports = {
  async up(db, client) {
    console.log("Migration started...");

    const programs = [
      {
        name: "Bachelor of Computer Science",
        code: "BCS",
      },
      {
        name: "Master of Business Administration",
        code: "MBA",
      },
      {
        name: "Master of Science in Computer Science",
        code: "MSC-CS",
      },
      {
        name: "Bachelor of Business Administration",
        code: "BBA",
      },
    ];

    try {
      console.log("Inserting programs...");
      const result = await db.collection("programs").insertMany(programs);
      console.log(`${result.insertedCount} programs added.`);
    } catch (error) {
      console.error("Error inserting programs:", error);
    }
  },

  async down(db, client) {
    console.log("Rollback started...");
    try {
      const result = await db.collection("programs").deleteMany({});
      console.log(`${result.deletedCount} programs deleted.`);
    } catch (error) {
      console.error("Error deleting programs:", error);
    }
  },
};
