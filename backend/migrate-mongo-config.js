require("dotenv").config();

module.exports = {
  mongodb: {
    url: process.env.DB_CONNECTION_STRING,
    databaseName: "studentmanagerment",
  },
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  migrationsDir: "src/migration",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
};
