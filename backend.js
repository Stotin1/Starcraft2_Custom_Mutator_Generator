const express = require('express') //gets express
const app = express(); //creates express app
const cors = require('cors'); //gets cors --> cors was needed for post I believe. Ran into issues without cors
app.use(express.json());// Gets express to use JSON
app.use(cors());//gets express to use cors policy
let mysql = require('mysql2');

initializeDatabase()
async function initializeDatabase() {
  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'BRRRARRGH', 
    database: 'mutationDB' // The database you want to ensure exists
  };

  console.log("here");
  try {
    // Step 1: Connect to MySQL WITHOUT selecting a specific database
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log('Connected to MySQL server.');

    // Step 2: Create the database if it does not exist
    // Using backticks ensures special characters or spaces in the DB name don't break the query
    await connection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    console.log(`Database "${dbConfig.database}" is ready.`);

    // Step 3: Switch to the target database context
    await connection.promise().query(`USE \`${dbConfig.database}\`;`);

    // Step 4: Optional - Initialize tables inside your database

    const mapTableQuery = `
        CREATE TABLE IF NOT EXISTS maps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        blacklist BOOLEAN NOT NULL,
        );`;
    await connection.promise().query(mapTableQuery);
    console.log(`Table 1 initialized safely.`);

    const commanderTableQuery = `
        CREATE TABLE IF NOT EXISTS commanders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        blacklist BOOLEAN NOT NULL,
        );`;
    await connection.promise().query(commanderTableQuery);
    console.log(`Table 2 initialized safely.`);

    const prestigeTableQuery = `
        CREATE TABLE IF NOT EXISTS prestige (
        id INT AUTO_INCREMENT PRIMARY KEY,
        commander_id INT,
        prestige_Number INT NOT NULL,
        name VARCHAR(250) NOT NULL,

        
        CONSTRAINT fk_commanders_prestige 
        FOREIGN KEY (commander_id) REFERENCES commanders(id)
        ON DELETE CASCADE ON UPDATE CASCADE
        );`;
    await connection.promise().query(prestigeTableQuery);
    console.log(`Table 3 initialized safely.`);

    const mutationTableQuery = `
        CREATE TABLE IF NOT EXISTS mutation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        weight FLOAT NOT NULL,
        description VARCHAR(1500) NOT NULL,
        );`;
    await connection.promise().query(mutationTableQuery);
    console.log(`Table 4 initialized safely.`);

    const prestigeMutationTableQuery = `
        CREATE TABLE IF NOT EXISTS prestige_mutation (
        prestige_id INT,
        mutation_id INT,
        multiplier FLOAT NOT NULL,
        blacklist BOOLEAN NOT NULL,
        CONSTRAINT fk_prestige_mutation_prestige 
        FOREIGN KEY (prestige_id) REFERENCES prestige(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_prestige_mutation_mutation 
        FOREIGN KEY (mutation_id) REFERENCES mutation(id)
        ON DELETE CASCADE ON UPDATE CASCADE
        );`;
    await connection.promise().query(prestigeMutationTableQuery);
    console.log(`Table 5 initialized safely.`);

    const mapMutationTableQuery = `
        CREATE TABLE IF NOT EXISTS map_mutation (
        map_id INT,
        mutation_id INT,
        multiplier FLOAT NOT NULL,
        blacklist BOOLEAN NOT NULL,
        CONSTRAINT fk_map_mutation_map 
        FOREIGN KEY (map_id) REFERENCES maps(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_map_mutation_mutation 
        FOREIGN KEY (mutation_id) REFERENCES mutation(id)
        ON DELETE CASCADE ON UPDATE CASCADE
        );`;
    await connection.promise().query(mapMutationTableQuery);
    console.log(`Table 6 initialized safely.`);

    // Always close your temporary initialization connection
    await connection.end();


  } catch (error) {
    console.error('Error initializing the database:', error);
    process.exit(1);
  }
}

app.get('/', (req, res) => //root route
{
    res.send("Connection Established");
});
app.get('/mutations', (req, res) => //route to get all rocks
{
    let con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "BRRRARRGH",
      database: "mutationDB"
    });
    
    con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM mutation", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
    });
});

app.get('/api/customers/:id', (req, res) => //route to get individual rock
{
    let con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "BRRRARRGH",
      database: "customers2"
    });
    customerID = req.params.id
    con.connect(function(err) {
    if (err) throw err;
    let sql = `SELECT * FROM customerTable WHERE customerid = ?`;
    console.log(customerID, sql)
    con.query(sql, [customerID], function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
    });
});

app.post('/api/customers', (req, res) => //route to add a rock
{
    const name = req.query.name; //gets type via query
    const age = parseInt(req.query.age); //gets color via query
    const start = req.query.start; //gets count via query

    let con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "BRRRARRGH",
      database: "customers2"
    });
    
    con.connect(function(err) {
      if (err) throw err;
      let sql = `INSERT INTO customerTable (customerName, customerAge, customerStart) VALUES (?, ?, ?)`;
      con.query(sql, [name, age, start], function (err, result) {
        if (err) throw err;
        res.send("1 record inserted, ID: " + result.insertId);
      });
    });
});

app.put('/api/customers/:id', (req, res) => //route to add a rock count to an existing rock
{
    let con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "BRRRARRGH",
      database: "customers2"
    });
    customerID = req.params.id
    const name = req.query.name; //gets type via query
    const age = parseInt(req.query.age); //gets color via query
    const start = req.query.start; //gets count via query
    con.connect(function(err) {
      if (err) throw err;
      let sql = "UPDATE customerTable SET customerName = ?, customerAge = ?, customerStart = ? WHERE customerid = ?";
      con.query(sql, [name, age, start, customerID], function (err, result) {
        if (err) throw err;
        res.send(result.affectedRows + "records updated");
      });
    });
});

app.delete('/api/customers/:id', (req, res) => //route to delete a rock from the array
{
    customerID = req.params.id
    let con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "BRRRARRGH",
      database: "customers2"
    });
    
    con.connect(function(err) {
      if (err) throw err;
      let sql = "DELETE FROM customerTable WHERE customerid = ?";
      con.query(sql, [customerID], function (err, result) {
        if (err) throw err;
        res.send("Number of records deleted: " + result.affectedRows);
      });
    });
});

const port = process.env.PORT || 3000; //creates port variable
app.listen(port, () => console.log(`Listening on port ${port}...`)); //sets express to listen on port variable and logs to console
