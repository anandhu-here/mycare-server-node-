const { verify } = require('jsonwebtoken');
const { verifyToken } = require('../controller/util');
const db = require('../models/index');

const login = (req, res, next) =>{
    const { email, password } = req.body;
    if(!email){
        return res.status(400).send({error:'email not valid'})
    }
    if(!password){
        return res.status(400).send({error:'password not valid'})
    }
    next()
}

const signup = async ( req, res, next ) =>{
    const { email, password, role } = req.body;
    const user = await db.User.findOne({ where: {email} });
    if(user){
        return res.status(400).send({error:'User already exists!'})
    }

    if(!email){
        return res.status(400).send({error:'email not valid'})
    }
    if(!password){
        return res.status(400).send({error:'password not valid'})
    }
    next()
}

const isAuth = async (req, res, next) =>{
    try{
        const {id, email} = verifyToken(req.headers.authorization);
        next();
    }
    catch(e){
        return res.status(400).send({error:'Unauthorized'})
    }
}
const isHome = async (req, res, next) =>{
    try{
        const {id, email, role} = verifyToken(req.headers.authorization);
        console.log(role, "fuck")
        if(role === 'HOME'){
            next();
        }
        else{
            return res.status(400).send({error:'Unauthorized'})
        }
    }
    catch(e){
        return res.status(400).send({error:'Unauthorized'})
    }
}

module.exports = { login, signup, isAuth, isHome }