const { verifyToken } = require("../controller/util");
const { isAuth, isHome } = require("../middlewares/auth");

module.exports = (app, db) =>{
    app.post('/shifts/add', isAuth, async(req, res)=>{
        const { day, month, year, longday, night, late, early } = req.body;
        const token = req.headers.authorization;
        const {id} = verifyToken(token);
        try{
            db.Home.findOne({where:{userId:id}}).then(home=>{
                db.Shift.findOne({where:{day, month, year}}).then(shift=>{
                    if(shift){
                        res.status(400).send({message:"Shift is already added"})
                    }
                    else{
                        db.Shift.create({day, month,year, longday, night, late, early}).then(shift=>{
                            home.addShift(shift);
                            res.status(200).send(shift)
                        }).catch(e=>{
                            res.status(404).send({message:"No shift found"})
                        })
                    }
                }).catch((e)=>{

                    res.status(400).send({error:e.message})
                })
            }).catch(e=>{
                res.send({error:e.message})
            })
        }
        catch(e){
            res.status(400).send({error:e.message})
        }
        
    })
    app.get('/shifts/list/home', isAuth, async(req, res)=>{
        const token = req.headers.authorization;
        const {id} = verifyToken(token)
        try{
            const home = await db.Home.findOne({where:{userId:id}});
            if(home){
                db.Shift.findAll({where:{home_id:home.id}}).then(shifts=>{
                    res.status(200).send(shifts);
                }).catch(e=>{
                    console.log(e);
                    res.status(400).send({error:e.message})
                })
            }
            else{
                res.status(400).send({error:"Not authorized"})
            }
        }
        catch(e){
            res.status(400).send({error:e.message})
        }
        
    })
    app.post(`/shifts/delete`, isHome, async (req, res)=>{
        const {id} = req.body;
        console.log(id, "id")
        try{
            const shift = await db.Shift.findOne({where:{id}});
            if(shift){
                shift.destroy()
                res.status(200).send({message:"Deleted"})
            }
            else{
                res.status(404).send({message:"No shift found"})
            }
        }
        catch(e){
            console.log(e, "ee")
            res.status(400).send({error:e.message})
        }
    })
}