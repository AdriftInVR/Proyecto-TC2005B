const db = require('../util/database');

module.exports = class Tarea {

    static fetchAllAll(){
        return db.execute(`
        SELECT *
        FROM TAREA`);
    }

    static fetchAll(epic){    
        return db.execute(`
        SELECT nombre
        FROM TICKET t, EPIC e, PROYECTO p
        WHERE t.idTicket = e.idTicket
        AND perteneProyecto = p.idTicket 
        AND perteneProyecto IN (SELECT idTicket
                                   FROM TICKET
                                   WHERE nombre = (?));
        `,[epic]);
    }
    
    static async add(data){        
        for(let i=0;i<data.length;i++){            
            await db.execute(`INSERT INTO TAREA(idTicket,perteneceEpic,puntosAgiles,esTipo,front_back) VALUES (?,?,?,?,?) `,
            [data[i].idTicket,data[i].perteneceEpic,data[i].puntosAgiles,data[i].esTipo,data[i].front_back])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }

    static async update(data){        
        for(let i=0;i<data.length;i++){            
            await db.execute(`UPDATE TAREA SET idTicket = ?,perteneceEpic = ?, puntosAgiles = ?,esTipo = ?, front_back = ? WHERE idTicket = ? `,
            [data[i].idTicket,data[i].perteneceEpic,data[i].puntosAgiles,data[i].esTipo,data[i].front_back, data[i].idTicket])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }

    static tasktdo(){
        return db.execute (`
        SELECT ti.nombre, ta.puntosAgiles 
        FROM TICKET ti, FASE f, TAREA ta
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND f.idEstatus = 1
        `)

    }

    static taskinpro(){
        return db.execute (`
        SELECT ti.nombre, ta.puntosAgiles 
        FROM TICKET ti, FASE f, TAREA ta
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND f.idEstatus = 2
        `)

    }

    static taskcode(){
        return db.execute (`
        SELECT ti.nombre, ta.puntosAgiles 
        FROM TICKET ti, FASE f, TAREA ta
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND f.idEstatus = 3
        `)
    }

    static taskquality(){
        return db.execute (`
        SELECT ti.nombre, ta.puntosAgiles 
        FROM TICKET ti, FASE f, TAREA ta
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND f.idEstatus = 4
        `)
    }

    static taskrelease(){
        return db.execute (`
        SELECT ti.nombre, ta.puntosAgiles 
        FROM TICKET ti, FASE f, TAREA ta
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND f.idEstatus = 5
        `)
    }

    static taskdone(){
        return db.execute (`
        SELECT ti.nombre, ta.puntosAgiles 
        FROM TICKET ti, FASE f, TAREA ta
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND f.idEstatus = 6
        `)
    }

    static taskclosed(){
        return db.execute (`
        SELECT ti.nombre, ta.puntosAgiles 
        FROM TICKET ti, FASE f, TAREA ta
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND f.idEstatus = 7
        `)
    }

    /*static estat(idEstatus){
        return db.execute(`
        SELECT ti.nombre, ta.puntosAgiles 
        FROM ticket ti, fase f, tarea ta
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND f.idEstatus = ?
        `, [idEstatus])
    };*/ 

}