const db = require('../database');

module.exports = class Project {

    static fetchAll() {
        return db.execute('SELECT * FROM ticket');
     }
    
    static add(data){
        db.execute('INSERT INTO TICKET VALUES ?',data)        
    }
}