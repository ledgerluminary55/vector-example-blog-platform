require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('../config/corsOptions');
const {setupOttoman} = require('../config/dbConnect');
const  {Logger} = require('../config/logger');
const log = Logger.child({
    namespace: 'Index',
});

const main = async () => {

await setupOttoman();

app.use(cors(corsOptions));
app.use(express.json()); // middleware to parse json
app.use(cookieParser());

// static route
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', require('../routes/root'));

// user routes - for testing
app.use('/test', require('../routes/testRoutes'));

// user routes - for /api/users and /api/user
app.use('/api', require('../routes/userRoutes'));

// user routes - for profiles
app.use('/api/profiles', require('../routes/profileRoutes'));

// article routes
app.use('/api/articles', require('../routes/articleRoutes'));

// tag route
app.use('/api/tags', require('../routes/tagRoutes'));

// comment routes
app.use('/api/articles', require('../routes/commentRoutes'));

app.listen(PORT, () => {
    log.info(`Server running on port ${PORT}`);
});
};

main();
module.exports = app;
