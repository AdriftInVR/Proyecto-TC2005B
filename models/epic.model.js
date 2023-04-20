const db = require('../util/database');

module.exports = class Epic {

    static fetchAll() {
        return db.execute('SELECT * FROM EPIC');
    }
    
    static async add(data){        
        for(let i=0;i<data.length;i++){
            await db.execute(`INSERT INTO EPIC(idTicket) VALUES (?)`,[data[i].idTicket])
            .catch(err => {
                console.log({sql:err.sql, msg:err.sqlMessage});
            });
        }        
    }
}