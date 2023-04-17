const db = require('../util/database');

module.exports = class Tarea {
    
    static add(data){        
        for(let i=0;i<data.length;i++){            
            db.execute(`INSERT INTO TAREA(idTicket,perteneceEpic,puntosAgiles,esTipo,front_back) SELECT ?,?,?,?,? 
            WHERE NOT EXISTS(SELECT 1 FROM TAREA WHERE idTicket = ?);`,[data[i].idTicket,data[i].perteneceEpic,data[i].puntosAgiles,data[i].esTipo,data[i].front_back,data[i].idTicket])
            // .then(([rows, fieldData]) => {
            //     if(rows.affectedRows>0)console.log('Se inserto')
            // })
            .catch(err => {
                //console.log(err);
            });
        }        
    }

    static fetchAll() {
        return db.execute(`
        SELECT t.nombre, ta.puntosAgiles
        FROM ticket t, fase f, tarea ta
        WHERE t.idTicket = f.idTicket
        AND t.idTicket = ta.idTicket
        AND f.idEstatus = ?
        `);
    }


}