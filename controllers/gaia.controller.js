//Base de datos
const Ticket = require('../models/tickets.model');

control = []

control.getLogin = (req, res) => {
    res.render('login')
};

control.getProjects = (req, res) => {
    Ticket.fetchAll()
    .then(([rows, fieldData]) => {
        console.log(rows);
        
        res.render('home', { active: 'projects',
            nombre: rows,
            //ultimo_ticket: req.session.ultimo_ticket || '', 
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
        active: 'import'
    })
};






module.exports = control