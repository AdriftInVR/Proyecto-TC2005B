const db = require('../util/database');

module.exports = class Ticket {

    static async fetchAll() {
        return await db.execute('SELECT * FROM ticket');
    }
    
    static async add(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO ticket(idTicket,nombre) VALUES (?,?) `,[data[i].idTicket,data[i].nombre])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }
    
    static async update(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`UPDATE ticket SET nombre = ? WHERE idTicket = ?`,[data[i].nombre,data[i].idTicket])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }

    static async dropPrj(id) {
        return await db.execute('DELETE FROM ticket WHERE idTicket = ?', [id]);
    }
}