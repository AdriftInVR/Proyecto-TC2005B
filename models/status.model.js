const db = require('../util/database');

module.exports = class Estatus {

    static fetchAll() {
        return db.execute('SELECT * FROM ESTATUS');
    }
    
}