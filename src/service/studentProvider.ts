import { Students_data } from "../data/index";

/**
 * Type represents the required fields for the storing data
 */
type Student = {
  studentId: string | number;
  fullName: string;
};

/**
 * The primary key of the `Student` table
 */
const STUDENT_STORE_KEY = "studentId";
/**
 * The attribute containing the name of the student in the `Student` table, used to search.
 */
const STUDENT_NAME_FIELD = "fullName";

/**
 * The possible returning values of {@link checkStudentKey} function
 */
const StudentKeyCheckResponse = {
  VALID_KEY: `The key propery "${STUDENT_STORE_KEY}" contains valid value to be added to the database`,
  KEY_NOT_FOUND: `The key property "${STUDENT_STORE_KEY}" not found in the data object`,
  EXISTED_KEY: `The key property "${STUDENT_STORE_KEY}" having existed value in the database"`,
};

let dbInstance: IDBDatabase | null = null;

/**
 * Establishing a connection to the database.
 * If the database instance is not already connected, it will attempt to connect.
 *
 * You could invoke this function before any operation to the IndexedDb,
 * to reduce possible delay from connecting to the storage.
 *
 * @async
 * @function initializeConnection
 * @returns {Promise<void>} A promise that resolves when the database connection is established.
 */
const initializeConnection = async (): Promise<void> => {
  if (dbInstance === null) {
    dbInstance = await _connect();
  }
};

/**
 * Checks the validity of a student's key.
 *
 * This function should be called before calling {@link addStudent},
 * to ensure that the key of the object is valid to store the object!
 *
 * @async
 * @param data - The data containing the student's key to be checked
 * @returns {Promise<string>} A promise that resolves to the result of the key check, whose value is in {@link StudentKeyCheckResponse} object.
 * - {@link StudentKeyCheckResponse.VALID_KEY}: The object has the key that is not existed yet in the database and is ready to be added.
 * - {@link StudentKeyCheckResponse.EXISTED_KEY}: The object has the key that is already existed in the database.
 * - {@link StudentKeyCheckResponse.KEY_NOT_FOUND}: The object doesn't have the required key field.
 */
const checkStudentKey = async (data: any): Promise<string> => {
  if (dbInstance === null) {
    await initializeConnection();
  }
  return _checkStudentKey(dbInstance!, data);
};

/**
 * Adds a student to the database.
 *
 * If the key is not provided, an auto-generated **integer** will be used as key
 *
 * If the key is already existed, a {@link DOMException} will be thrown.
 *
 * It is recommended to call the function {@link checkStudentKey} and check its result
 * before calling this function.
 *
 * @async
 * @param {Student} student - The student object to be added to the database.
 * @returns {Promise<string>} A promise that resolves and return the **student's key** when the student is added.
 */
const addStudent = async (student: Student): Promise<string> => {
  if (dbInstance === null) {
    await initializeConnection();
  }
  return _addStudent(dbInstance!, student);
};

/**
 * Upserts a student in the database.
 *
 * This function will insert a new student if the student does not exist,
 * or update the existing student if the student already exists.
 *
 * You can check if the student has already existed using {@link checkStudentKey}.
 *
 * @async
 * @param {Student} student - The student object to be upserted.
 * @returns {Promise<string>} A promise that resolves and return the **student's key** when the student is upserted.
 */
const upsertStudent = async (student: Student): Promise<string> => {
  if (dbInstance === null) {
    await initializeConnection();
  }
  return _upsertStudent(dbInstance!, student);
};

/**
 * Removes a student by ID from the database.
 *
 * Do nothing/do not throw anything if the student whose id is not in the database.
 *
 * @async
 * @param {string} studentId - The ID of the student to be removed.
 * @returns {Promise<true>} A promise that resolves to true when the student is removed.
 */
const removeStudentById = async (studentId: string): Promise<true> => {
  if (dbInstance === null) {
    await initializeConnection();
  }
  return _removeStudentById(dbInstance!, studentId);
};

/**
 * Fetches all students from the database.
 *
 * @async
 * @returns {Promise<Student[]>} A promise that resolves to an array of all students in the database.
 */
const fetchAllStudents = async (): Promise<Student[]> => {
  if (dbInstance === null) {
    await initializeConnection();
  }
  return _fetchAllStudents(dbInstance!);
};

/**
 * Finds students by their name.
 *
 * This function searches for students in the database whose names **contain** the provided `studentName`.
 *
 * An empty array will be returned if there is no student containing that "name".
 *
 * @async
 * @param {string} studentName - The name of the student to search for.
 * @returns {Promise<Student[]>} A promise that resolves to an array of students matching the provided name.
 */
const findStudentsByName = async (studentName: string): Promise<Student[]> => {
  if (dbInstance === null) {
    await initializeConnection();
  }
  return _findStudentsByName(dbInstance!, studentName);
};

export {
  Student,
  STUDENT_STORE_KEY,
  StudentKeyCheckResponse,
  initializeConnection,
  checkStudentKey,
  addStudent,
  upsertStudent,
  removeStudentById,
  fetchAllStudents,
  findStudentsByName,
};

//---
const DB_NAME = "students";
const DB_VERSION = 1;

const STUDENT_STORE_NAME = "students";

async function _checkStudentKey(db: IDBDatabase, data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!data[STUDENT_STORE_KEY]) {
      resolve(StudentKeyCheckResponse.KEY_NOT_FOUND);
    }
    const request = db
      .transaction(STUDENT_STORE_NAME, "readonly")
      .objectStore(STUDENT_STORE_NAME)
      .getKey(data[STUDENT_STORE_KEY]);
    request.onsuccess = (ev: Event) =>
      resolve(StudentKeyCheckResponse.EXISTED_KEY);
    request.onerror = (ev: Event) => {
      resolve(StudentKeyCheckResponse.VALID_KEY);
    };
  });
}

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

async function _upsertStudent(db: IDBDatabase, data: Student): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(STUDENT_STORE_NAME, "readwrite")
      .objectStore(STUDENT_STORE_NAME)
      .put(data);
    request.onsuccess = (ev) =>
      resolve((ev.target as IDBRequest).result as string); // ev.target.result == data[STUDENT_STORE_KEY]
    request.onerror = (ev) =>
      reject(
        `Can't insert/update an entry to ${STUDENT_STORE_NAME}'s object store!`
      );
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

async function _connect(withInitialData: boolean = true): Promise<IDBDatabase> {
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

      // Push the initial data to it
      if (withInitialData) {
        Students_data.map((student) => {
          objectStore.add(student);
        });
      }
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
