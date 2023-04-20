const db = require('../util/database');

module.exports = class User {

    static fetchAll() {
        return db.execute('SELECT * FROM USUARIO');
    }
    
    static fetchAllRespon() {
        return db.execute('SELECT * FROM RESPONSABLE');
    }
    
    static async add(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO USUARIO(idUsuario,nombre) SELECT ?,? WHERE NOT EXISTS(SELECT 1 FROM ESTADO_LABORAL WHERE idUsuario = ?);`,[data[i].idUsuario,data[i].nombre,data[i].idUsuario])            
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
            await db.execute(`INSERT INTO ESTADO_LABORAL(idUsuario, idEstatus) SELECT ?,8 WHERE NOT EXISTS(SELECT 1 FROM ESTADO_LABORAL WHERE idUsuario = ?);`,[data[i].idUsuario,data[i].idUsuario])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });                        
        }        
    }

    static async addRespon(data){
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO RESPONSABLE(idUsuario, idTarea) VALUES (?,?)`,[data[i].idUsuario,data[i].idTarea])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }
    }

    static fetchUserProjects(name) {
        return db.execute(`SELECT t.nombre
        FROM USUARIO as u, TRABAJA as tr, TICKET as t
        WHERE u.idUsuario = tr.idUsuario
        AND tr.idProyecto = t.idTicket
        AND u.nombre = ?`,
        [name]);
    }
}