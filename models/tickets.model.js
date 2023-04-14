const db = require('../util/database');

module.exports = class Ticket {

    static fetchAll() {
        return db.execute('SELECT * FROM TICKET');
    }
    
    static add(data){        
        for(let i=0;i<data.length;i++){
            db.execute(`INSERT INTO TICKET(idTicket,nombre) SELECT ?,? WHERE NOT EXISTS(SELECT 1 FROM TICKET WHERE idTicket = ?);`,[data[i].idTicket,data[i].nombre,data[i].idTicket])
            // .then(([rows, fieldData]) => {
            //     if(rows.affectedRows>0)console.log('Se inserto')
            // })
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }
}