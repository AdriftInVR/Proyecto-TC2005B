const db = require('../util/database');

module.exports = class User {

    static fetchAll() {
        return db.execute('SELECT * FROM usuario');
    }

    static fetchAllActive() {
        return db.execute(`SELECT U.idUsuario, U.nombre
        FROM usuario U, estado_laboral S
        WHERE S.idEstatus = 8
        AND U.idUsuario = S.idUsuario`
        );
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

    static async DeleteUser(name) {
        return await db.execute(`
        CALL deactivateUser(?)`,
        [name]);
    }
}