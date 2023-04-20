const db = require('../util/database');

module.exports = class Tarea {

    static fetchAll() {
        return db.execute('SELECT * FROM TAREA');
    }
    
    static async add(data){        
        for(let i=0;i<data.length;i++){            
            await db.execute(`INSERT INTO TAREA(idTicket,perteneceEpic,puntosAgiles,esTipo,front_back) VALUES (?,?,?,?,?) `,
            [data[i].idTicket,data[i].perteneceEpic,data[i].puntosAgiles,data[i].esTipo,data[i].front_back])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }

    static async update(data){        
        for(let i=0;i<data.length;i++){            
            await db.execute(`UPDATE TAREA SET idTicket = ?,perteneceEpic = ?, puntosAgiles = ?,esTipo = ?, front_back = ? WHERE idTicket = ? `,
            [data[i].idTicket,data[i].perteneceEpic,data[i].puntosAgiles,data[i].esTipo,data[i].front_back, data[i].idTicket])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }
}