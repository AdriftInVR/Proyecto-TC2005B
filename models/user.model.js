const db = require('../util/database');

module.exports = class User {

    static fetchAll() {
        return db.execute('SELECT * FROM usuario');
    }
    
    static fetchAllRespon() {
        return db.execute('SELECT * FROM responsable');
    }
    
    static async add(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO usuario(idUsuario,nombre) SELECT ?,? WHERE NOT EXISTS(SELECT 1 FROM estado_laboral WHERE idUsuario = ?);`,[data[i].idUsuario,data[i].nombre,data[i].idUsuario])            
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
            await db.execute(`INSERT INTO estado_laboral(idUsuario, idEstatus) SELECT ?,8 WHERE NOT EXISTS(SELECT 1 FROM estado_laboral WHERE idUsuario = ?);`,[data[i].idUsuario,data[i].idUsuario])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });                        
        }        
    }

    static async addRespon(data){
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO responsable(idUsuario, idTarea) VALUES (?,?)`,[data[i].idUsuario,data[i].idTarea])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }
    }

    static fetchUserProjects(name) {
        return db.execute(`SELECT t.nombre
        FROM usuario as u, trabaja as tr, ticket as t
        WHERE u.idUsuario = tr.idUsuario
        AND tr.idProyecto = t.idTicket
        AND u.nombre = ?`,
        [name]);
    }

    static fetchUserTasks(name) {
        return db.execute(`SELECT ta.front_back
        FROM tarea as ta, responsable as re, usuario as u
        WHERE u.idUsuario = re.idUsuario
        AND re.idTarea = ta.idTicket
        AND u.nombre = ?`,
        [name]);
    }

    static UserNoAsignated() {
        return db.execute(`SELECT nombre
        FROM USUARIO
        WHERE idUsuario NOT IN (SELECT idUsuario FROM TRABAJA)`,
        []);
    }
/*
    /* -- Actualizar usuario -- 
    static update(NewData){
        return db.execute(`
            UPDATE trabaja
            SET idUsuario = ?
            WHERE idTicket = ?;
        `, [NewData.idUsuario, NewData.idTicket])
    }

        CAMBIAR SUS PUNTOS ÁGILES
         static updateAgPo(NewData){
        db.execute(`
            UPDATE trabaja
            SET efectividadAsignada = ?
            WHERE idTicket = ?;
        `, [NewData.efectividadAsignada, NewData.idTicket])
    }

    CAMBIAR PERTENECE EPICS
    static updatePertenEpic(NewData){
        return db.execute(`
            UPDATE epic
            SET perteneProyecto = ?
            WHERE idTicket = ?;
        `, [NewData.perteneProyecto, NewData.idTicket])  
    }
*/

}