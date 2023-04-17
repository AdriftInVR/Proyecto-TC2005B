const db = require('../util/database');

module.exports = class Proyecto {
    constructor(_newProyecto) {
        this.nombre = _newProyecto.nombre;
        this.fechaInicio = _newProyecto.fechaInicio;
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


        db.execute(`
            SELECT *
            FROM PROYECTO p, TICKET t 
            WHERE p.idTicket = t.idTicket
            GROUP BY nombre;
        `,)
        .then(([rows, fieldData])=>{
            for(let i=0;i<rows.length;i++){
                if(rows[i].nombre ==this.nombre){
                    this.nombre='';
                    break;
                }
            }
            if (this.nombre == "" || this.nombre==undefined){ //Falta no repetir nombre
                    console.log('No se puede guardar')
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
                .then(([rows, fieldData]) => {
                
                })
                .catch(err => {
                    console.log(err);
                });

            }
        })
        .catch(err=>{
            console.log(err);
        })
        
    }

    static fetchAll() {
        return db.execute(`
            SELECT t.nombre, p.fechainicio, p.duracion
            FROM TICKET t, PROYECTO p
            WHERE  t.idTicket = p.idTicket;
        `);
    }
    
    static datos(dato){
        return db.execute(`
            SELECT u.nombre, puntosAgiles, front_back
            FROM tarea t, responsable r, trabaja tr, usuario u, proyecto p, ticket ti
            WHERE u.idUsuario= tr.idUsuario
            AND u.idUsuario = r.idUsuario
            AND r.idTarea = t.idTicket
            AND tr.idProyecto = p.idTicket
            AND p.idTicket = ti.idTicket
            AND ti.nombre= (?)
            GROUP BY u.nombre;
        `,[dato]);
    }

    static epics(epic){
        return db.execute(`
            SELECT nombre
            FROM ticket t, epic e, proyecto p
            WHERE t.idTicket = e.idTicket
            AND perteneProyecto = p.idTicket 
            AND perteneProyecto = (?);
        `,[epic]);
    }

}
