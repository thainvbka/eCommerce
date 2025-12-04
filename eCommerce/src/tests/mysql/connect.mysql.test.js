const mysql = require("mysql2");

//create pool connection
const pool = mysql.createPool({
  host: "localhost",
  user: "thainvbka",
  password: "12345678",
  database: "shopDEV",
});

const batchSize = 100000;
const totalSize = 10_000_000;

let currentId = 1;

console.time(":::::::::TIMMER::::::::");
const insertBatch = async () => {
  const values = [];

  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd(":::::::::TIMMER::::::::");
    pool.end((err) => {
      if (err) {
        console.log("error occurred while running batch ");
      } else {
        console.log("Connection pool closed successfully");
      }
    });
    return;
  }

  const sql = `INSERT INTO users (id, name, age, address) VALUES ?`;

  pool.query(sql, [values], async (error, results) => {
    if (error) throw error;
    console.log(`insert ${results.affectedRows} records`);
    await insertBatch();
  });
};

insertBatch().catch(console.error);

//perform a simple query to test the connection
// pool.query("SELECT * from users", (error, results) => {
//   if (error) throw error;
//   console.log(`query result: `, results); // should print "query result: 2"

//   //close the pool
//   pool.end((err) => {
//     if (err) throw err;
//     console.log("Pool closed.");
//   });
// });
