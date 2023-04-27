const db = require('../util/database');

module.exports = class Epic {

    static fetchAll() {
        return db.execute('SELECT * FROM EPIC');
    }
    
    static async fetchPrjPertenece(id){                
        return await db.execute(`SELECT perteneProyecto FROM EPIC WHERE idTicket = ?`,[id])
        .catch(err => {
            console.log({sql:err.sql, msg:err.sqlMessage});
        });        
    }

    static async add(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO EPIC(idTicket) VALUES (?)`,[data[i].idTicket])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }

    static fetchAllIDs() {
        return db.execute(`
            SELECT t.nombre as 'EpicName', e.idTicket as 'EpicID', e.perteneProyecto as 'ProjectID'
            FROM EPIC e, TICKET t
            WHERE e.idTicket = t.idTicket
        `);
    }

    static fetchStatus(epicID) {
        return db.execute(`
            SELECT s.descripcion as 'Nombre', COUNT(*) as Cantidad FROM ESTATUS s, FASE f, TAREA t, EPIC e, PROYECTO p
            WHERE s.idEstatus = f.idEstatus
            AND f.idTicket = t.idTicket
            AND t.perteneceEpic = e.idTicket
            AND e.idTicket = ?
            GROUP BY s.descripcion
        `, [epicID]);
    }

    static fetchCompletedAP(epicID, SoW, EoW) {
        return db.execute(`
        SELECT E.idTicket, SUM(T.puntosAgiles) as 'WeekAP'
        FROM TAREA T, EPIC E, FASE F, ESTATUS S
        WHERE E.idTicket = T.perteneceEpic
        AND T.idTicket = F.idTicket
        AND F.idEstatus = S.idEstatus
        AND (S.descripcion = 'Done' OR S.descripcion = 'Closed')
        AND F.fechaCambio BETWEEN ? AND ?
        AND E.idTicket = ?
        GROUP BY E.idTicket
        `, [SoW, EoW, epicID])
    };

    static async fetchAPepic(epicID){
        return await db.execute (`
        SELECT SUM(ta.puntosAgiles) as 'APTotalesE'
        FROM proyecto p, ticket t, epic e, tarea ta
        WHERE p.idTicket = t.idTicket
        AND p.idTicket = e.perteneProyecto
        AND ta.perteneceEpic = e.idTicket
        AND e.idTicket = ?
        GROUP BY p.idTicket
        `, [epicID])
    }

/* LINEA VERDE EPICS :D */
    static fetchGreenEpicLine(epicID){
        return db.execute (`
        SELECT COUNT(ta.idTicket)
        FROM TICKET ti, FASE f, TAREA ta, EPIC e
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND e.idTicket = ta.perteneceEpic
        AND f.idEstatus = 6 
        AND e.idTicket = ?
        `, [epicID])
    }

}