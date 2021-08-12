//require db, express, and other middlewares(eg. morgan, method override)
const db = require ('./db.js');
const{models:{Film, Category, User, Streaming}} = db //deconstrction
const express = require ('express');
const morgan = require('morgan')

//creat server + adding middlewares 
const app = express()
app.use(require('method-override')('_method'));
app.use(express.urlencoded({extended:false}))
app.use(morgan('dev'))

//app.get(routing)
app.get('/',(req, res, next)=> res.redirect('/api/films'))

app.get('/api/films', async(req, res, next)=>{
    try{
        res.send(await Film.findAll({
            include:[Streaming]
        }));
    } catch(error){
        next(error)
    }
})

app.get('/api/users', async(req, res, next)=>{
    try{
        res.send(await User.findAll({
            include:[Streaming]
        }));
    } catch(error){
        next(error)
    }
})

app.get('/categories', async(req, res, next)=>{
    try{
        res.send(await Category.findAll({
            include:[Film]
        }));
    } catch(error){
        next(error)
    }
})

app.get('/streaming', async(req, res, next)=>{
    try{ 
        res.send(await Streaming.findAll({
        include:[Film,
        {model: User, as:'streamedBy'}]
    }));
    } catch(error){
        next(error)
    }
})

//init : syncAndSeed + setup the Port 
const setUp = async() => {
    try{
    await db.syncAndSeed();
    const port = process.env.PORT || 3010 ; 
    app.listen(port,()=>console.log('app is listening to Port 3010'));
    }catch(error){
        console.log(error)
    }
};
//question: what's the difference between setUp and init? Why do we use try-ctach here as well?

setUp()
