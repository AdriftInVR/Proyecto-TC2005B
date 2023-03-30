const fs = require('fs');
control = []

control.getLogin = (req, res) => {
    res.render('login')
};

control.getProjects = (req, res) => {
    res.render('home', {
        active: 'projects'
    })
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
    filePath = '/files/data.csv';
    const fileText = fs.readFileSync(filePath).toString();
    console.log(fileText);
};

module.exports = control