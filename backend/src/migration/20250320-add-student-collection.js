const { MongoClient } = require("mongodb");

module.exports = {
  // Phương thức up được chạy khi chạy migration
  async up(db, client) {
    console.log("Migration started...");
    const students = [
      {
        studentId: "S001",
        fullName: "John Doe",
        birthDate: new Date("2000-01-01"),
        sex: "Male",
        faculty: "Computer Science",
        schoolYear: 1,
        program: "Bachelor",
        address: "123 Street, City",
        email: "john.doe@example.com",
        phone: "1234567890",
        status: "Active",
      },
      {
        studentId: "S002",
        fullName: "Jane Doe",
        birthDate: new Date("1999-12-01"),
        sex: "Female",
        faculty: "Mathematics",
        schoolYear: 2,
        program: "Master",
        address: "456 Avenue, City",
        email: "jane.doe@example.com",
        phone: "9876543210",
        status: "Active",
      },
    ];

    try {
      console.log("Inserting students...");
      // Thêm sinh viên vào collection 'students'
      const result = await db.collection("students").insertMany(students);
      console.log(`${result.insertedCount} students added.`);
    } catch (error) {
      console.error("Error inserting students:", error);
    }
  },

  // Phương thức down sẽ được chạy khi rollback migration
  async down(db, client) {
    console.log("Rollback started...");
    try {
      // Xóa tất cả sinh viên trong collection 'students'
      const result = await db.collection("students").deleteMany({});
      console.log(`${result.deletedCount} students deleted.`);
    } catch (error) {
      console.error("Error deleting students:", error);
    }
  },
};
