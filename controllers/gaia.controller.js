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

control.getEpics = (req, res) => {
    res.render('project_epics', {
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