const db = require('../util/database');

module.exports = class Fase {

    static fetchAll() {
        return db.execute('SELECT * FROM fase');
    }
    
    static fetchAllOne() {
        return db.execute('SELECT * FROM fase WHERE idEstatus = 1');
    }
    
    static async add(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO fase(idTicket,idEstatus, fechaCambio) VALUES (?,?, ?);`,[data[i].idTicket,data[i].idEstatus,data[i].fechaCambio])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }
    
    static async addOne(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO fase(idTicket,idEstatus, fechaCambio) VALUES (?,?, ?);`,[data[i].idTicket,data[i].idEstatus,data[i].fechaCambio])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }

    static async updateOne(data){
        for(let i=0;i<data.length;i++){
            await db.execute(`UPDATE fase SET fechaCambio = ? WHERE idTicket = ? AND idEstatus = 1`,[data[i].fechaCambio,data[i].idTicket])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
            
        }     
    }
}