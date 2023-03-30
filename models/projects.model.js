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

    

}