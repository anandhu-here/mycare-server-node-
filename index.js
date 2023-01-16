const express = require('express');
const router = require('./routes/index');
const db = require('./models/index');
const bodyParser = require('body-parser')


db.sequelize.sync().then(()=>{
    console.log('DB synced')
})


const app = express()

app.use(bodyParser.json());

router(app, db)


app.listen(3000, (req, res)=>{
    console.log('App running')
})



