const db = require('../util/database');

module.exports = class Fase {

    static fetchAll() {
        return db.execute('SELECT * FROM FASE');
    }
    
    static async add(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO FASE(idTicket,idEstatus) VALUES (?,?);`,[data[i].idTicket,data[i].idEstatus])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }
}