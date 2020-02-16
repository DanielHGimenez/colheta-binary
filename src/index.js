require('./config');
const express = require("express");

const app = express();



app.listen(process.env.SERVER_PORT, () => {
        console.info(`SERVER LISTENING ON PORT ${process.env.SERVER_PORT}. WITH NODE_ENV=${process.env.NODE_ENV}`);
})