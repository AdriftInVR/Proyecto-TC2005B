const db = require('../util/database');

module.exports = class Tarea {

    static fetchAll(epic){
        console.log("Estás en epicTask!!");
        return db.execute(`
        SELECT nombre
        FROM ticket t, epic e, proyecto p
        WHERE t.idTicket = e.idTicket
        AND perteneProyecto = p.idTicket 
        AND perteneProyecto IN (SELECT idTicket
                                   FROM ticket
                                   WHERE nombre = (?));
        `,[epic]);
    }
    
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
/*
    static epicTask(epic){
        console.log("Estás en epicTask!!");
        return db.execute(`
        SELECT nombre
        FROM ticket t, epic e, proyecto p
        WHERE t.idTicket = e.idTicket
        AND perteneProyecto = p.idTicket 
        AND perteneProyecto IN (SELECT idTicket
                                   FROM ticket
                                   WHERE nombre = (?));
        `,[epic]);
    }
    */
}