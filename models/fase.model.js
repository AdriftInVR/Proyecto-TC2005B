const db = require('../util/database');

module.exports = class Fase {

    static fetchAll() {
        return db.execute('SELECT * FROM FASE');
    }
    
    static add(data){        
        for(let i=0;i<data.length;i++){
            db.execute(`INSERT INTO FASE(idTicket,idEstatus) VALUES (?,?);`,[data[i].idTicket,data[i].idEstatus])
            // .then(([rows, fieldData]) => {
            //     if(rows.affectedRows>0)console.log('Se inserto')
            // })
            .catch(err => {
                console.log(err);
            });
        }        
    }
}