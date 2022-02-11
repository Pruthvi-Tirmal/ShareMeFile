const express = require('express');
// favicon
const favicon = require('serve-favicon')
// Path module
const path = require('path');
const connectDb = require('../config/db');
connectDb(); // db
const cors = require('cors')
// cors
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}
const app = express();
// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('./public'))
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

// Template Engine
app.set('view engine', 'hbs');

// Routes
app.use('/api/files', require('../routes/files'));
app.use('/files', require('../routes/show.js'));
app.use('/files/download', require('../routes/download.js'));

//Node - Scheduler
const { job } = require('../scheduler.js');


// listen
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
})