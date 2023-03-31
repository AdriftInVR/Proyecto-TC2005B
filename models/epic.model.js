const db = require('../util/database');

module.exports = class Epic {

    static fetchAll() {
        return db.execute('SELECT * FROM EPIC');
    }
    
    static add(data){        
        for(let i=0;i<data.length;i++){
            db.execute(`INSERT INTO EPIC(idTicket) SELECT ? WHERE NOT EXISTS(SELECT 1 FROM EPIC WHERE idTicket = ?);`,[data[i].idTicket,data[i].idTicket])
            // .then(([rows, fieldData]) => {
            //     if(rows.affectedRows>0)console.log('Se inserto')
            // })
            .catch(err => {
                console.log(err);
            });
        }        
    }
}