module.exports = {
    async up(db, client) {
      console.log("Migration started...");
  
      const studentStatuses = [
        { name: 'Active' },
        { name: 'Graduated' },
        { name: 'Dropped Out' },
        { name: 'Paused' },
      ];
  
      try {
        console.log("Inserting student statuses...");
        const result = await db.collection("studentstatuses").insertMany(studentStatuses);
        console.log(`${result.insertedCount} student statuses added.`);
      } catch (error) {
        console.error("Error inserting student statuses:", error);
      }
    },
  
    async down(db, client) {
      console.log("Rollback started...");
      try {
        const result = await db.collection("studentstatuses").deleteMany({});
        console.log(`${result.deletedCount} student statuses deleted.`);
      } catch (error) {
        console.error("Error deleting student statuses:", error);
      }
    },
  };
  