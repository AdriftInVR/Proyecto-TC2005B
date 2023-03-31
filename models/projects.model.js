const db = require('../util/database');

module.exports = class Proyecto {
    constructor(_newProyecto) {
        this.nombre = _newProyecto;
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


        let r1 = db.execute(`
                    SELECT *
                    FROM PROYECTO p, TICKET t 
                    WHERE p.idTicket = t.idTicket
                    GROUP BY nombre;
                `,)


        if (this.nombre == " " && r1 == this.nombre){ //Falta no repetir nombre
                console.log('No se puede guardar')
        } else {
            console.log('Si se guardo')
            let id_temporal = makeid(6);

            db.execute(`
                INSERT INTO TICKET (idTicket, nombre)
                VALUES (?, ?)
            `, [id_temporal, this.nombre])
            

            db.execute(`
                INSERT INTO PROYECTO (idTicket)
                VALUES (?)
            `, [id_temporal])
            .then(([rows, fieldData]) => {
            console.log('Ya se guardo carnal')
            })
            .catch(err => {
                console.log(err);
            });

            
            db.execute(`
                SELECT nombre, puntosAgiles, front_back
                FROM tarea t, responsable r, trabaja tr, usuario u
                WHERE u.idUsuario= tr.idUsuario
                AND u.idUsuario = r.idUsuario
                AND r.idTarea = t.idTicket
                AND idProyecto= (?)
                GROUP BY nombre
            `,)
            .then(([rows, fieldData]) => {
            console.log('Ya se guardo carnal')
            })
            .catch(err => {
                console.log(err);
            });
        }


    }

    static fetchAll() {
        return db.execute(`
            SELECT t.nombre, p.fechainicio, p.duracion
            FROM TICKET t, PROYECTO p
            WHERE  t.idTicket = p.idTicket
        `);
    }



    

}