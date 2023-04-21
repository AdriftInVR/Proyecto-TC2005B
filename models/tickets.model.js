const db = require('../util/database');

module.exports = class Ticket {

    static fetchAll() {
        return db.execute('SELECT * FROM TICKET');
    }
    
    static async add(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO TICKET(idTicket,nombre) VALUES (?,?) `,[data[i].idTicket,data[i].nombre])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }
    
    static async update(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`UPDATE TICKET SET nombre = ? WHERE idTicket = ?`,[data[i].nombre,data[i].idTicket])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }
}