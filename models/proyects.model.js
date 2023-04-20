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

    static fetchArea(projectID) {
        return db.execute(`
            SELECT t.front_back, COUNT(t.idTicket) as 'Complete'
            FROM TAREA t, EPIC e, PROYECTO p, FASE f, ESTATUS s
            WHERE t.idTicket = f.idTicket
            AND f.idEstatus = s.idEstatus
            AND t.perteneceEpic = e.idTicket
            AND (s.descripcion = 'Done' OR s.descripcion = 'Closed')
            AND e.perteneProyecto = p.idTicket
            AND p.idTicket = ?
            GROUP BY t.front_back
        `)
    }
}