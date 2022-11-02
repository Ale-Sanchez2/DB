const express = require("express");
const app = express();
app.use(express.json());

const sqlite3 = require("sqlite3").verbose();
const dbName ="game.db";
const db = new sqlite3.Database(dbName, (err) =>{
    if (err){
        console.error(err.message);
    }
    console.log(`Connected to the database '${dbName}'.`);


});


app.post('/players/', (req, res) => {
    let sql = `INSERT
                 INTO Player(Name, Puntaje, Cosmeticos)
               VALUES (?, ?, ?)`;
    let params = [req.body.name, req.body.puntaje, req.body.cosmeticos];
    db.run(sql, params, (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
  
      console.log(`Added player with name ${req.body.name} and sprite ${req.body.puntaje}.`);
  
      sql = `SELECT Id
               FROM Player
               WHERE Name = ?`;
  
      let params = [req.body.name];
  
      db.get(sql, params, (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
  
        res.end(row.Id.toString());
      });
    });
  });
  
  app.get('/players/', (req, res) => {
    let sql = `SELECT Id, Name, Puntaje, Cosmeticos
                   FROM Player`;
    let params = [];
    console.log("a");
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
  
      res.end(JSON.stringify(rows));
    });
  });
  
  
  app.get('/players/id:name', (req, res) => {
    const sql = `SELECT Id
                   FROM Player
                   WHERE Name = "${req.params.name}"`;
    const params = [];
  
    console.log(params);
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
  
      res.end(JSON.stringify(rows));
    });
  });
  
  app.get('/players/cosme:id', (req, res) => {
    const sql = `SELECT Cosmeticos
                   FROM Player
                   WHERE Id = ${req.params.id}`;
    const params = [];
    console.log(params);
    db.get(sql, params, (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
  
      res.end(JSON.stringify(rows));
    });
  });
  app.get('/players/puntaje:id', (req, res) => {
    const sql = `SELECT 
                    Puntaje 
                   FROM Player
                   WHERE Id = ${req.params.id}`;
    const params = [];
    console.log(params);
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
  
      res.end(JSON.stringify(row));
    });
  });
  
  app.put('/players/:id', (req, res) => {
    let sql = `UPDATE Player
                 SET  Puntaje = ?, 
                      Cosmeticos = ?
                WHERE Id = ${req.params.id}`;
    let params = [req.body.puntaje, req.body.cosmeticos ];
    console.log(params);
  
    db.run(sql, params, (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
  
      console.log(`Added player with id ${req.params.id} and sprite ${req.params.puntaje}.`);
  
      res.end();
      });
  });


const server = app.listen(5000, () =>{
    // const host =server.address().address;
    // const port =server.address().port;
    console.log(`listening at http://localhost:5000`);


    const sql = `CREATE TABLE IF NOT EXISTS Player (
        Id     INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
        Name   NVARCHAR(50) NOT NULL ,
        Puntaje INTEGER(50) NOT NULL,
        Cosmeticos NVARCHAR(50)  
      );`;

    db.run(sql, [], (err) => {
        if (err)
            console.error(err.message);
        return;
    });
})