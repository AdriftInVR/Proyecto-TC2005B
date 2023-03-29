const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const multer = require('multer');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', 'views');

//fileStorage: Es nuestra constante de configuración para manejar el almacenamiento
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'public/files');
    },
        filename: (request, file, callback) => {
            //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
            //para que no haysa problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
            callback(null, new Date().toISOString() + '-' + file.originalname);
        },
});
    
//En el registro, pasamos la constante de configuración y
//usamos single porque es un sólo archivo el que vamos a subir, 
//pero hay diferentes opciones si se quieren subir varios archivos. 
//'archivo' es el nombre del input tipo file de la forma
app.use(multer({ storage: fileStorage }).single('imagen')); 
    

//Middleware
const gaiaRoutes = require('./routes/gaia.routes');
app.use('/gaia', gaiaRoutes);

console.log('Is running...')
app.listen(3000);