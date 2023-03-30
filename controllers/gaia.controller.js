const Proyecto = require('../models/proyects.model');

control = []


control.getLogin = (req, res) => {
    res.render('login')
};

control.getProjects = (req, res) => {
    
    Proyecto.fetchAll()
    .then(([rows, filedData]) => {

        res.render('home', {
            active: 'projects',
            proyectos: rows,
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
}



module.exports = control