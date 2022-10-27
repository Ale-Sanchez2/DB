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


app.post('/players', (req, res) =>{
    let sql =`INSERT 
                INTO Player(Name, Sprite)
              VALUES(? , ?)`;
    console.log("aca no es 1" );
    let params =[req.body.name, req.body.sprite];
    db.run(sql, params, (err) =>{
        if (err){
            console.error(err.message);
            return;
        }
        console.log("aca no es 2" );
        console.log(`Added player with name ${req.body.name} and sprite ${req.body.sprite}.`);
        console.log("aca no es 3" );
        sql = `SELECT Id
                FROM Player
                WHERE Name = ? `;
        let params = [req.body.name];
        console.log("aca no es 4" );
        db.get(sql, params, (err, row) =>{
            if (err){
                console.error(err.message);
                return;
            }
            console.log("aca no es 5" );
            res.end(row.Id.toString());
            console.log("aca no es 6" );

        });
    
    });
});


app.get('/players', (req, res) =>{
    const sql =`SELECT Id,
                       Name,
                       Sprite
                FROM Player`;

    const params =[];
    db.all(sql, params, (err, rows) =>{
        if (err){
            console.error(err.message);
            return;
        }
        
        res.end(JSON.stringify(rows));

    });

});


const server = app.listen(5000, () =>{
    // const host =server.address().address;
    // const port =server.address().port;
    console.log(`listening at http://localhost:5000`);


    const sql = `CREATE TABLE IF NOT EXISTS Player(
                    Id      INTEGER         NOT NULL    PRIMARY KEY     AUTOINCREMENT,
                    Name    INVARCHAR(50)   NOT NULL,
                    Sprite  INVARCHAR(50)   NOT NULL
                );`;
    db.run(sql,[],(err) =>{
        if (err){
            console.error(err.message);
            return;
        }
    })
})