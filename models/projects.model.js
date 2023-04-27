const db = require('../util/database');

module.exports = class Proyecto {
    constructor(_newProyecto) {
        this.nombre = _newProyecto.nombre;
        this.fechaInicio = _newProyecto.fechaInicio;
    }

    save() {
        let error = false;
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


        db.execute(`
            SELECT *
            FROM PROYECTO p, TICKET t 
            WHERE p.idTicket = t.idTicket
            GROUP BY nombre;`)
            .then(([rows, fieldData]) => {
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].nombre == this.nombre) {
                        this.nombre = '';
                        error = "The name introduced has already taken";
                        break;
                    }
                }
                if (this.nombre == "" || this.nombre == undefined) {
                } else {
                    let id_temporal = makeid(6);

                    db.execute(`
                    INSERT INTO TICKET (idTicket, nombre)
                    VALUES (?, ?)
                `, [id_temporal, this.nombre])

                    db.execute(`
                    INSERT INTO PROYECTO (idTicket, fechaInicio)
                    VALUES (?, ?)
                `, [id_temporal, this.fechaInicio])

                    db.execute(`
                    INSERT INTO EPIC (perteneProyecto)
                    VALUES (?)
                `, [id_temporal])

                    .then(([rows, fieldData]) => {

                    })
                    .catch(err => {
                        console.log(err);
                    });

                }
                return error;
            })
            .catch(err => {
                console.log(err);
            })

        return db.execute(`
            SELECT *
            FROM PROYECTO p, TICKET t
            WHERE p.idTicket = t.idTicket
            GROUP BY nombre;`);
    }

    static fetchAll() {
        return db.execute(`
            SELECT t.nombre, p.fechainicio, p.duracion, p.idTicket
            FROM TICKET t, PROYECTO p
            WHERE  t.idTicket = p.idTicket;
        `);
    }
    
    static fetchOne(id) {
        return db.execute(`
            SELECT t.nombre, p.fechainicio, p.duracion, p.idTicket
            FROM TICKET t, PROYECTO p
            WHERE  t.idTicket = p.idTicket
            AND t.idTicket = ?;
        `,[id]);
    }

    static datos(dato) {
        return db.execute(`
        SELECT u.nombre, efectividadAsignada, front_back
        FROM TAREA t, RESPONSABLE r, TRABAJA tr, USUARIO u, PROYECTO p, TICKET ti
        WHERE u.idUsuario= tr.idUsuario
        AND u.idUsuario = r.idUsuario
        AND r.idTarea = t.idTicket
        AND tr.idProyecto = p.idTicket
        AND p.idTicket = ti.idTicket
        AND ti.idTicket= (?)
        GROUP BY u.nombre;
        `, [dato]);
    }

    static epics(epic) {
        return db.execute(`
        SELECT nombre, t.idTicket
        FROM TICKET t, EPIC e, PROYECTO p
        WHERE t.idTicket = e.idTicket
        AND perteneProyecto = p.idTicket 
        AND perteneProyecto IN (SELECT idTicket
                                   FROM TICKET
                                   WHERE idTicket = (?));
        `, [epic]);
    }

}
