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
            SELECT idTicket FROM PROYECTO p
            WHERE p.idTicket = ?
        `, [projectID]);
    }

    static fetchStatus(projectID) {
        return db.execute(`
            SELECT s.descripcion as 'Nombre', COUNT(*) as Cantidad FROM ESTATUS s, FASE f, TAREA t, EPIC e, PROYECTO p
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
    
    static async fetchCompletePrj(projectID) {
        return await db.execute(`
            SELECT t.front_back, COUNT(t.idTicket) as 'Complete'
            FROM TAREA t, EPIC e, PROYECTO p, FASE f, ESTATUS s
            WHERE t.idTicket = f.idTicket
            AND f.idEstatus = s.idEstatus
            AND t.perteneceEpic = e.idTicket
            AND (s.descripcion = 'Done' OR s.descripcion = 'Closed')
            AND e.perteneProyecto = p.idTicket
            AND p.idTicket = ?
            GROUP BY t.front_back
        `,[projectID])
    }
    
    static async fetchAllPrj(projectID) {
        return await db.execute(`
            SELECT t.front_back, COUNT(puntosAgiles) as 'Completed'
            FROM TAREA t, EPIC e, PROYECTO p
            WHERE t.perteneceEpic = e.idTicket
            AND e.perteneProyecto = p.idTicket
            AND p.idTicket = ?
            GROUP BY t.front_back
        `,[projectID])        
    }

    static async fetchCompleteEpi(epicID) {
        return await db.execute(`
            SELECT t.front_back, COUNT(t.idTicket) as 'Complete'
            FROM TAREA t, EPIC e, FASE f, ESTATUS s
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
            FROM TAREA t, EPIC e
            WHERE t.perteneceEpic = e.idTicket
            AND e.idTicket = ?
            GROUP BY t.front_back
        `, [epicID])
    }

    static fetchEstimate(projectID) {
        return db.execute(`
        BEGIN
        SET @PT = ?;
        SET @AP = (SELECT SUM(T.puntosAgiles)
                   FROM TAREA T, EPIC E, PROYECTO P
                   WHERE T.perteneceEpic = E.idTicket
                   AND E.perteneProyecto = P.idTicket
                   AND P.idTicket = @PT);
        SET @WEEKLY = (SELECT SUM(W.efectividadAsignada) 
                       FROM TRABAJA W, PROYECTO P
                       WHERE P.idTicket = W.idProyecto
                       AND P.idTicket = @PT);
        SELECT CEIL(@AP/@WEEKLY) as 'Estimate', P.fechaInicio as 'Inicio'
        FROM PROYECTO P
        WHERE P.idTicket = @PT;
        END
        `, [projectID]);
    }

    //Puntos Aguiles Totales por epic y proyecto

    static async fetchAPproject(projectID){
        return await db.execute (`
        SELECT SUM(ta.puntosAgiles) as 'APTotalesP'
        FROM proyecto p, ticket t, epic e, tarea ta
        WHERE p.idTicket = t.idTicket
        AND p.idTicket = e.perteneProyecto
        AND ta.perteneceEpic = e.idTicket   
        AND t.idTicket = ?;
        `, [projectID])
    }
}