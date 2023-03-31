const db = require('../util/database');

module.exports = class User {

    static fetchAll() {
        return db.execute('SELECT * FROM USUARIO');
    }
    
    static add(data){        
        for(let i=0;i<data.length;i++){
            db.execute(`INSERT INTO USUARIO(idUsuario,nombre) SELECT ?,? WHERE NOT EXISTS(SELECT 1 FROM USUARIO WHERE idUsuario = ?);`,[data[i].idUsuario,data[i].nombre,data[i].idUsuario])
            // .then(([rows, fieldData]) => {
            //     if(rows.affectedRows>0)console.log('Se inserto')
            // })
            .catch(err => {
                //console.log(err);
            });
            db.execute(`INSERT INTO ESTADO_LABORAL(idUsuario) SELECT ? WHERE NOT EXISTS(SELECT 1 FROM ESTADO_LABORAL WHERE idUsuario = ?);`,[data[i].idUsuario,data[i].idUsuario])
            .catch(err => {
                //console.log(err);
            });            
            db.execute(`INSERT INTO RESPONSABLE(idUsuario, idTarea) SELECT ?,? WHERE NOT EXISTS(SELECT 1 FROM RESPONSABLE WHERE idTarea = ?);`,[data[i].idUsuario,data[i].idTarea,data[i].idTarea])
            .catch(err => {
                //console.log(err);
            });
        }
        db.execute(`SELECT * FROM TICKET`)
        .then(([rows, fieldData]) => {
            console.log('Database are ready');
        })
    }
}