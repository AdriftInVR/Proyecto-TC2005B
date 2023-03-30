const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const multer = require('multer');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
require('dotenv').config();


const app = express();


const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT,
    issuerBaseURL: process.env.AUTH0_DOMAIN
  };
  
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.redirect('/gaia/');
    } else {
        res.redirect('/gaia/login');    
    }
    //res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});



app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));

const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null,'public/files');
    },
        filename: (request, file, callback) => {
            callback(null,"data.csv");
        },
});
app.use(multer({ storage: fileStorage }).single('import')); 

app.set('view engine', 'ejs');
app.set('views', 'views');

//Middleware
const gaiaRoutes = require('./routes/gaia.routes');
const { response } = require('express');
app.use('/gaia', gaiaRoutes);

console.log('Is running...')
app.listen(3000);