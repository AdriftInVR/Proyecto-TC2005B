control = []

control.getLogin = (req, res) => {
    res.render('login')
};

control.getProjects = (req, res) => {
    res.render('home')
};

control.getProject = (req, res) => {
    res.render('project')
};

control.getTasks = (req, res) => {
    res.render('tasks')
};

control.getUsers = (req, res) => {
    res.render('users')
};

control.getDashboard = (req, res) => {
    res.render('dashboard')
};

control.getImport = (req, res) => {
    res.render('import')
};

module.exports = control