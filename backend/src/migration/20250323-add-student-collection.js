const { COLLECTION_NAMES } = require("../constants/collectionNames");

module.exports = {
  async up(db, client) {
    console.log("Migration started...");

    // Fetch random IDs from the collections
    const faculties = await db
      .collection(COLLECTION_NAMES.FACULTY)
      .find()
      .toArray();
    const programs = await db
      .collection(COLLECTION_NAMES.PROGRAM)
      .find()
      .toArray();
    const studentStatuses = await db
      .collection(COLLECTION_NAMES.STUDENT_STATUS)
      .find()
      .toArray();

    const getRandomId = (arr) =>
      arr[Math.floor(Math.random() * arr.length)]._id;

    const students = [
      // Original students with updated names and addresses
      {
        studentId: "S12345",
        fullName: "Nguyễn Minh Tuấn",
        birthDate: new Date("2000-01-15"),
        sex: "male",
        faculty: getRandomId(faculties),
        schoolYear: 2020,
        program: getRandomId(programs),
        permanentAddress: {
          street: "123 Trần Hưng Đạo",
          ward: "Cầu Ông Lãnh",
          district: "1",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        temporaryAddress: {
          street: "45 Nguyễn Thị Minh Khai",
          ward: "Bến Nghé",
          district: "1",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        mailingAddress: {
          street: "27 Phạm Ngọc Thạch",
          ward: "Võ Thị Sáu",
          district: "3",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        identityDocuments: [
          {
            type: "cmnd",
            number: "123456789",
            issueDate: new Date("2015-05-20"),
            issuePlace: "Hồ Chí Minh",
            expirationDate: new Date("2025-05-20"),
          },
        ],
        nationality: "Vietnam",
        email: "tuan.nguyen@example.com",
        phone: "0987654321",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S67890",
        fullName: "Trần Thị Hương",
        birthDate: new Date("1999-11-22"),
        sex: "female",
        faculty: getRandomId(faculties),
        schoolYear: 2019,
        program: getRandomId(programs),
        permanentAddress: {
          street: "78 Lê Lợi",
          ward: "Bến Thành",
          district: "1",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        temporaryAddress: {
          street: "56 Lý Tự Trọng",
          ward: "Bến Nghé",
          district: "1",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        mailingAddress: {
          street: "102 Nam Kỳ Khởi Nghĩa",
          ward: "Bến Nghé",
          district: "1",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        identityDocuments: [
          {
            type: "cccd",
            number: "9876543210",
            issueDate: new Date("2020-10-15"),
            issuePlace: "Hồ Chí Minh",
            expirationDate: new Date("2030-10-15"),
            hasChip: true,
          },
        ],
        nationality: "Vietnam",
        email: "huong.tran@example.com",
        phone: "0123456789",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S11223",
        fullName: "Lê Hoàng Long",
        birthDate: new Date("2001-03-05"),
        sex: "male",
        faculty: getRandomId(faculties),
        schoolYear: 2021,
        program: getRandomId(programs),
        permanentAddress: {
          street: "65 Nguyễn Huệ",
          ward: "Bến Nghé",
          district: "1",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        temporaryAddress: {
          street: "17 Tôn Đức Thắng",
          ward: "Bến Nghé",
          district: "1",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        mailingAddress: {
          street: "241 Xô Viết Nghệ Tĩnh",
          ward: "17",
          district: "Bình Thạnh",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        identityDocuments: [
          {
            type: "passport",
            number: "A12345678",
            issueDate: new Date("2021-01-01"),
            issuePlace: "Hồ Chí Minh",
            expirationDate: new Date("2031-01-01"),
            issueCountry: "Vietnam",
            notes: "New passport",
          },
        ],
        nationality: "Vietnam",
        email: "long.le@example.com",
        phone: "0912345678",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S44556",
        fullName: "Phạm Thị Mai Anh",
        birthDate: new Date("2002-07-19"),
        sex: "female",
        faculty: getRandomId(faculties),
        schoolYear: 2022,
        program: getRandomId(programs),
        identityDocuments: [
          {
            type: "cmnd",
            number: "234567890",
            issueDate: new Date("2016-06-15"),
            issuePlace: "Hồ Chí Minh",
            expirationDate: new Date("2026-06-15"),
          },
          {
            type: "passport",
            number: "B23456789",
            issueDate: new Date("2022-02-01"),
            issuePlace: "Hồ Chí Minh",
            expirationDate: new Date("2032-02-01"),
            issueCountry: "Vietnam",
            notes: "New passport",
          },
        ],
        nationality: "Vietnam",
        email: "maianh.pham@example.com",
        phone: "0934567890",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S77889",
        fullName: "Hoàng Việt Anh",
        birthDate: new Date("2003-05-25"),
        sex: "male",
        faculty: getRandomId(faculties),
        schoolYear: 2023,
        program: getRandomId(programs),
        permanentAddress: {
          street: "43 Nguyễn Chí Thanh",
          ward: "Láng Hạ",
          district: "Đống Đa",
          city: "Hà Nội",
          country: "Vietnam",
        },
        identityDocuments: [
          {
            type: "cccd",
            number: "345678901",
            issueDate: new Date("2018-08-10"),
            issuePlace: "Hà Nội",
            expirationDate: new Date("2028-08-10"),
            hasChip: true,
          },
        ],
        nationality: "Vietnam",
        email: "vietanh.hoang@example.com",
        phone: "0945678901",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S99001",
        fullName: "Ngô Thanh Hà",
        birthDate: new Date("2004-12-30"),
        sex: "female",
        faculty: getRandomId(faculties),
        schoolYear: 2024,
        program: getRandomId(programs),
        temporaryAddress: {
          street: "194 Nguyễn Thị Minh Khai",
          ward: "Võ Thị Sáu",
          district: "3",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        identityDocuments: [
          {
            type: "passport",
            number: "C34567890",
            issueDate: new Date("2023-03-01"),
            issuePlace: "Hồ Chí Minh",
            expirationDate: new Date("2033-03-01"),
            issueCountry: "Vietnam",
            notes: "New passport",
          },
        ],
        nationality: "Vietnam",
        email: "ha.ngo@example.com",
        phone: "0956789012",
        status: getRandomId(studentStatuses),
      },

      // Additional students with more variation including foreign exchange students
      {
        studentId: "S10101",
        fullName: "Vũ Quang Minh",
        birthDate: new Date("2001-09-12"),
        sex: "male",
        faculty: getRandomId(faculties),
        schoolYear: 2021,
        program: getRandomId(programs),
        // No addresses provided
        identityDocuments: [
          {
            type: "cccd",
            number: "456789012",
            issueDate: new Date("2019-03-15"),
            issuePlace: "Cần Thơ",
            expirationDate: new Date("2029-03-15"),
            hasChip: true,
          },
          {
            type: "cmnd",
            number: "345678902",
            issueDate: new Date("2015-04-10"),
            issuePlace: "Cần Thơ",
            expirationDate: new Date("2025-04-10"),
          },
        ],
        nationality: "Vietnam",
        email: "minh.vu@example.com",
        phone: "0967890123",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S20202",
        fullName: "Lý Thu Thảo",
        birthDate: new Date("2000-02-28"),
        sex: "female",
        faculty: getRandomId(faculties),
        schoolYear: 2020,
        program: getRandomId(programs),
        permanentAddress: {
          street: "167 Hai Bà Trưng",
          ward: "6",
          district: "3",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        mailingAddress: {
          street: "167 Hai Bà Trưng",
          ward: "6",
          district: "3",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        // No temporary address
        identityDocuments: [
          {
            type: "passport",
            number: "D45678901",
            issueDate: new Date("2020-05-05"),
            issuePlace: "Hồ Chí Minh",
            expirationDate: new Date("2030-05-05"),
            issueCountry: "Vietnam",
            notes: "Study abroad student",
          },
          {
            type: "cccd",
            number: "567890123",
            issueDate: new Date("2021-06-20"),
            issuePlace: "Hồ Chí Minh",
            expirationDate: new Date("2031-06-20"),
            hasChip: true,
          },
        ],
        nationality: "Vietnam",
        email: "thao.ly@example.com",
        phone: "0978901234",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S30303",
        fullName: "Đinh Tuấn Kiệt",
        birthDate: new Date("2002-11-05"),
        sex: "male",
        faculty: getRandomId(faculties),
        schoolYear: 2022,
        program: getRandomId(programs),
        permanentAddress: {
          street: "25 Lý Thường Kiệt",
          ward: "Trần Hưng Đạo",
          district: "Hoàn Kiếm",
          city: "Hà Nội",
          country: "Vietnam",
        },
        // Only permanent address
        identityDocuments: [
          {
            type: "cmnd",
            number: "678901234",
            issueDate: new Date("2017-07-25"),
            issuePlace: "Hải Phòng",
            expirationDate: new Date("2027-07-25"),
          },
        ],
        nationality: "Vietnam",
        email: "kiet.dinh@example.com",
        phone: "0989012345",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S40404",
        fullName: "Trịnh Linh Chi",
        birthDate: new Date("2003-04-18"),
        sex: "female",
        faculty: getRandomId(faculties),
        schoolYear: 2023,
        program: getRandomId(programs),
        temporaryAddress: {
          street: "73 Lê Lợi",
          ward: "Bến Nghé",
          district: "1",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        mailingAddress: {
          street: "73 Lê Lợi",
          ward: "Bến Nghé",
          district: "1",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        // No permanent address
        identityDocuments: [
          {
            type: "cccd",
            number: "789012345",
            issueDate: new Date("2021-08-15"),
            issuePlace: "Bình Dương",
            expirationDate: new Date("2031-08-15"),
            hasChip: true,
          },
        ],
        nationality: "Vietnam",
        email: "linhchi.trinh@example.com",
        phone: "0990123456",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S50505",
        fullName: "Bùi Quốc Huy",
        birthDate: new Date("1999-06-30"),
        sex: "male",
        faculty: getRandomId(faculties),
        schoolYear: 2019,
        program: getRandomId(programs),
        // No addresses provided
        identityDocuments: [
          {
            type: "cmnd",
            number: "890123456",
            issueDate: new Date("2014-09-10"),
            issuePlace: "Hải Dương",
            expirationDate: new Date("2024-09-10"),
          },
          {
            type: "passport",
            number: "E56789012",
            issueDate: new Date("2022-10-01"),
            issuePlace: "Hà Nội",
            expirationDate: new Date("2032-10-01"),
            issueCountry: "Vietnam",
            notes: "Working abroad",
          },
        ],
        nationality: "Vietnam",
        email: "huy.bui@example.com",
        phone: "0901234567",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S60606",
        fullName: "Mai Phương Thảo",
        birthDate: new Date("2004-08-22"),
        sex: "female",
        faculty: getRandomId(faculties),
        schoolYear: 2024,
        program: getRandomId(programs),
        permanentAddress: {
          street: "57 Thái Hà",
          ward: "Trung Liệt",
          district: "Đống Đa",
          city: "Hà Nội",
          country: "Vietnam",
        },
        temporaryAddress: {
          street: "92 Lê Thánh Tôn",
          ward: "Bến Nghé",
          district: "1",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        // No mailing address, using temporary instead
        identityDocuments: [
          {
            type: "cccd",
            number: "901234567",
            issueDate: new Date("2022-11-05"),
            issuePlace: "Hà Nội",
            expirationDate: new Date("2032-11-05"),
            hasChip: true,
          },
          {
            type: "passport",
            number: "F67890123",
            issueDate: new Date("2023-12-15"),
            issuePlace: "Hà Nội",
            expirationDate: new Date("2033-12-15"),
            issueCountry: "Vietnam",
            notes: "Study abroad student",
          },
        ],
        nationality: "Vietnam",
        email: "phuongthao.mai@example.com",
        phone: "0912345678",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S70707",
        fullName: "Trương Đình Khang",
        birthDate: new Date("2001-12-15"),
        sex: "male",
        faculty: getRandomId(faculties),
        schoolYear: 2021,
        program: getRandomId(programs),
        permanentAddress: {
          street: "29 Bà Triệu",
          ward: "Hàng Bài",
          district: "Hoàn Kiếm",
          city: "Hà Nội",
          country: "Vietnam",
        },
        temporaryAddress: {
          street: "29 Bà Triệu",
          ward: "Hàng Bài",
          district: "Hoàn Kiếm",
          city: "Hà Nội",
          country: "Vietnam",
        },
        mailingAddress: {
          street: "29 Bà Triệu",
          ward: "Hàng Bài",
          district: "Hoàn Kiếm",
          city: "Hà Nội",
          country: "Vietnam",
        },
        identityDocuments: [
          {
            type: "cccd",
            number: "012345678",
            issueDate: new Date("2020-01-20"),
            issuePlace: "Hà Nội",
            expirationDate: new Date("2030-01-20"),
            hasChip: false,
          },
        ],
        nationality: "Vietnam",
        email: "khang.truong@example.com",
        phone: "0923456789",
        status: getRandomId(studentStatuses),
      },
      // Foreign exchange students
      {
        studentId: "S80808",
        fullName: "Amanda Chen",
        birthDate: new Date("2002-03-08"),
        sex: "female",
        faculty: getRandomId(faculties),
        schoolYear: 2022,
        program: getRandomId(programs),
        temporaryAddress: {
          street: "134 Nguyễn Cơ Thạch",
          ward: "An Lợi Đông",
          district: "2",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        identityDocuments: [
          {
            type: "passport",
            number: "E12345678",
            issueDate: new Date("2020-02-28"),
            issuePlace: "San Francisco",
            expirationDate: new Date("2030-02-28"),
            issueCountry: "United States",
            notes: "Exchange student",
          },
        ],
        nationality: "United States",
        email: "amanda.chen@example.com",
        phone: "0934567890",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S90909",
        fullName: "Yuki Tanaka",
        birthDate: new Date("2000-10-10"),
        sex: "female",
        faculty: getRandomId(faculties),
        schoolYear: 2020,
        program: getRandomId(programs),
        temporaryAddress: {
          street: "22 Thảo Điền",
          ward: "Thảo Điền",
          district: "2",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        // Only temporary address
        identityDocuments: [
          {
            type: "passport",
            number: "TK4567890",
            issueDate: new Date("2019-05-12"),
            issuePlace: "Tokyo",
            expirationDate: new Date("2029-05-12"),
            issueCountry: "Japan",
            notes: "Exchange student",
          },
        ],
        nationality: "Japan",
        email: "yuki.tanaka@example.com",
        phone: "0945678901",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S11111",
        fullName: "Kim Min-ji",
        birthDate: new Date("2003-01-25"),
        sex: "female",
        faculty: getRandomId(faculties),
        schoolYear: 2023,
        program: getRandomId(programs),
        permanentAddress: {
          street: "123 Gangnam-daero",
          ward: "Gangnam-gu",
          district: "Gangnam",
          city: "Seoul",
          country: "South Korea",
        },
        temporaryAddress: {
          street: "45 Hồ Tùng Mậu",
          ward: "Mai Dịch",
          district: "Cầu Giấy",
          city: "Hà Nội",
          country: "Vietnam",
        },
        mailingAddress: {
          street: "45 Hồ Tùng Mậu",
          ward: "Mai Dịch",
          district: "Cầu Giấy",
          city: "Hà Nội",
          country: "Vietnam",
        },
        identityDocuments: [
          {
            type: "passport",
            number: "M78901234",
            issueDate: new Date("2021-07-05"),
            issuePlace: "Seoul",
            expirationDate: new Date("2031-07-05"),
            issueCountry: "South Korea",
            notes: "Exchange student",
          },
        ],
        nationality: "South Korea",
        email: "minji.kim@example.com",
        phone: "0956789012",
        status: getRandomId(studentStatuses),
      },
      {
        studentId: "S22222",
        fullName: "Pierre Dubois",
        birthDate: new Date("2002-05-15"),
        sex: "male",
        faculty: getRandomId(faculties),
        schoolYear: 2022,
        program: getRandomId(programs),
        permanentAddress: {
          street: "27 Rue de Rivoli",
          ward: "4th arrondissement",
          district: "Paris Centre",
          city: "Paris",
          country: "France",
        },
        temporaryAddress: {
          street: "187 Điện Biên Phủ",
          ward: "15",
          district: "Bình Thạnh",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        mailingAddress: {
          street: "187 Điện Biên Phủ",
          ward: "15",
          district: "Bình Thạnh",
          city: "Hồ Chí Minh",
          country: "Vietnam",
        },
        identityDocuments: [
          {
            type: "passport",
            number: "P98765432",
            issueDate: new Date("2020-08-15"),
            issuePlace: "Paris",
            expirationDate: new Date("2030-08-15"),
            issueCountry: "France",
            notes: "Exchange student",
          },
        ],
        nationality: "France",
        email: "pierre.dubois@example.com",
        phone: "0967890123",
        status: getRandomId(studentStatuses),
      },
    ];

    try {
      console.log("Inserting students...");
      const result = await db
        .collection(COLLECTION_NAMES.STUDENT)
        .insertMany(students);
      console.log(`${result.insertedCount} students added.`);
    } catch (error) {
      console.error("Error inserting students:", error);
    }
  },

  async down(db, client) {
    console.log("Rollback started...");
    try {
      const result = await db
        .collection(COLLECTION_NAMES.STUDENT)
        .deleteMany({});
      console.log(`${result.deletedCount} students deleted.`);
    } catch (error) {
      console.error("Error deleting students:", error);
    }
  },
};
