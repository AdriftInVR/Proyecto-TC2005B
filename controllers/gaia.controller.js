//Base de datos
const Ticket = require('../models/tickets.model');
const Estatus = require('../models/status.model');
const Fase = require('../models/fase.model');
const fs = require('fs');
control = []
const db = require('../util/database');

control.getLogin = (req, res) => {
    res.render('login')
};

control.getProjects = (req, res) => {
    Ticket.fetchAll()
    .then(([rows, fieldData]) => {
        console.log(rows);
        
        res.render('home', { 
            active: 'projects',
            nombre: rows, 
        });
    })
    .catch(err => {
        console.log(err);
     });   
};

control.getProject = (req, res) => {
    res.render('project', {
        active: 'projects'
    })
};

control.getTasks = (req, res) => {
    res.render('tasks', {
        active: 'projects'
    })
};

control.getUsers = (req, res) => {
    res.render('users', {
        active: 'users'
    })
};

control.getDashboard = (req, res) => {
    res.render('dashboard')
};

control.getImport = (req, res) => {
    res.render('import', {
        active: 'import',
        result:'void'
    });
};

control.postImport = (request, response, next) => {
    response.render('import',{active: 'import',result:'succes' || 'err'});
};

control.processCsv=(req,res)=>{
    //get data from data.csv
    filePath = './public/files/data.csv';
    const fileText = fs.readFileSync(filePath).toString();
    const allLines = fileText.split('\n');
    const header = allLines[0];
    
    const dataLines = allLines.slice(1);
    const fieldNames = header.split(',');
    for(let i=0;i<fieldNames.length;i++){
        fieldNames[i] = fieldNames[i].replace(/\s+/g, '');
        fieldNames[i] = fieldNames[i].replace('(', '');
        fieldNames[i] = fieldNames[i].replace(')', '');
    }
    let objList = [];

    for(let i=0; i<dataLines.length;i++){
        let obj = {};
        const data = dataLines[i].split(',');
        for(let j=0; j < fieldNames.length;j++){
            const fieldName = fieldNames[j].toLowerCase();
            obj[fieldName] = data[j];
        }
        objList.push(obj);
    }
    console.log('Data from CSV was readed');

    //Send data to database

    //Data to table ticket
    let entries = [];
    for(let i=0; i<dataLines.length; i++){        
        let ticketInsert = {
            idTicket: objList[i].issueid,
            nombre:  objList[i].summary
        }        
        entries.push(ticketInsert);
    }    
    console.log('Data list for Tickets was created');
    Ticket.add(entries)

    //Data to table fase
    entries = [];
    estados = [];
    Estatus.fetchAll()
    .then(([rows, fieldData]) => {
        for(let i=0;i<rows.length;i++){
            estados.push(rows[i].descripcion);
        }
        for(let i=0; i<dataLines.length; i++){
            let state = 1;
            for(let j=0;j<estados.length;j++){
                if(objList[i].status == estados[j]){
                    state = j+1;
                    break;
                }
            }
    
            let rowInsert = {
                idTicket:  objList[i].issueid,
                idEstatus: state
            } 
            entries.push(rowInsert);
        }        
    }) 
    .catch(err => {
        console.log(err);
    });
    Fase.add(entries)
};


control.postImport = (request, response, next) => {
    response.render('import',{active: 'import',result:'succes' || 'err'});
}

module.exports = control