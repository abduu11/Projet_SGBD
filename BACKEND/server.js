const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./configs/db');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT;

// Configuration de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentation des API',
            version: '1.0.0',
            description: 'Documentation de mes API',
            contact: {
                name: 'Khadim MBAYE',
            },
            servers: [`http://localhost:${PORT}`],
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const authentificationRoute = require('./routes/authentificationRoute');
app.use('/api/authentification', authentificationRoute);

const chatRoute = require('./routes/chatRoutes');
app.use('/api/chat', chatRoute);

const examensRoute = require('./routes/examensRoutes');
app.use('/api', examensRoute);

app.listen(PORT, () => {
    console.log(`Le serveur ecoute sur le port ${process.env.PORT}`);
});