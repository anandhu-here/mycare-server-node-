const { verifyToken, checkShiftAssign } = require("../controller/util");
const { isAuth, isHome, isAdmin } = require("../middlewares/auth");
const shift = require("../models/shift");

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
    app.post('/shifts/add/bulk', isHome, async(req, res)=>{
        const token = req.headers.authorization;
        const {id} = verifyToken(token);
        const {shifts} = req.body;
        db.Home.findOne({where:{userId:id}}).then(home=>{
            db.Shift.bulkCreate(shifts).then(shifts=>{
                home.addShifts(shifts);
                res.status(201).send(shifts)
            }).catch(e=>{
                res.status(400).send({error:e.message})
            })
        }).catch(e=>{
            res.status(400).send({error:e.message})
        })
    })
    app.get('/shifts/list/carer', isAuth, async(req, res)=>{
        const token = req.headers.authorization;
        const { id } = req.query;
        try{
            const asses = await db.Assigned.findAll({where:{carerId:id}, include:[{
                model:db.Shift,
                as:'shift',
                attributes:['day', 'month', 'year'],
                include:[{
                    model:db.Home,
                    as:'home',
                    attributes:['company', 'adress1', 'postcode']
                }]
            }]});
            res.status(200).send(asses)
        }
        catch(e){
            res.status(400).send({error:e.message})
        }
    })
    app.get('/shifts/list/home', isAuth, async(req, res)=>{
        const token = req.headers.authorization;
        const { month } = req.query;
        const {id} = verifyToken(token)
        try{
            const home = await db.Home.findOne({where:{userId:id}});
            if(home){
                db.Shift.findAll({where:{home_id:home.id, month:month}, include:[{
                    model:db.Assigned,
                    as:'ass',
                    include:[{
                        model:db.Carer,
                        as:'carer'
                    }]
                }]}).then(shifts=>{
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
    app.get('/shifts/list/admin', isAuth, async(req, res)=>{
        const token = req.headers.authorization;
        const { month } = req.query;
        const {id} = verifyToken(token)
        try{
            db.Shift.findAll({where:{month:month}, include:[{
                model:db.Assigned,
                as:'ass',
                include:[{
                    model:db.Carer,
                    as:'carer'
                }]
            }]}).then(shifts=>{
                res.status(200).send(shifts);
            }).catch(e=>{
                console.log(e);
                res.status(400).send({error:e.message})
            })
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
    // app.post('/shifts/assign', isAuth, async(req, res)=>{
    //     const {data} = request.body;
    //     data.map(item=>{

    //     })
    //     try{
    //         data.map()
    //     }
    //     catch(e){
    //         res.status(400).send({error:e.message})
    //     }
    // })
    app.post('/shifts/assign', isAuth, async(req, res) =>{
        const {id, carers} = req.body;
        console.log(id, "fuck")
        try{
            const shift = await db.Shift.findOne({where:{id}})
            const {error, status} = checkShiftAssign(shift, carers);
            if(status === 0){
                carers.map(item=>{
                    db.Assigned.create({
                        type:item.type,
                        covered:false
                    }).then(ass=>{
                        db.Carer.findOne({where:{id:item.id}}).then(carer=>{
                            carer.addAss(ass);
                            shift.addAss(ass);  
                        }).catch(e=>{
                            ass.destroy()
                            res.status(400).send({error:error})
                        })
                    }).catch(e=>{
                        res.status(400).send({error:error})
                    })
                    
                    
                })
                res.status(201).send({message:"Assigned Succesfully"})
            }
            else{
                console.log("mairrrr")
                res.status(400).send({error:error})
            }
        }
        catch(e){
            console.log(e, "endiii")
            res.status(400).send({error:e.message})
        }
    })
    app.get('/shifts/get/home', isAuth, async(req, res) =>{
        try{
            const {id} = req.query;
            const asses = await db.Shift.findAll({where:{home_id:id}});
            res.status(200).send(asses);
        }
        catch(e){
            res.status(400).send({error:e.message})
        }
    })
    app.get('/shifts/get/admin', isAuth, async(req, res) =>{
        try{
            const {id} = req.query;
            const asses = await db.Shift.findAll({where:{home_id:id}});
            res.status(200).send(asses);
        }
        catch(e){
            res.status(400).send({error:e.message})
        }
    })
    app.get('/shifts/get/assigned/admin', isAuth, async(req, res) =>{
        try{
            const {id} = req.query;
            const asses = await db.Assigned.findAll();
            res.status(200).send(asses);
        }
        catch(e){
            res.status(400).send({error:e.message})
        }
    })
    app.post('/shifts/update', isAuth, async(req, res) =>{
        const { id, longday, night, late, early } = req.body;
        db.Shift.findOne({where:{id:id}}).then(shift=>{
            shift.update({
                longday:longday,
                night:night,
                late:late,
                early:early
            })
            res.status(201).send(shift);
        }).catch(e=>{
            res.status(400).send({error:e.message})
        })
    })
    app.post('/shifts/assign/cancel', isAuth, async(req, res)=>{
        try{
            const {id} = req.body;

            const ass = await db.Assigned.findOne({where:{id}});
            ass.destroy()
            res.status(200).send({message:"Success"})
        }
        catch(e){
            res.status(400).send({error:e.message})
        }
    } )
    app.post('/shifts/cancel', isAuth, async(req, res)=>{
        try{
            const {id} = req.body;

            const ass = await db.Shift.findOne({where:{id}});
            ass.destroy()
            res.status(200).send({message:"Success"})
        }
        catch(e){
            res.status(400).send({error:e.message})
        }
    } )
    app.post('/shifts/timesheet/create', isAuth, async(req, res)=>{
        try{
            const {shiftId, carerId, authPos, authName, sign, type} = req.body;
            const auth = await db.Auth
        }
        catch(e){
            res.status(400).send({error:e.message})
        }
    } )
}