const { database, config, down } = require("migrate-mongo");

async function downAllMigrationsAndDropDB() {
  let client;
  try {
    // Connect to MongoDB
    const { db, client: mongoClient } = await database.connect();
    client = mongoClient;

    // Read migration configuration
    const migrationConfig = await config.read();

    // Get all applied migrations
    const changelogCollection = db.collection(
      migrationConfig.changelogCollectionName || "changelog"
    );
    const appliedMigrations = await changelogCollection
      .find({})
      .sort({ appliedAt: -1 })
      .toArray();

    if (appliedMigrations.length === 0) {
      console.log("No migrations to roll back.");
    } else {
      console.log(`Found ${appliedMigrations.length} migrations to roll back.`);

      // Roll back each migration
      for (const migration of appliedMigrations) {
        const fileName = migration.fileName;
        console.log(`Rolling back migration: ${fileName}`);

        try {
          await down(db, fileName);
          console.log(`✔️ Successfully rolled back: ${fileName}`);
        } catch (err) {
          console.error(`❌ Error rolling back migration ${fileName}:`, err);
          throw err; // Stop if an error occurs
        }
      }
    }

    // Drop the entire database
    const dbName = db.databaseName;
    console.log(`🗑️ Dropping database: ${dbName}`);
    await db.dropDatabase();
    console.log(`✅ Database ${dbName} has been successfully dropped.`);
  } catch (err) {
    console.error("❌ Error during rollback and database drop:", err);
  } finally {
    if (client) await client.close();
    console.log("🔌 MongoDB connection closed.");
  }
}

// Execute the function
downAllMigrationsAndDropDB();
