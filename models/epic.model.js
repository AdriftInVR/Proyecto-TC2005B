const db = require('../util/database');

module.exports = class Epic {

    static fetchAll() {
        return db.execute('SELECT * FROM EPIC');
    }
    
    static add(data){        
        for(let i=0;i<data.length;i++){
            db.execute(`INSERT INTO EPIC(idTicket) SELECT ? WHERE NOT EXISTS(SELECT 1 FROM EPIC WHERE idTicket = ?);`,[data[i].idTicket,data[i].idTicket])
            // .then(([rows, fieldData]) => {
            //     if(rows.affectedRows>0)console.log('Se inserto')
            // })
            .catch(err => {
                //console.log(err);
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

    static fetchAPepics(epicID){
        return db.execute(`
        SELECT SUM(ta.puntosAgiles)
        FROM proyecto p, ticket t, epic e, tarea ta
        WHERE p.idTicket = t.idTicket
        AND p.idTicket = e.perteneProyecto
        AND ta.perteneceEpic = e.idTicket
        AND e.idTicket = ?
        GROUP BY p.idTicket
        `, [epicID])
    }
}