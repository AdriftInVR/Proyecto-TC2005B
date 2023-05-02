const fs = require('fs');
//Base de datos
const Ticket = require('../models/tickets.model');
const Estatus = require('../models/status.model');
const Fase = require('../models/fase.model');
const Proyecto = require('../models/proyects.model');
const Epic = require('../models/epic.model');
const User = require('../models/user.model');
const Tarea = require('../models/tarea.model');
const db = require('../util/database');

exports.getStatus = (req, res) => {
    Proyecto.fetchStatus(req.params.idProject)
        .then(([rows, fieldData]) => {
            res.status(200).json({status: rows})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        });
};

exports.getStatusEpic = (req, res) => {
    Epic.fetchStatus(req.params.idEpic)
        .then(([rows, fieldData]) => {
            res.status(200).json({status: rows})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        });
};

exports.getProjectEpics = (req, res) => {
    Proyecto.fetchEpics(req.params.idProject)
        .then(([rows, fieldData]) => {
            res.status(200).json({status: rows})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        });
}

exports.getNotTitle = (req, res) => {
    Proyecto.fetchNotTitle(req.params.idProject)
        .then(([rows, fieldData]) => {
            res.status(200).json({project: rows[0]})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        });
};

exports.getEstimate = (req, res) => {
    Proyecto.fetchEstimate(req.params.idProject)
        .then(([rows, fieldData]) => {
            res.status(200).json({status: rows})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        });
};


exports.getCompletedAP = (req, res) => {
    Proyecto.fetchCompletedAP(req.params.idProject, req.params.start, req.params.end)
        .then(([rows, fieldData]) => {
            res.status(200).json({status: rows})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        });
};


exports.getCompletedAPEpic = (req, res) => {
    Epic.fetchCompletedAP(req.params.idEpic, req.params.start, req.params.end)
        .then(([rows, fieldData]) => {
            res.status(200).json({status: rows})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
    });
}

exports.getProjectCompleteAP = (req, res) => {
    Proyecto.fetchAPproject(req.params.idProject, req.params.end)
        .then(([rows, fieldData]) => {
            res.status(200).json({status:rows})  
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
        });
};

//Puntos agiles por tarea y epic
exports.getAPproyect = async (req, res) => {
    await Proyecto.fetchAPproject(req.params.idProject)
        .then(([rows, fieldData]) => {
            console.log(rows)
            res.status(200).json({status: rows})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
    });
}

exports.getAPepic = (req, res) => {
    Epic.fetchAPepic(req.params.idEpic, req.params.end)
        .then(([rows, fieldData]) => {
            res.status(200).json({status: rows})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal Server Error"});
    });
}
/*-----------------------------------------------------------------------------------------*/
exports.getArea = async (req, res) => {
    let area = {
        allFront: 0,
        completeFront: 0,
        allBack: 0,
        completeBack: 0
    };
    await Proyecto.fetchAllPrj(req.params.idProyecto)
    .then(([rows, fieldData]) => {        
        if(rows.length == 1){
            if(rows[0].front_back == 0){
                area.allFront = rows[0].Completed;
                area.allBack = 0;
            }else if(rows[0].front_back == 1){
                area.allFront = 0;
                area.allBack = rows[0].Completed;
            }
        }else if(rows.length == 2){                      
            if(rows[0].front_back == 0){                
                area.allFront = rows[0].Completed;                
                area.allBack = rows[1].Completed;
            }else if(rows[0].front_back == 1){                
                area.allFront = rows[1].Completed;
                area.allBack = rows[0].Completed;
            }
        }
    })
    .catch(err => {console.log(err)});

    await Proyecto.fetchCompletePrj(req.params.idProyecto)
    .then(([rows, fieldData]) => {        
        if(rows.length == 1){
            if(rows[0].front_back == 0){
                area.completeFront = rows[0].Complete;
                area.completeBack = 0;
            }else if(rows[0].front_back == 1){
                area.completeFront = 0;
                area.completeBack = rows[0].Complete;
            }
        }else if(rows.length == 2){            
            if(rows[0].front_back == 0){
                area.completeFront = rows[0].Complete;
                area.completeBack = rows[1].Complete;
            }else if(rows[0].front_back == 1){
                area.completeFront = rows[1].Complete;
                area.completeBack = rows[0].Complete;
            }
        }
    })
    .catch(err => {console.log(err)});
    
    res.status(200).json(area)
};

exports.getAreaEpic = async (req, res) => {
    let area = {
        allFront: 0,
        completeFront: 0,
        allBack: 0,
        completeBack: 0
    };
        
    await Proyecto.fetchAllEpi(req.params.idEpic)
    .then(([rows, fieldData]) => {               
        if(rows.length == 1){
            if(rows[0].front_back == 0){
                area.allFront = rows[0].Completed;
                area.allBack = 0;
            }else if(rows[0].front_back == 1){
                area.allFront = 0;
                area.allBack = rows[0].Completed;
            }
        }else if(rows.length == 2){            
            if(rows[0].front_back == 0){                
                area.allFront = rows[0].Completed;
                area.allBack = rows[1].Completed;
            }else if(rows[0].front_back == 1){
                area.allFront = rows[1].Completed;
                area.allBack = rows[0].Completed;
            }
        }
    })
    .catch(err => {console.log(err)});

    
    await Proyecto.fetchCompleteEpi(req.params.idEpic)
    .then(([rows, fieldData]) => {
        if(rows.length == 1){
            if(rows[0].front_back == 0){
                area.completeFront = rows[0].Complete;
                area.completeBack = 0;
            }else if(rows[0].front_back == 1){
                area.completeFront = 0;
                area.completeBack = rows[0].Complete;
            }
        }else if(rows.length == 2){            
            if(rows[0].front_back == 0){
                area.completeFront = rows[0].Complete;
                area.completeBack = rows[1].Complete;
            }else if(rows[0].front_back == 1){
                area.completeFront = rows[1].Complete;
                area.completeBack = rows[0].Complete;
            }
        }
    })
    .catch(err => {console.log(err)});
    
    res.status(200).json(area);
};

exports.burnUpLine = async (req, res) =>{
    let data={
        stimate : 0,
        aptotales : 0,
        real : []
    }
    await Proyecto.fetchEstimate(req.params.idProject)
    .then(([rows, fieldData]) => {
        data.stimate = rows;
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    });

    let startPrjDate = '';
    await Proyecto.fetchOne(req.params.idProject)
    .then(([rows, fieldData])=>{
        startPrjDate = rows[0].fechainicio;
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    })
    
    await Proyecto.fetchGreenLine(req.params.idProject)
    .then(([rows, fieldData])=>{
        let maxDate = rows[0].fechaCambio;
        let daysClose = (maxDate - startPrjDate)/86400000;

        
        res.status(500).json(data);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    })
}


exports.burnUpLinesEpic= async (req, res) =>{
    let data={
        stimate: 0,
        aptotales: 0
    }
    await Proyecto.fetchEstimate(req.params.idProject)
    .then(([rows, fieldData]) => {
        data.stimate = rows;
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    });

    await Epic.fetchAPproject(req.params.idEpic)
    .then(([rows,fieldData])=>{
        data.aptotales = rows[0].APTotalesE;
        res.status(500).json(data);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    })   
}
