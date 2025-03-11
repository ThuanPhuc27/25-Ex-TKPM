type Student = {
  student_id?: string;
  full_name: string;
  birth_date: string;
  sex: string;
  faculty: string;
  school_year: number;
  program: string;
  address: string;
  email: string;
  status: string;
};

let dbInstance: IDBDatabase | null = null;

const initializeStudentData = async () => {
  if (dbInstance === null) {
    dbInstance = await _connect();
  }
};

const addStudent = async (student: Student) => {
  if (dbInstance === null) {
    await initializeStudentData();
  }
  return _addStudent(dbInstance!, student);
};

const removeStudentById = async (studentId: string) => {
  if (dbInstance === null) {
    await initializeStudentData();
  }
  return _removeStudentById(dbInstance!, studentId);
};

const fetchAllStudents = async () => {
  if (dbInstance === null) {
    await initializeStudentData();
  }
  return _fetchAllStudents(dbInstance!);
};

const findStudentsByName = async (studentName: string) => {
  if (dbInstance === null) {
    await initializeStudentData();
  }
  return _findStudentsByName(dbInstance!, studentName);
};

export {
  Student,
  initializeStudentData,
  addStudent,
  removeStudentById,
  fetchAllStudents,
  findStudentsByName,
};

//---

const DB_NAME = "students";
const DB_VERSION = 1;

const STUDENT_STORE_NAME = "students";
const STUDENT_STORE_KEY = "student_id";
const STUDENT_NAME_FIELD = "full_name";

async function _addStudent(db: IDBDatabase, data: Student): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(STUDENT_STORE_NAME, "readwrite")
      .objectStore(STUDENT_STORE_NAME)
      .add(data);
    request.onsuccess = (ev) =>
      resolve((ev.target as IDBRequest).result as string); // ev.target.result == data[STUDENT_STORE_KEY]
    request.onerror = (ev) =>
      reject(`Can't add an entry to ${STUDENT_STORE_NAME}'s object store!`);
  });
}

async function _removeStudentById(db: IDBDatabase, id: string): Promise<true> {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(STUDENT_STORE_NAME, "readwrite")
      .objectStore(STUDENT_STORE_NAME)
      .delete(id);
    request.onsuccess = (ev) => resolve(true);
    request.onerror = (ev) =>
      reject(
        `Can't delete the entry with id ${id} in the ${STUDENT_STORE_NAME}'s object store!`
      );
  });
}

async function _fetchAllStudents(db: IDBDatabase): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(STUDENT_STORE_NAME, "readonly")
      .objectStore(STUDENT_STORE_NAME)
      .getAll();
    request.onsuccess = (ev) =>
      resolve(((ev.target as IDBRequest).result as Student[]) ?? []);
    request.onerror = (ev) =>
      reject(
        `Can't fetch the entries of the ${STUDENT_STORE_NAME}'s object store!`
      );
  });
}

async function _findStudentsByName(
  db: IDBDatabase,
  name: string
): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const index = db
      .transaction(STUDENT_STORE_NAME, "readonly")
      .objectStore(STUDENT_STORE_NAME)
      .index(STUDENT_NAME_FIELD);

    let result: Student[] = [];

    index.openCursor().onsuccess = (ev: Event) => {
      const cursor: IDBCursorWithValue = (ev.target as IDBRequest).result;
      if (cursor) {
        if ((cursor.key as string).includes(name)) {
          result.push(cursor.value as Student);
        }
        cursor.continue();
      } else {
        resolve(result);
      }
    };
  });
}

async function _connect(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    // Triggered when a new database is created or the version number of existing database is increased
    request.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
      const db = (ev.target as IDBOpenDBRequest).result;

      // Create an object store if it doesn't exist
      const objectStore = db.createObjectStore(STUDENT_STORE_NAME, {
        keyPath: STUDENT_STORE_KEY,
        autoIncrement: true,
      });

      // Create an index to search students by name
      objectStore.createIndex(STUDENT_NAME_FIELD, STUDENT_NAME_FIELD, {
        unique: false,
      });
    };

    request.onsuccess = (ev: Event) => {
      resolve(request.result);
    };

    request.onerror = (ev: Event) => {
      // Most likely happens because the use decided not to give permission to create a database
      console.error("Please allow my web app to use IndexedDB!");
      reject(request.error);
    };
  });
}

// async function main() {
//   try {
//     const db = await connect();

//     console.log("db ok!");

//     await addStudent(db, {
//       full_name: "Thuc",
//       birth_date: "",
//       sex: "Male",
//       faculty: "Law",
//       school_year: 2004,
//       program: "Stardard",
//       address: "",
//       email: "",
//       status: "studying",
//     });

//     console.log("add ok!");

//     const res = await fetchAllStudents(db);
//     console.log(res);
//   } catch (error: any) {
//     console.log("Database error: ", (error as Error).message);
//   }
// }

// main();
