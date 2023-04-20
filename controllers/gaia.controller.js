const fs = require('fs');
//Base de datos
const Ticket = require('../models/tickets.model');
const Estatus = require('../models/status.model');
const Fase = require('../models/fase.model');
const Proyecto = require('../models/projects.model');
const Epic = require('../models/epic.model');
const User = require('../models/user.model');
const Tarea = require('../models/tarea.model');
const db = require('../util/database');
const { normalize } = require('path');

control = [];
let msgErrorAddProject = false;


control.getLogin = (req, res) => {
    res.render('login')
};

control.getProjects = (req, res) => {
    Proyecto.fetchAll()
    .then(([rows, filedData]) => {
        res.render('home', {
            active: 'projects',
            proyectos: rows,
            msgErr: msgErrorAddProject
        });
    })
    .catch(err => {
        console.log(err);
    });
};


control.getProject = async (req, res) => {
    projectName = req.params.prj

    try {
        [datos, filedData] = await Proyecto.datos(projectName);
        console.log(datos);
    
        [epics, filedData] = await Proyecto.epics(projectName);
        console.log(epics);
    } catch (err) {
        console.log(err);
    }


    res.render('project', {
        active: 'projects',
        epics: epics,
        projectName: projectName,
        datos: datos, 
    });
    
};


control.getTasks = async (req, res) => {

    try {
        [task1, fieldData] = await Tarea.tasktdo();
        console.log(task1);

        [task2, fieldData] = await Tarea.taskinpro();
        console.log(task2);

        [task3, fieldData] = await Tarea.taskcode();
        console.log(task3);

        [task4, fieldData] = await Tarea.taskquality();
        console.log(task4);

        [task5, fieldData] = await Tarea.taskrelease();
        console.log(task5);

        [task6, fieldData] = await Tarea.taskdone();
        console.log(task6);

        [task7, fieldData] = await Tarea.taskclosed();
        console.log(task7);

    } catch (err) {
        console.log(err);
    }

    res.render('tasks', {
        active: 'projects',
        tasks1: task1,
        tasks2: task2,
        tasks3: task3,
        tasks4: task4,
        tasks5: task5,
        tasks6: task6,
        tasks7: task7,
    });
    

    /*Tarea.estat(req.params.idEstatus)
    .then(([rows, fieldData]) => {
        console.log(rows);
        res.render('tasks', {
            task: rows,
            active: 'projects',
        });
    })
    .catch(err => {
        console.log(err);
    })*/
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
        active: 'import'
    });
};

control.postImport = (request, response, next) => {
    control.processCsv(request,response);
    response.redirect('/gaia/import');
};


control.processCsv=(req,res)=>{
    //get data from data.csv
    filePath = './public/files/data.csv';
    let fileText = fs.readFileSync(filePath).toString();
    fileText = fileText.trimEnd();
    let open = false;
    for(let i=0;i<fileText.length;i++){
        if(fileText[i]==`"` && open==false){
            open = true;                  
        }
        else if(fileText[i]==`"` && open==true){
            open = false;
        }else if(fileText[i]==',' && open==true){            
            fileText = fileText.slice(0, i) + fileText.slice(i+1, fileText.length);                            
        }
    }

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
            let fieldName = fieldNames[j].toLowerCase();
            if(fieldName == 'labels') fieldName+=j;
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
    Fase.add(entries);

    //Data for table EPICS
    entries = [];
    for(let i=0; i<dataLines.length; i++){         
        let ticketInsert = {
            idTicket: objList[i].customfieldepiclink,
            nombre:  objList[i].epiclinksummary
        };
        entries.push(ticketInsert);
    }
    // console.log(entries);
    Ticket.add(entries);
    Epic.add(entries);


    //Data for Tasks
    entries = [];
    for(let i=0; i<dataLines.length; i++){
        //get points
        if(objList[i].customfieldstorypoints == '') objList[i].customfieldstorypoints = 0.0;
        //get estipo
        typeTicket = 1;
        if(objList[i].issuetype== 'Task'){
            typeTicket = 1;
        }else if(objList[i].issuetype== 'Story'){
            typeTicket = 2;
        }else if(objList[i].issuetype=='Bug'){
            typeTicket = 3;
        }
        //get front_back
        workarea = 0;
        if(objList[i].labels11!='part/Frontend') workarea=1;

        let ticketInsert = {
            idTicket: objList[i].issueid,
            perteneceEpic: objList[i].customfieldepiclink,
            puntosAgiles:  objList[i].customfieldstorypoints,
            esTipo: typeTicket,
            front_back:workarea
        };
        entries.push(ticketInsert);          
    }

    Tarea.add(entries);

    //Data for USERS, laboral_state  and responsable
    entries = [];
    for(let i=0; i<dataLines.length; i++){
        if(objList[i].assigneeid != ''){
            let ticketInsert = {
                idUsuario: objList[i].assigneeid,
                idTarea: objList[i].issueid,
                nombre:  objList[i].assignee
            };
            entries.push(ticketInsert);
        }        
    }
    
    User.add(entries);
};

control.postProject = (req, res, next) =>{
    msgErrorAddProject = false;

    const data = {
        nombre : req.body.projectName,
        fechaInicio : req.body.projectStart
    };
    
    const newProject = new Proyecto(data);    
    
    if(data.nombre == ''){
        msgErrorAddProject = "The field name of project are blank";
    }

    newProject.save()
    .then(([rows,fieldData])=>{
        for(let i=0;i<rows.length;i++){
            if(rows[i].nombre == data.nombre){                
                msgErrorAddProject = "The name introduced has already taken";
                break;
            }
        }
    });
    
    console.log(msgErrorAddProject);
    res.redirect('/');
}


module.exports = control