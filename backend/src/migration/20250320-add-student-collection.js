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
        faculty: "LAW",
        schoolYear: 2020,
        program: "BBA",
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
        faculty: "LAW",
        schoolYear: 2019,
        program: "BCS",
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
        faculty: "BUSINESS_ENGLISH",
        schoolYear: 2021,
        program: "BCS",
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
      // Thêm 6 học sinh mới vào đây
      {
        studentId: "S33445",
        fullName: "Nguyễn Thị D",
        birthDate: "2002-07-18T00:00:00.000Z",
        sex: "Female",
        faculty: "BUSINESS_ENGLISH",
        schoolYear: 2021,
        program: "MBA",
        permanentAddress: {
          street: "123 Đường LMN",
          ward: "Phường 10",
          district: "Quận 10",
          city: "Hà Nội",
          country: "Việt Nam",
        },
        temporaryAddress: {
          street: "456 Đường OPQ",
          ward: "Phường 11",
          district: "Quận 11",
          city: "Hồ Chí Minh",
          country: "Việt Nam",
        },
        mailingAddress: {
          street: "789 Đường RST",
          ward: "Phường 12",
          district: "Quận 12",
          city: "Đà Nẵng",
          country: "Việt Nam",
        },
        identityDocuments: [
          {
            type: "CCCD",
            number: "1239876543",
            issueDate: "2022-04-15T00:00:00.000Z",
            issuePlace: "Hà Nội",
            expirationDate: "2032-04-15T00:00:00.000Z",
            hasChip: true,
          },
        ],
        nationality: "Việt Nam",
        email: "nguyen.d@example.com",
        phone: "0976543210",
        status: "Active",
      },
      {
        studentId: "S55667",
        fullName: "Phạm Thị E",
        birthDate: "2003-05-20T00:00:00.000Z",
        sex: "Female",
        faculty: "JAPANESE",
        schoolYear: 2022,
        program: "MBA",
        permanentAddress: {
          street: "987 Đường UVW",
          ward: "Phường 13",
          district: "Quận 13",
          city: "Hà Nội",
          country: "Việt Nam",
        },
        temporaryAddress: {
          street: "654 Đường XYZ",
          ward: "Phường 14",
          district: "Quận 14",
          city: "Hồ Chí Minh",
          country: "Việt Nam",
        },
        mailingAddress: {
          street: "321 Đường ABC",
          ward: "Phường 15",
          district: "Quận 15",
          city: "Đà Nẵng",
          country: "Việt Nam",
        },
        identityDocuments: [
          {
            type: "CMND",
            number: "6543210987",
            issueDate: "2021-08-10T00:00:00.000Z",
            issuePlace: "Hà Nội",
            expirationDate: "2026-08-10T00:00:00.000Z",
          },
        ],
        nationality: "Việt Nam",
        email: "pham.e@example.com",
        phone: "0934567890",
        status: "Active",
      },
      {
        studentId: "S77889",
        fullName: "Vũ Minh F",
        birthDate: "2001-12-03T00:00:00.000Z",
        sex: "Male",
        faculty: "JAPANESE",
        schoolYear: 2020,
        program: "MSC-CS",
        permanentAddress: {
          street: "111 Đường MNO",
          ward: "Phường 16",
          district: "Quận 16",
          city: "Hà Nội",
          country: "Việt Nam",
        },
        temporaryAddress: {
          street: "444 Đường PQR",
          ward: "Phường 17",
          district: "Quận 17",
          city: "Hồ Chí Minh",
          country: "Việt Nam",
        },
        mailingAddress: {
          street: "555 Đường STU",
          ward: "Phường 18",
          district: "Quận 18",
          city: "Đà Nẵng",
          country: "Việt Nam",
        },
        identityDocuments: [
          {
            type: "passport",
            number: "B12345678",
            issueDate: "2020-06-01T00:00:00.000Z",
            issuePlace: "Hà Nội",
            expirationDate: "2030-06-01T00:00:00.000Z",
            countryIssued: "Việt Nam",
            notes: "Hộ chiếu mới",
          },
        ],
        nationality: "Việt Nam",
        email: "vuminhf@example.com",
        phone: "0901234567",
        status: "Active",
      },
      {
        studentId: "S99001",
        fullName: "Lê Minh G",
        birthDate: "1998-04-25T00:00:00.000Z",
        sex: "Male",
        faculty: "FRENCH",
        schoolYear: 2018,
        program: "MSC-CS",
        permanentAddress: {
          street: "777 Đường HIJ",
          ward: "Phường 19",
          district: "Quận 19",
          city: "Hà Nội",
          country: "Việt Nam",
        },
        temporaryAddress: {
          street: "555 Đường KLM",
          ward: "Phường 20",
          district: "Quận 20",
          city: "Hồ Chí Minh",
          country: "Việt Nam",
        },
        mailingAddress: {
          street: "888 Đường NOP",
          ward: "Phường 21",
          district: "Quận 21",
          city: "Đà Nẵng",
          country: "Việt Nam",
        },
        identityDocuments: [
          {
            type: "CCCD",
            number: "1122334455",
            issueDate: "2019-07-22T00:00:00.000Z",
            issuePlace: "Hà Nội",
            expirationDate: "2029-07-22T00:00:00.000Z",
            hasChip: true,
          },
        ],
        nationality: "Việt Nam",
        email: "leminhg@example.com",
        phone: "0915678901",
        status: "Active",
      },
      {
        studentId: "S22334",
        fullName: "Nguyễn Quang H",
        birthDate: "2000-06-10T00:00:00.000Z",
        sex: "Male",
        faculty: "FRENCH",
        schoolYear: 2022,
        program: "BBA",
        permanentAddress: {
          street: "666 Đường OPQ",
          ward: "Phường 22",
          district: "Quận 22",
          city: "Hà Nội",
          country: "Việt Nam",
        },
        temporaryAddress: {
          street: "333 Đường RST",
          ward: "Phường 23",
          district: "Quận 23",
          city: "Hồ Chí Minh",
          country: "Việt Nam",
        },
        mailingAddress: {
          street: "444 Đường UVW",
          ward: "Phường 24",
          district: "Quận 24",
          city: "Đà Nẵng",
          country: "Việt Nam",
        },
        identityDocuments: [
          {
            type: "passport",
            number: "A98765432",
            issueDate: "2022-03-30T00:00:00.000Z",
            issuePlace: "Hà Nội",
            expirationDate: "2032-03-30T00:00:00.000Z",
            countryIssued: "Việt Nam",
            notes: "Hộ chiếu mới",
          },
        ],
        nationality: "Việt Nam",
        email: "nguyenh@example.com",
        phone: "0909876543",
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
