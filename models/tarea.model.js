const db = require('../util/database');

module.exports = class Tarea {

    static async fetchAllAll(){
        return await db.execute(`
        SELECT *
        FROM tarea`);
    }

    static fetchAll(epic){    
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
    
    static fetchAll(){
        return db.execute('SELECT * FROM TAREA');
    }
    
    static async add(data){        
        for(let i=0;i<data.length;i++){            
            await db.execute(`INSERT INTO tarea(idTicket,perteneceEpic,puntosAgiles,esTipo,front_back, asignacionEpiTar) VALUES (?,?,?,?,?,?) `,
            [data[i].idTicket,data[i].perteneceEpic,data[i].puntosAgiles,data[i].esTipo,data[i].front_back, data[i].asignation])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }

    static async update(data){        
        for(let i=0;i<data.length;i++){            
            await db.execute(`UPDATE tarea SET idTicket = ?,perteneceEpic = ?, puntosAgiles = ?,esTipo = ?, front_back = ?, asignacionEpiTar = ? WHERE idTicket = ? `,
            [data[i].idTicket,data[i].perteneceEpic,data[i].puntosAgiles,data[i].esTipo,data[i].front_back, data[i].asignation, data[i].idTicket])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }

    static tasktdo(id){
        return db.execute (`
        SELECT *
        FROM ticket ti, fase f, tarea ta, epic e
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND e.idTicket = ta.perteneceEpic
        AND f.idEstatus = 1
        AND e.idTicket = ?
        `,[id])

    }

    static taskinpro(){
        return db.execute (`
        SELECT *
        FROM ticket ti, fase f, tarea ta, epic e
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND e.idTicket = ta.perteneceEpic
        AND f.idEstatus = 2
        AND e.idTicket = ?
        `,[id])

    }

    static taskcode(){
        return db.execute (`
        SELECT *
        FROM ticket ti, fase f, tarea ta, epic e
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND e.idTicket = ta.perteneceEpic
        AND f.idEstatus = 3
        AND e.idTicket = ?
        `,[id])
    }

    static taskquality(){
        return db.execute (`
        SELECT *
        FROM ticket ti, fase f, tarea ta, epic e
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND e.idTicket = ta.perteneceEpic
        AND f.idEstatus = 4
        AND e.idTicket = ?
        `,[id])
    }

    static taskrelease(){
        return db.execute (`
        SELECT *
        FROM ticket ti, fase f, tarea ta, epic e
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND e.idTicket = ta.perteneceEpic
        AND f.idEstatus = 5
        AND e.idTicket = ?
        `,[id])
    }

    static taskdone(){
        return db.execute (`
        SELECT *
        FROM ticket ti, fase f, tarea ta, epic e
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND e.idTicket = ta.perteneceEpic
        AND f.idEstatus = 6
        AND e.idTicket = ?
        `,[id])
    }

    static taskclosed(){
        return db.execute (`
        SELECT *
        FROM ticket ti, fase f, tarea ta, epic e
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND e.idTicket = ta.perteneceEpic
        AND f.idEstatus = 7
        AND e.idTicket = ?
        `,[id])
    }


    static async fetchOne(){
        return await db.execute (`
        SELECT *
        FROM ticket ti, fase f, tarea ta
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket                
        AND ti.idTicket = ?
        `,[id])
    }
    
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
    
}