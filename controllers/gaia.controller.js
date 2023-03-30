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
    filePath = './public/files/data.csv';
    const fileText = fs.readFileSync(filePath).toString();
    const allLines = fileText.split('\n');
    const header = allLines[0];
    
    const dataLines = allLines.slice(1);
    const fieldNames = header.split(',');

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

    
};

control.postImport = (request, response, next) => {
    response.render('import',{active: 'import',result:'succes' || 'err'});
}

module.exports = control