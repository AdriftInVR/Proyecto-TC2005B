const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const multer = require('multer');

const app = express();

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
app.use('/gaia', gaiaRoutes);

console.log('Is running...')
app.listen(3000);