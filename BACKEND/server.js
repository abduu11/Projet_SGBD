const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT;

const authentificationRoute = require('./routes/authentificationRoute');
app.use('/api/authentification', authentificationRoute);

const chatRoute = require('./routes/chatRoutes');
app.use('/api/chat', chatRoute);

const examensRoute = require('./routes/examensRoutes');
app.use('/api', examensRoute);

const copieRoute = require('./routes/copieRoutes');
app.use('/api', copieRoute);

const correctionRoute = require('./routes/correctionRoutes');
app.use('/api', correctionRoute);

const plagiatRoute = require('./routes/plagiatRoute');
app.use('/api', plagiatRoute);

app.get('/', (req, res)=>{
    res.send("Bienvenu");
} );

app.listen(PORT, () => {
    console.log(`Le serveur ecoute sur le port ${process.env.PORT}`);
});