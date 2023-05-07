const db = require('../util/database');
const Epic = require('../models/epic.model')

let id_temporal= 0;
module.exports = class Proyecto {
    constructor(_newProyecto) {
        this.nombre = _newProyecto.nombre;
        this.fechaInicio = _newProyecto.fechaInicio;
        this.epics = _newProyecto.epics;        
    }

    async save() {
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


        await db.execute(`
            SELECT *
            FROM proyecto p, ticket t 
            WHERE p.idTicket = t.idTicket
            GROUP BY nombre;`)
        .then(([rows, fieldData]) => {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].nombre == this.nombre) {
                    this.nombre = '';
                    error = "The name introduced has already been taken";
                    return error;
                    break;
                }
            }                              
        })
        .catch(err => {
            console.log(err);
        });

        if (this.nombre == "" || this.nombre == undefined) {
            error = 'Please write a name';
            return err;
        } else {
            id_temporal = makeid(6);

            await db.execute(`
                INSERT INTO ticket (idTicket, nombre)
                VALUES (?, ?)
            `, [id_temporal, this.nombre])

            await db.execute(`
                INSERT INTO proyecto (idTicket, fechaInicio)
                VALUES (?, ?)
            `, [id_temporal, this.fechaInicio])
            .then(([rows, fieldData]) => {

            })
            .catch(err => {
                console.log(err);
            });
        }  

        await Epic.setEpicProj(id_temporal,this.epics )
        .catch(err => console.log(err))        

        return false;
    }

    static fetchAll() {
        return db.execute(`
            SELECT t.nombre, p.fechainicio, p.duracion, p.idTicket
            FROM ticket t, proyecto p
            WHERE  t.idTicket = p.idTicket;
        `);
    }
    
    static fetchOne(id) {
        return db.execute(`
            SELECT t.nombre, p.fechainicio, p.duracion, p.idTicket
            FROM ticket t, proyecto p
            WHERE  t.idTicket = p.idTicket
            AND t.idTicket = ?;
        `,[id]);
    }

    static datos(dato) {
        return db.execute(`
        SELECT u.nombre, efectividadAsignada, front_back
        FROM tarea t, responsable r, trabaja tr, usuario u, proyecto p, ticket ti
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
        FROM ticket t, epic e, proyecto p
        WHERE t.idTicket = e.idTicket
        AND perteneProyecto = p.idTicket 
        AND perteneProyecto IN (SELECT idTicket
                                   FROM ticket
                                   WHERE idTicket = (?));
        `, [epic]);
    }

}
