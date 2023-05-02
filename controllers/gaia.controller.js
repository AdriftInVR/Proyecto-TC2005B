const fs = require('fs');
//Base de datos
const Ticket = require('../models/tickets.model');
const Estatus = require('../models/status.model');
const Fase = require('../models/fase.model');
const Proyecto = require('../models/proyects.model');
const Proyect = require('../models/projects.model');
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
    Proyect.fetchAll()
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
        [datos, filedData] = await Proyect.datos(projectName);        
    
        [epics, filedData] = await Proyect.epics(projectName);        
        
        [namePrj, filedData] = await Proyect.fetchOne(projectName);        
    } catch (err) {
        console.log(err);
    }

    res.render('project', {
        active: 'projects',
        epics: epics,
        projectName: namePrj[0].nombre,
        datos: datos, 
    });
    
};

control.getTasks = async (req, res) => {
    id = req.params.prj;
    let idProyect = 0;
    await Epic.fetchPrjPertenece(id)
    .then(([rows, fieldData])=>{
        idProyect = rows[0].perteneProyecto;
    })
    try {
        [task1, fieldData] = await Tarea.tasktdo(id);        

        [task2, fieldData] = await Tarea.taskinpro(id);    

        [task3, fieldData] = await Tarea.taskcode(id);        

        [task4, fieldData] = await Tarea.taskquality(id);        

        [task5, fieldData] = await Tarea.taskrelease(id);        

        [task6, fieldData] = await Tarea.taskdone(id);        

        [task7, fieldData] = await Tarea.taskclosed(id);
        
        [epics, filedData] = await Proyect.epics(idProyect);

    } catch (err) {
        console.log(err);
    }
    
    for(let i=0;i<task1.length;i++){
        fecha = task1[i].fechaCambio;
        fechaFormateada = formatDate(fecha);
        task1[i].fechaCambio = fechaFormateada;
    }    
    for(let i=0;i<task2.length;i++){
        fecha = task2[i].fechaCambio;
        fechaFormateada = formatDate(fecha);
        task2[i].fechaCambio = fechaFormateada;
    }    
    for(let i=0;i<task3.length;i++){
        fecha = task3[i].fechaCambio;
        fechaFormateada = formatDate(fecha);
        task3[i].fechaCambio = fechaFormateada;
    }    
    for(let i=0;i<task4.length;i++){
        fecha = task4[i].fechaCambio;
        fechaFormateada = formatDate(fecha);
        task4[i].fechaCambio = fechaFormateada;
    }    
    for(let i=0;i<task5.length;i++){
        fecha = task5[i].fechaCambio;
        fechaFormateada = formatDate(fecha);
        task5[i].fechaCambio = fechaFormateada;
    }    
    for(let i=0;i<task6.length;i++){
        fecha = task6[i].fechaCambio;
        fechaFormateada = formatDate(fecha);
        task6[i].fechaCambio = fechaFormateada;
    }    
    for(let i=0;i<task7.length;i++){
        fecha = task7[i].fechaCambio;
        fechaFormateada = formatDate(fecha);
        task7[i].fechaCambio = fechaFormateada;
    }    
    
    Epic.fetchAll()
    .then(([rows, fieldData])=>{        
        res.render('tasks', {
            active: 'projects',
            tasks1: task1,
            tasks2: task2,
            tasks3: task3,
            tasks4: task4,
            tasks5: task5,
            tasks6: task6,
            tasks7: task7,
            epics: epics,
        });
    })
    .catch(err =>console.log(err));
};

function formatDate(dateAnt){
    const diasSemana = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const nombreDia = diasSemana[dateAnt.getDay()];

    const dia = fecha.getDate();
    const mes = fecha.toLocaleString("default", { month: "long" });
    const anio = fecha.getFullYear();

    const fechaFormateada = `${nombreDia}, ${mes} ${dia} - ${anio}`; 
    return fechaFormateada;
}

control.getUsers = async (req, res) => {

    let usuarios_proyectos = [];
    let usuarios_front_back = [];
    
    [usuarios,filedData] = await User.fetchAll();

    for (let usuario of usuarios) {
        [proyectos, fieldData] = await User.fetchUserProjects(usuario.nombre);
        usuarios_proyectos[usuario.nombre] = proyectos;

        [front_back, fieldData] = await User.fetchUserTasks(usuario.nombre);
        usuarios_front_back[usuario.nombre] = front_back;
    }
  
    res.render('users', {
        active: 'users',
        usuarios_proyectos: usuarios_proyectos,
        usuarios_front_back: usuarios_front_back,
    });
};

control.getDashboard = (req, res) => {
    Proyecto.fetchAllIDs().then(([projects, filedData]) => {
        res.render('dashboard', {
            active: 'dashboard',
            projects: projects,
        });
    }).catch(err => {console.log(err)});
};

control.getImport = (req, res) => {    
    res.render('import', {
        active: 'import',
        state: req.params.result || false
    });
};

let result = 'na';
control.postImport = (request, response, next) => {
    control.processCsv(request,response);
    response.redirect('/gaia/import/'+result);
};


control.processCsv = async(req,res)=>{
    var monthObject = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11
    };

    //Result --> msg after process
    //isCorrect --> control var to know if file is valid
    result = 'succes';
    isCorrect = false;

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
    console.log('Data from CSV was read');

    //validate file
    if(objList.length > 0 && (Object.keys(objList[0]).length == 14
    || Object.keys(objList[0]).length == 16) ){
        const requiredFields = ['Issuekey',
        'Issueid',
        'Summary',
        'IssueType',
        'CustomfieldStoryPoints',
        'Status',
        'CustomfieldEpicLink',
        'EpicLinkSummary',
        'Updated',
        'Created',
        'Assignee',
        'AssigneeId',
        'Labels',
        'Labels',
        'Labels',
        'Labels'];                
        for (let i = 0; i < requiredFields.length; i++) {            
            if (requiredFields[i] != fieldNames[i]) {
                isCorrect = false;
                break;
            }
            if(i == (requiredFields.length - 1)){
                isCorrect = true;
                console.log('valid CSV');
            }
        }
    }
    
    //Send data to database
    if(isCorrect){        
        //Data to table ticket
        //entriesNew --> rows that are new in bd
        //entriesUpt --> rows that coul be updated
        let entriesNew = [], entriesUpt = [];        
        await Ticket.fetchAll()
        .then(([rows, fieldData])=>{            
            if(rows.length > 0){                
                for(let i=0;i<objList.length;i++){
                    for(let j=0; j<rows.length;j++){                        
                        //add only rows that arent into bd
                        if(objList[i].issueid == rows[j].idTicket){                                                        
                            //check if these rows have same data
                            let sameRow = true;                            
                            if(objList[i].summary != rows[j].nombre)
                                sameRow = false;
                            //if is the same row, that isnt pushed to entries
                            if(sameRow == false){
                                let ticketInsert = {
                                    idTicket: objList[i].issueid,
                                    nombre:  objList[i].summary
                                };                                
                                entriesUpt.push(ticketInsert);                                
                            }
                            break;
                        }else if(j == (rows.length - 1)){                            
                            let ticketInsert = {
                                idTicket: objList[i].issueid,
                                nombre:  objList[i].summary
                            };                            
                            entriesNew.push(ticketInsert);
                        }
                    }
                }
            }else{                           
                for(let i=0;i<objList.length;i++){
                    let ticketInsert = {
                        idTicket: objList[i].issueid,
                        nombre:  objList[i].summary
                    };
                    entriesNew.push(ticketInsert);
                }
            }
        })
        await Ticket.add(entriesNew);
        await Ticket.update(entriesUpt);
        
        //Data to table fase                
        let entries = [];
        entriesNew = [], entriesUpt = [];
        estados = [];

        await Estatus.fetchAll()
        .then(([rows, fieldData]) => {
            //adaptate data
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
                    idEstatus: state,
                    fechaCambio: objList[i].created
                }

                entries.push(rowInsert);
            }            
        }) 
        .catch(err => {
            console.log(err);
            result = 'err'
        });        
        for(let i=0;i<entries.length;i++){
            var components = entries[i].fechaCambio.split(/[/: ]/);

            // obtener los componentes de fecha y hora
            var day = components[0];
            var month = monthObject[components[1]];
            var year = '20'+components[2];
            var hours = components[3];
            var minutes = components[4];

            // crear el objeto Date
            var date = new Date(year, month, day, hours, minutes);
            entries[i].fechaCambio = date;
        }   
        
        await Fase.fetchAll()
        .then(([rows,fieldData])=>{
            //verify data
            if(rows.length > 0){                 
                for(let i=0;i<entries.length;i++){
                    for(let j=0; j<rows.length;j++){                        
                        //add only rows that arent into bd
                        if(entries[i].idTicket == rows[j].idTicket){                                                                    
                            //check if these rows have same data
                            let sameRow = true;                            
                            if(entries[i].idEstatus != rows[j].idEstatus && rows[j].idEstatus != 1 )
                                sameRow = false;
                            //if is the same row, that isnt pushed to entries
                            if(sameRow == false){
                                let ticketInsert = {
                                    idTicket: entries[i].idTicket,
                                    idEstatus:  entries[i].idEstatus,
                                    fechaCambio: entries[i].fechaCambio
                                };                                
                                entriesNew.push(ticketInsert);                                
                            }
                            break;
                        }else if(j == (rows.length - 1)){                            
                            let ticketInsert = {
                                idTicket: entries[i].idTicket,
                                idEstatus:  entries[i].idEstatus,
                                fechaCambio: entries[i].fechaCambio
                            };                          
                            entriesNew.push(ticketInsert);
                        }
                    }
                }
            }else{                                           
                for(let i=0;i<entries.length;i++){
                    let ticketInsert = {
                        idTicket: entries[i].idTicket,
                        idEstatus:  entries[i].idEstatus,
                        fechaCambio: entries[i].fechaCambio
                    };          
                    entriesNew.push(ticketInsert);
                }
            }
        })
        await Fase.add(entriesNew);
        //add created                                                 

        entriesNew = [], entriesUpt = [];        
        await Fase.fetchAllOne()
        .then(([rows,fieldData])=>{
            //verify data
            if(rows.length > 0){                 
                for(let i=0;i<entries.length;i++){
                    for(let j=0; j<rows.length;j++){                        
                        //add only rows that arent into bd
                        if(entries[i].idTicket == rows[j].idTicket){                                                                    
                            let ticketInsert = {
                                idTicket: entries[i].idTicket,
                                idEstatus:  1,
                                fechaCambio: entries[i].fechaCambio
                            };                                
                            entriesUpt.push(ticketInsert);                                                            
                            break;
                        }else if(j == (rows.length - 1)){                            
                            let ticketInsert = {
                                idTicket: entries[i].idTicket,
                                idEstatus:  1,
                                fechaCambio: entries[i].fechaCambio
                            };                          
                            entriesNew.push(ticketInsert);
                        }
                    }
                }
            }else{                                           
                for(let i=0;i<entries.length;i++){
                    let ticketInsert = {
                        idTicket: entries[i].idTicket,
                        idEstatus:  1,
                        fechaCambio: entries[i].fechaCambio
                    };          
                    entriesNew.push(ticketInsert);
                }
            }
        })

        
        await Fase.addOne(entriesNew);            
        await Fase.updateOne(entriesUpt);

        //Data for table EPICS
        entries = [];        
        //Only rows that are different
        for(let i=0; i<dataLines.length; i++){         
            let ticketInsert = {
                idTicket: objList[i].customfieldepiclink,
                nombre:  objList[i].epiclinksummary
            };
            if(entries.length == 0){
                entries.push(ticketInsert);
            }
            for(let j=0; j<entries.length;j++){
                if(entries[j].idTicket == ticketInsert.idTicket){                    
                    break;
                }else if(j==(entries.length - 1)){                    
                    entries.push(ticketInsert);
                }
            }            
        }
        
        entriesNew = [], entriesUpt = [];        
        await Ticket.fetchAll()
        .then(([rows, fieldData])=>{            
            if(rows.length > 0){                
                for(let i=0;i<entries.length;i++){
                    for(let j=0; j<rows.length;j++){                        
                        //add only rows that arent into bd
                        if(entries[i].idTicket == rows[j].idTicket){                            
                            //check if these rows have same data
                            let sameRow = true;                            
                            if(entries[i].nombre != rows[j].nombre)
                                sameRow = false;
                            //if is the same row, that isnt pushed to entries
                            if(sameRow == false){
                                let ticketInsert = {
                                    idTicket: entries[i].idTicket,
                                    nombre:  entries[i].nombre
                                };                                
                                entriesUpt.push(ticketInsert);                                
                            }
                            break;
                        }else if(j == (rows.length - 1)){                            
                            
                            let ticketInsert = {
                                idTicket: entries[i].idTicket,
                                nombre:  entries[i].nombre
                            };                            
                            entriesNew.push(ticketInsert);
                        }
                    }
                }
            }else{                
                for(let i=0;i<entries.length;i++){                    
                    let ticketInsert = {
                        idTicket: entries[i].idTicket,
                        nombre:  entries[i].nombre
                    };
                    entriesNew.push(ticketInsert);
                }
            }
        })        
        await Ticket.add(entriesNew);
        await Ticket.update(entriesUpt);
        await Epic.add(entriesNew);
        
        //Data for Tasks
        entriesNew = [], entriesUpt = [];
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
                front_back:workarea,
                asignation: objList[i].created
            };
            entries.push(ticketInsert);          
        }
        
        for(let i=0;i<entries.length;i++){
            var components = entries[i].asignation.split(/[/: ]/);

            // obtener los componentes de fecha y hora
            var day = components[0];
            var month = monthObject[components[1]];
            var year = '20'+components[2];
            var hours = components[3];
            var minutes = components[4];

            // crear el objeto Date
            var date = new Date(year, month, day, hours, minutes);
            entries[i].asignation = date;
        }               

        await Tarea.fetchAllAll()
        .then(([rows, fieldData])=>{
            if(rows.length > 0){                
                for(let i=0;i<entries.length;i++){
                    for(let j=0; j<rows.length;j++){                        
                        //add only rows that arent into bd
                        if(entries[i].idTicket == rows[j].idTicket){                                                        
                            //check if these rows have same data
                            let sameRow = true;                            
                            if(entries[i].perteneceEpic != rows[j].perteneceEpic){
                                sameRow = false;
                            }
                                
                            if(entries[i].puntosAgiles != rows[j].puntosAgiles){
                                sameRow = false;
                            }
                                
                            if(entries[i].esTipo != rows[j].esTipo){
                                sameRow = false;
                            }
                                
                            if(entries[i].front_back != rows[j].front_back){
                                sameRow = false;
                            }                                                            
                            
                            if(entries[i].asignation != rows[j].asignacionEpiTar){
                                sameRow = false;
                            }                                                            
                            
                            //if is the same row, that isnt pushed to entries
                            if(sameRow == false){                                
                                let ticketInsert = {
                                    idTicket: entries[i].idTicket,
                                    perteneceEpic: entries[i].perteneceEpic,
                                    puntosAgiles:  entries[i].puntosAgiles,
                                    esTipo: entries[i].esTipo,
                                    front_back: entries[i].front_back,
                                    asignation: entries[i].asignation
                                };                                               
                                entriesUpt.push(ticketInsert);                                
                            }
                            break;
                        }else if(j == (rows.length - 1)){                            
                            let ticketInsert = {
                                idTicket: entries[i].idTicket,
                                perteneceEpic: entries[i].perteneceEpic,
                                puntosAgiles:  entries[i].puntosAgiles,
                                esTipo: entries[i].esTipo,
                                front_back: entries[i].front_back,
                                asignation: entries[i].asignation
                            };                              
                            entriesNew.push(ticketInsert);
                        }
                    }
                }
            }else{                           
                for(let i=0;i<objList.length;i++){
                    let ticketInsert = {
                        idTicket: entries[i].idTicket,
                        perteneceEpic: entries[i].perteneceEpic,
                        puntosAgiles:  entries[i].puntosAgiles,
                        esTipo: entries[i].esTipo,
                        front_back: entries[i].front_back,
                        asignation: entries[i].asignation
                    };       
                    entriesNew.push(ticketInsert);
                }
            }
        })
        await Tarea.add(entriesNew);
        await Tarea.update(entriesUpt);

        
        //Data for USERS, laboral_state  and responsable
        entries = [];
        entriesNew = [], entriesUpt = [];

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
        
        await User.fetchAll()
        .then(([rows, fieldData])=>{
            if(rows.length > 0){                
                for(let i=0;i<entries.length;i++){
                    for(let j=0; j<rows.length;j++){                        
                        //add only rows that arent into bd
                        if(entries[i].idUsuario == rows[j].idUsuario){                                                        
                            //check if these rows have same data
                            let sameRow = true;                            
                            if(entries[i].nombre != rows[j].nombre)
                                sameRow = false;
                            //if is the same row, that isnt pushed to entries
                            if(sameRow == false){
                                let ticketInsert = {
                                    idUsuario: entries[i].idUsuario,
                                    idTarea: entries[i].idTarea,
                                    nombre:  entries[i].nombre
                                };                               
                                entriesUpt.push(ticketInsert);                                
                            }
                            break;
                        }else if(j == (rows.length - 1)){                            
                            let ticketInsert = {
                                idUsuario: entries[i].idUsuario,
                                idTarea: entries[i].idTarea,
                                nombre:  entries[i].nombre
                            };                                    
                            entriesNew.push(ticketInsert);
                        }
                    }
                }
            }else{                                         
                for(let i=0;i<entries.length;i++){                    
                    let ticketInsert = {
                        idUsuario: entries[i].idUsuario,
                        idTarea: entries[i].idTarea,
                        nombre:  entries[i].nombre
                    };         
                    entriesNew.push(ticketInsert);
                }
            }
        })
        await User.add(entriesNew);       
                
        entriesNew = [], entriesUpt = [];
        
        await User.fetchAllRespon()
        .then(([rows, fieldData])=>{
            if(rows.length > 0){                
                for(let i=0;i<entries.length;i++){
                    for(let j=0; j<rows.length;j++){                        
                        //add only rows that arent into bd
                        if(entries[i].idTarea == rows[j].idTarea){                                                        
                            //check if these rows have same data
                            let sameRow = true;                            
                            if(entries[i].idUsuario != rows[j].idUsuario)
                                sameRow = false;
                            //if is the same row, that isnt pushed to entries
                            if(sameRow == false){
                                let ticketInsert = {
                                    idUsuario: entries[i].idUsuario,
                                    idTarea: entries[i].idTarea,
                                    nombre:  entries[i].nombre
                                };                
                                entriesUpt.push(ticketInsert);                                
                            }
                            break;
                        }else if(j == (rows.length - 1)){                            
                            let ticketInsert = {
                                idUsuario: entries[i].idUsuario,
                                idTarea: entries[i].idTarea,
                                nombre:  entries[i].nombre
                            };                                   
                            entriesNew.push(ticketInsert);
                        }
                    }
                }
            }else{                                         
                for(let i=0;i<entries.length;i++){                    
                    let ticketInsert = {
                        idUsuario: entries[i].idUsuario,
                        idTarea: entries[i].idTarea,
                        nombre:  entries[i].nombre
                    };
                    entriesNew.push(ticketInsert);
                }
            }
        })
        await User.addRespon(entriesNew);

        console.log('Database are ready');
    }else{
        result = 'err'
    }
    
};

control.postProject = (req, res, next) =>{
    msgErrorAddProject = false;

    const data = {
        nombre : req.body.projectName,
        fechaInicio : req.body.projectStart
    };
    
    const newProject = new Proyect(data);    
    
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
    
    //console.log(msgErrorAddProject);
    res.redirect('/');
}


module.exports = control