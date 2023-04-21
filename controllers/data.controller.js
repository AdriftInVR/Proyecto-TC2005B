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
};