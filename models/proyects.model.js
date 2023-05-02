const db = require('../util/database');

module.exports = class Proyecto {
    constructor(_newProyecto) {
        this.nombre = _newProyecto.nombre;
    }

    save() {
        function makeid(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let counter = 0;
            while (counter < length) {
              result += characters.charAt(Math.floor(Math.random() * characters.length));
              counter += 1;
            }
            return result;
        }

        let id_temporal = makeid(6);

        return db.execute(`
            INSERT INTO ticket (idTicket, nombre)
            VALUES (?, ?)
        `, [id_temporal, this.nombre]);
    }

    static fetchAll() {
        return db.execute(`
            SELECT t.nombre, p.fechainicio, p.duracion
            FROM ticket t, proyecto p
            WHERE  t.idTicket = p.idTicket
        `);
    }

    static async fetchOne(id) {
        return await db.execute(`
            SELECT t.nombre, p.fechainicio, p.duracion
            FROM ticket t, proyecto p
            WHERE  t.idTicket = p.idTicket
            AND p.idTicket = ?
        `,[id]);
    }

    static fetchNotTitle(projectID) {
        return db.execute(`
            SELECT idTicket FROM proyecto p
            WHERE p.idTicket = ?
        `, [projectID]);
    }

    static fetchStatus(projectID) {
        return db.execute(`
            SELECT s.descripcion as 'Nombre', COUNT(*) as Cantidad FROM estatus s, fase f, tarea t, epic e, proyecto p
            WHERE s.idEstatus = f.idEstatus
            AND f.idTicket = t.idTicket
            AND t.perteneceEpic = e.idTicket
            AND e.perteneProyecto = p.idTicket
            AND p.idTicket = ?
            GROUP BY s.descripcion
        `, [projectID]);
    }

    static fetchEpics(projectID) {
        return db.execute(`
            SELECT t.nombre as 'EpicName', e.idTicket as 'EpicID', e.perteneProyecto as 'ProjectID'
            FROM epic e, ticket t
            WHERE e.idTicket = t.idTicket
            AND e.perteneProyecto = ?
        `, [projectID]);
    }

    static fetchAllIDs() {
        return db.execute(`
            SELECT t.nombre as 'ProjectName', p.idTicket as 'ProjectID'
            FROM proyecto p, ticket t
            WHERE p.idTicket = t.idTicket
        `);
    }

    static async fetchEstimate(projectID) {
        return await db.execute(`
        CALL getEstimate(?)
        `, [projectID]);
    }

    static fetchCompletedAP(projectID, SoW, EoW) {
        return db.execute(`
        SELECT P.idTicket, SUM(T.puntosAgiles) as 'WeekAP'
        FROM proyecto P, tarea T, epic E, fase F, estatus S
        WHERE P.idTicket = E.perteneProyecto
        AND E.idTicket = T.perteneceEpic
        AND T.idTicket = F.idTicket
        AND F.idEstatus = S.idEstatus
        AND (S.descripcion = 'Done' OR S.descripcion = 'Closed')
        AND F.fechaCambio BETWEEN ? AND ?
        AND P.idTicket = ?
        GROUP BY P.idTicket
        `, [SoW, EoW, projectID]);
    }
    
    static async fetchCompletePrj(projectID) {
        return await db.execute(`
            SELECT t.front_back, COUNT(t.idTicket) as 'Complete'
            FROM tarea t, epic e, proyecto p, fase f, estatus s
            WHERE t.idTicket = f.idTicket
            AND f.idEstatus = s.idEstatus
            AND t.perteneceEpic = e.idTicket
            AND (s.descripcion = 'Done' OR s.descripcion = 'Closed')
            AND e.perteneProyecto = p.idTicket
            AND p.idTicket = ?
            GROUP BY t.front_back
        `,[projectID])
    }
    
    static async fetchDateFinal(projectID) {
        return await db.execute(`
            SELECT *
            FROM tarea t, epic e, proyecto p, fase f, estatus s
            WHERE t.idTicket = f.idTicket
            AND f.idEstatus = s.idEstatus
            AND t.perteneceEpic = e.idTicket
            AND (s.descripcion = 'Done' OR s.descripcion = 'Closed')
            AND e.perteneProyecto = p.idTicket
            AND p.idTicket = ?
            ORDER BY fechaCambio DESC
        `,[projectID])
    }
    
    static async fetchAllPrj(projectID) {
        return await db.execute(`
            SELECT t.front_back, COUNT(puntosAgiles) as 'Completed'
            FROM tarea t, epic e, proyecto p
            WHERE t.perteneceEpic = e.idTicket
            AND e.perteneProyecto = p.idTicket
            AND p.idTicket = ?
            GROUP BY t.front_back
        `,[projectID])        
    }

    static async fetchCompleteEpi(epicID) {
        return await db.execute(`
            SELECT t.front_back, COUNT(t.idTicket) as 'Complete'
            FROM tarea t, epic e, fase f, estatus s
            WHERE t.idTicket = f.idTicket
            AND f.idEstatus = s.idEstatus
            AND t.perteneceEpic = e.idTicket
            AND (s.descripcion = 'Done' OR s.descripcion = 'Closed')            
            AND e.idTicket = ?
            GROUP BY t.front_back
        `, [epicID])
    }
    
    static async fetchAllEpi(epicID) {
        return await db.execute(`
            SELECT t.front_back, COUNT(puntosAgiles) as 'Completed'
            FROM tarea t, epic e
            WHERE t.perteneceEpic = e.idTicket
            AND e.idTicket = ?
            GROUP BY t.front_back
        `, [epicID])
    }

    static async fetchAPproject(projectID, EoW){
        return await db.execute (`
        SELECT SUM(ta.puntosAgiles) as 'TotalAP'
        FROM proyecto p, ticket t, epic e, tarea ta
        WHERE p.idTicket = t.idTicket
        AND p.idTicket = e.perteneProyecto
        AND ta.perteneceEpic = e.idTicket
        AND p.idTicket = ?
        AND ta.asignacionEpiTar < ?;
        `, [projectID, EoW])
    }



    static async fetchAPepic(epicID, EoW){
        return await db.execute (`
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


    /* LINEA VERDE PROYECTOS :) */
    static fetchGreenLine(projectID){
        return db.execute(`
        SELECT f.fechaCambio, t.puntosAgiles
        FROM tarea t, epic e, proyecto p, fase f
        WHERE t.perteneceEpic = e.idTicket
        AND e.perteneProyecto = p.idTicket
        AND p.idTicket = 3
        AND t.idTicket = f.idTicket
        AND (f.idEstatus = 7 OR f.idEstatus = 6)
        ORDER BY f.fechaCambio DESC
        `, [projectID])
    }
}