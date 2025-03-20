module.exports = {
  // Phương thức up được chạy khi chạy migration
  async up(db, client) {
    console.log("Migration started...");
    const students = [
      {
        studentId: "S12345",
        fullName: "Nguyễn Văn A",
        birthDate: "2000-01-15T00:00:00.000Z",
        sex: "Male",
        faculty: "Công nghệ thông tin",
        schoolYear: 2020,
        program: "Cử nhân",
        permanentAddress: {
          street: "123 Đường ABC",
          ward: "Phường 1",
          district: "Quận 1",
          city: "Hà Nội",
          country: "Việt Nam",
        },
        temporaryAddress: {
          street: "456 Đường DEF",
          ward: "Phường 2",
          district: "Quận 2",
          city: "Hồ Chí Minh",
          country: "Việt Nam",
        },
        mailingAddress: {
          street: "789 Đường GHI",
          ward: "Phường 3",
          district: "Quận 3",
          city: "Hà Nội",
          country: "Việt Nam",
        },
        identityDocuments: [
          {
            type: "CMND",
            number: "123456789",
            issueDate: "2015-05-20T00:00:00.000Z",
            issuePlace: "Hà Nội",
            expirationDate: "2025-05-20T00:00:00.000Z",
          },
        ],
        nationality: "Việt Nam",
        email: "nguyenva@example.com",
        phone: "0987654321",
        status: "Active",
      },
      {
        studentId: "S67890",
        fullName: "Trần Thị B",
        birthDate: "1999-11-22T00:00:00.000Z",
        sex: "Female",
        faculty: "Kinh tế",
        schoolYear: 2019,
        program: "Thạc sĩ",
        permanentAddress: {
          street: "321 Đường XYZ",
          ward: "Phường 4",
          district: "Quận 4",
          city: "Đà Nẵng",
          country: "Việt Nam",
        },
        temporaryAddress: {
          street: "654 Đường HIJ",
          ward: "Phường 5",
          district: "Quận 5",
          city: "Hồ Chí Minh",
          country: "Việt Nam",
        },
        mailingAddress: {
          street: "987 Đường KLM",
          ward: "Phường 6",
          district: "Quận 6",
          city: "Hà Nội",
          country: "Việt Nam",
        },
        identityDocuments: [
          {
            type: "CCCD",
            number: "9876543210",
            issueDate: "2020-10-15T00:00:00.000Z",
            issuePlace: "Đà Nẵng",
            expirationDate: "2030-10-15T00:00:00.000Z",
            hasChip: true,
          },
        ],
        nationality: "Việt Nam",
        email: "tranb@example.com",
        phone: "0123456789",
        status: "Active",
      },
      {
        studentId: "S11223",
        fullName: "Lê Minh C",
        birthDate: "2001-03-05T00:00:00.000Z",
        sex: "Male",
        faculty: "Điện tử viễn thông",
        schoolYear: 2021,
        program: "Cử nhân",
        permanentAddress: {
          street: "111 Đường PQR",
          ward: "Phường 7",
          district: "Quận 7",
          city: "Hồ Chí Minh",
          country: "Việt Nam",
        },
        temporaryAddress: {
          street: "222 Đường STU",
          ward: "Phường 8",
          district: "Quận 8",
          city: "Hà Nội",
          country: "Việt Nam",
        },
        mailingAddress: {
          street: "333 Đường VWX",
          ward: "Phường 9",
          district: "Quận 9",
          city: "Đà Nẵng",
          country: "Việt Nam",
        },
        identityDocuments: [
          {
            type: "passport",
            number: "A12345678",
            issueDate: "2021-01-01T00:00:00.000Z",
            issuePlace: "Hà Nội",
            expirationDate: "2031-01-01T00:00:00.000Z",
            countryIssued: "Việt Nam",
            notes: "Hộ chiếu mới",
          },
        ],
        nationality: "Việt Nam",
        email: "leminhc@example.com",
        phone: "0912345678",
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
