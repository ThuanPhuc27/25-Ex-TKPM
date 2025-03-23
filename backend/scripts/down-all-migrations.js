const { database, config, down } = require("migrate-mongo");

async function downAllMigrations() {
  try {
    // Initialize connection
    const { db, client } = await database.connect();
    const migrationConfig = await config.read();

    // Get all applied migrations from the changelog collection
    const changelogCollection = db.collection(
      migrationConfig.changelogCollectionName || "changelog"
    );
    const appliedMigrations = await changelogCollection
      .find({})
      .sort({ appliedAt: -1 })
      .toArray();

    console.log(`Found ${appliedMigrations.length} migrations to roll back`);

    // Down each migration in reverse chronological order (newest first)
    for (const migration of appliedMigrations) {
      const fileName = migration.fileName;
      console.log(`Rolling back migration: ${fileName}`);

      try {
        await down(db, migrationConfig);
        console.log(`Successfully rolled back: ${fileName}`);
      } catch (err) {
        console.error(
          `Failed to roll back migration ${fileName}: ${err.message}`
        );
        console.error(err);
        break; // Stop on first error
      }
    }
    console.log("All migrations have been rolled back");
    await client.close();
  } catch (err) {
    console.error("Error during migration rollback:", err);
  }
}

// Execute the function
downAllMigrations();
