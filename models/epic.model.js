const db = require('../util/database');

module.exports = class epic {

    static fetchAll() {
        return db.execute('SELECT * FROM epic');
    }
    
    static async fetchPrjPertenece(id){                
        return await db.execute(`SELECT perteneProyecto FROM epic WHERE idTicket = ?`,[id])
        .catch(err => {
            console.log({sql:err.sql, msg:err.sqlMessage});
        });        
    }

    static async add(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO epic(idTicket) VALUES (?)`,[data[i].idTicket])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }

    static fetchAllIDs() {
        return db.execute(`
            SELECT t.nombre as 'EpicName', e.idTicket as 'EpicID', e.perteneProyecto as 'ProjectID'
            FROM epic e, ticket t
            WHERE e.idTicket = t.idTicket
        `);
    }

    static fetchAllNoAsignate(){
        return db.execute(`
            SELECT t.nombre as 'EpicName', e.idTicket as 'EpicID', e.perteneProyecto as 'ProjectID'
            FROM epic e, ticket t
            WHERE e.idTicket = t.idTicket
            AND e.perteneProyecto IS NULL
        `);
    }

    static fetchAllNoAsignate(){
        return db.execute(`
            SELECT t.nombre as 'EpicName', e.idTicket as 'EpicID', e.perteneProyecto as 'ProjectID'
            FROM epic e, ticket t
            WHERE e.idTicket = t.idTicket
            AND e.perteneProyecto IS NULL
        `);
    }

    static fetchAllAsignate(id){
        return db.execute(`
            SELECT t.nombre as 'EpicName', e.idTicket as 'EpicID', e.perteneProyecto as 'ProjectID'
            FROM epic e, ticket t
            WHERE e.idTicket = t.idTicket
            AND e.perteneProyecto = ?
        `, [id]);
    }

    static async dropPrj(id){
        return await db.execute('UPDATE epic SET perteneProyecto = NULL WHERE perteneProyecto = ?', [id]);
    }
    
    static async dropPrjEpicId(id){
        for(let i=0;i<id.length;i++){
            return await db.execute('UPDATE epic SET perteneProyecto = NULL WHERE idTicket = ?', [id[i]]);
        }
        
    }

    static fetchStatus(epicID) {
        return db.execute(`
            SELECT s.descripcion as 'Nombre', COUNT(*) as Cantidad FROM estatus s, fase f, tarea t, epic e, proyecto p
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
        FROM tarea T, epic E, fase F, estatus S
        WHERE E.idTicket = T.perteneceEpic
        AND T.idTicket = F.idTicket
        AND F.idEstatus = S.idEstatus
        AND (S.descripcion = 'Done' OR S.descripcion = 'Closed')
        AND F.fechaCambio BETWEEN ? AND ?
        AND E.idTicket = ?
        GROUP BY E.idTicket
        `, [SoW, EoW, epicID])
    };

    static fetchAPepic(epicID, EoW){
        return db.execute (`
        SELECT SUM(ta.puntosAgiles) as 'TotalAP'
        FROM proyecto p, ticket t, epic e, tarea ta
        WHERE p.idTicket = t.idTicket
        AND p.idTicket = e.perteneProyecto
        AND ta.perteneceEpic = e.idTicket
        AND e.idTicket = ?
        AND ta.asignacionEpiTar < ?
        `, [epicID, EoW])
    }
/*
    static fetchAPepic(epicID, EoW){
        return db.execute (`
        SELECT SUM(ta.puntosAgiles) as 'APTotalesE'
        FROM proyecto p, ticket t, epic e, tarea ta
        WHERE p.idTicket = t.idTicket
        AND p.idTicket = e.perteneProyecto
        AND ta.perteneceEpic = e.idTicket
        AND e.idTicket = ?
        AND ta.asignacionEpiTar < ?
        GROUP BY p.idTicket
        `, [epicID, EoW])
    }
    */
/* LINEA VERDE EPICS :D */
    static fetchGreenEpicLine(epicID){
        return db.execute (`
        SELECT COUNT(ta.idTicket)
        FROM ticket ti, fase f, tarea ta, epic e
        WHERE ti.idTicket = f.idTicket
        AND ti.idTicket = ta.idTicket
        AND e.idTicket = ta.perteneceEpic
        AND f.idEstatus = 6 
        AND e.idTicket = ?
        `, [epicID])
    }

    static async setEpicProj(id, epics){       
        for(let i=0;i<epics.length;i++){            
            await db.execute(`UPDATE epic SET perteneProyecto = ? WHERE idTicket = ?`,[id,epics[i]])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }    
    }
}