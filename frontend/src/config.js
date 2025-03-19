const config = Object.freeze({
  backendApiRoot: import.meta.env.VITE_BACKEND_URL || "http://localhost:3001",
  apiPaths: {
    students: "/students",
  },
});

export default config;
