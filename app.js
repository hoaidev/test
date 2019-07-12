// We’ll declare all our dependencies here
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./routes/api');
var https = require('https');
var fs = require('fs');
//Initialize our app variable
const app = express();

//Declaring Port
const port = 5555;

const pathServe = path.join(__dirname, 'public');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Must change IP to server
const mongodb = 'mongodb://13.250.99.70:27017/manu';
mongoose.connect(mongodb, { user: 'user1', pass: 'Minori#2018', useNewUrlParser: true })
    .then(() => console.log('connection succesful'))
    .catch((err) => console.error(err));

// const mongodb = 'mongodb://localhost:27017/manu';
// mongoose.connect(mongodb, { useMongoClient: true, promiseLibrary: require('bluebird') })
//     .then(() => console.log('connection succesful'))
//     .catch((err) => console.error(err))

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.set('views', pathServe);

app.use(cors());

//Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files
*/
app.use(express.static(pathServe));

// API location
app.use('/api', api);

// app.use('/test', router);
app.get('/', (req, res) => {
    res.send("Invalid page");
})

//Listen to port 5555
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app).listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});