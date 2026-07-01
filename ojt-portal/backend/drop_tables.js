import { sequalize } from './src/database/sequlize.js';

async function dropAll() {
  try {
    await sequalize.authenticate();
    await sequalize.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    const [tables] = await sequalize.query('SHOW TABLES');
    
    for (let table of tables) {
      const tableName = Object.values(table)[0];
      await sequalize.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
    }
    
    await sequalize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log("All tables dropped successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error dropping tables:", err);
    process.exit(1);
  }
}
dropAll();
