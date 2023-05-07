const db = require('../util/database');

module.exports = class Estatus {

    static async fetchAll() {
        return await db.execute('SELECT * FROM estatus');
    }
    
}