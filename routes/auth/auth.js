const { hashPassword, createToken, comparePassord, verifyToken } = require("../../controller/util");
const { login, signup, isAdmin } = require("../../middlewares/auth");


module.exports = (app, db) => {

    app.get('/', (req, res)=>{
        res.status(200).send({message:'hello'})
    })
    app.post('/signup', signup, async (req, res)=>{
        const { email, password, role } = req.body;
        
        const hash = hashPassword(password);
        db.User.create({email, password:hash,role }).then(user=>{
            const token = createToken(user);
            const {role} = user;
            if(role === "CARER"){
                db.Carer.create().then(carer=>{
                    user.setCarer(carer);
                    res.status(201).send({
                        token,
                        user:{
                            user,
                            profile:carer
                        }
                    })
                }).catch(e=>{
                    res.status(400).send({error:e.message})
                })
            }
            else if(role === "HOME"){
                db.Home.create().then(home=>{
                    user.setHome(home);
                    res.status(201).send({
                        token,
                        user:{
                            user,
                            profile:home
                        }
                    })
                }).catch(e=>{
                    res.status(400).send({error:e.message})
                })
            }
            
        }).catch(e=>{
            res.status(400).send({error:e.message})
        })
    })
    app.post('/login', login, (req, res)=>{
        const { email, password } = req.body;
        db.User.findOne({where:{email}, include:[{
            model:db.Carer,
            as:'carer'
        }]}).then(user=>{
            if(user && comparePassord(password, user.password) ){
                const token = createToken(user);
                res.status(200).send({
                    token,
                    user
                })
            }
            else{
                res.status(404).send({error:"User not found"})
            }
        }).catch(e=>{
            res.status(400).send({error:'Login error try again'})
        })
        
    })
    app.get('/get/carers', isAdmin, async(req, res)=>{
        try{
            const carers = await db.Carer.findAll();
            res.status(200).send(carers);
        }
        catch(e){
            res.status(500).send({error:e.message})
        }
    })
    app.post('/delete', async (req, res)=>{
        const {email} = req.body;
        // db.Carer.findOne({where:{id:1}}).then(u=>u.destroy()).catch(e=>console.log(e))
        
        try{
            const user = await db.User.findOne({where:{email}});
            if(user){
                user.destroy();
                res.status(200).send({message:"User deleted"})
            }
            res.status(400).send({error:"User not found"})
        }
        catch(e){
            res.status(400).send({error:e.message})
        }
        
    })
    app.get('/user', (req, res)=>{
        const { email } = req.query;
        // db.User.findOne({where:{email}}).then(user)
        db.User.findOne( { where:{ email }} ).then(user=>{
            if(!user){
                res.status(404).json({error:'User not Found'})
            }
            else{
                if(user.role === "HOME"){
                    db.User.findOne( { where:{ email }, include:[{
                        model:db.Home,
                        as:'home'
                    }]} ).then(user=>{
                        res.status(200).send({user})
                    }).catch(e=>{
                        res.status(400).send({error:e.message})
                    })
                }
                else if(user.role === "CARER"){
                    db.User.findOne( { where:{ email }, include:[{
                        model:db.Carer,
                        as:'carer'
                    }]} ).then(user=>{
                        res.status(200).send({usr})
                    }).catch(e=>{
                        res.status(400).send({error:e.message})
                    })
                }
            }
            
        }).catch(e=>{
            res.status(400).send({error:e.message})
        })
    })

    app.post('/update/profile', async (req, res)=>{
        try{
            const { firstName, lastName, phone, postcode, adress1, city, dob, company } = req.body;
            const token = req.headers.authorization
            try{
                const {id, email, role} = verifyToken(token);
                if(role === "HOME"){
                    console.log(email, "email")
                    db.Home.findOne({where:{userId:id}}).then(home=>{
                        home.update({
                            ...req.body
                        })
                        res.status(201).send({message:"Updated"})
                    }).catch(e=>{
                        res.status(400).send({error:e.messsage})
                    })   
                }
                else if(role === "CARER"){
                    db.Carer.findOne({where:{userId:id}}).then(carer=>{
                        carer.update({
                            ...req.body
                        })
                        res.status(201).send({message:"Updated"})
                    }).catch(e=>{
                        res.status(400).send({error:e.messsage})
                    })   
                }
            }
            catch(e){
                res.status(400).send({error:'Invalid Token'})
            }
            
        }
        catch(e){
            res.status(400).send({error:e.messsage})
        }
    })
}