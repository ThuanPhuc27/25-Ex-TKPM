const config = Object.freeze({
  backendApiRoot: import.meta.env.VITE_BACKEND_URL || "http://localhost:3001",
  apiPaths: {
    students: "/students",
    faculty: "/faculty",
    program: "/program",
    studentStatus: "/studentStatus",
    domains: "/domains",
    rules: "/rules",
    courses: "/courses",
    classes: "/classes",
  },
});

export default config;
