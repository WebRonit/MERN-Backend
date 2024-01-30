const express = require('express');
const dotenv = require('dotenv');
const app = express();

const PORT = process.env.PORT || 3001;
dotenv.config({path: './config.env'});

require('./db/conn.js'); //
const logSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model(LOGS, logSchema);

app.use(bodyParser)




app.listen(PORT, () => {
    console.log("server is running at port:", PORT)
});
