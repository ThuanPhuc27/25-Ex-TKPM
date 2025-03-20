module.exports = {
  async up(db, client) {
    console.log("Migration started...");

    const faculties = [
      {
        code: "LAW", 
        name: "Faculty of Law",
      },
      {
        code: "BUSINESS_ENGLISH",
        name: "Faculty of Business English",
      },
      {
        code: "JAPANESE", 
        name: "Faculty of Japanese",
      },
      {
        code: "FRENCH", 
        name: "Faculty of French",
      },
    ];

    try {
      console.log("Inserting faculties...");
      const result = await db.collection("faculties").insertMany(faculties);
      console.log(`${result.insertedCount} faculties added.`);
    } catch (error) {
      console.error("Error inserting faculties:", error);
    }
  },

  async down(db, client) {
    console.log("Rollback started...");
    try {
      const result = await db.collection("faculties").deleteMany({});
      console.log(`${result.deletedCount} faculties deleted.`);
    } catch (error) {
      console.error("Error deleting faculties:", error);
    }
  },
};
