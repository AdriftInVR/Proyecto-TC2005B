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
            return result;
        }

        id_temporal = makeid(6);

        return db.execute(`
            INSERT INTO TICKET (idTicket, nombre)
            VALUES (?, ?)
        `, [id_temporal, this.nombre]);
    }

    static fetchAll() {
        return db.execute(`
            SELECT t.nombre, p.fechainicio, p.duracion
            FROM TICKET t, PROYECTO p
            WHERE  t.idTicket = p.idTicket
        `);
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
            FROM EPIC e, TICKET t
            WHERE e.idTicket = t.idTicket
            AND e.perteneProyecto = ?
        `, [projectID]);
    }

    static fetchAllIDs() {
        return db.execute(`
            SELECT t.nombre as 'ProjectName', p.idTicket as 'ProjectID'
            FROM PROYECTO p, TICKET t
            WHERE p.idTicket = t.idTicket
        `);
    }

    static fetchEstimate(projectID) {
        return db.execute(`
        CALL getEstimate(?)
        `, [projectID]);
    }

    static fetchCompletedAP(projectID, SoW, EoW) {
        return db.execute(`
        SELECT P.idTicket, SUM(T.puntosAgiles) as 'WeekAP'
        FROM PROYECTO P, TAREA T, EPIC E, FASE F, ESTATUS S
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
}
