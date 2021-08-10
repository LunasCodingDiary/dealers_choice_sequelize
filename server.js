//require db, express, and other middlewares(eg. morgan, method override)
const db = require ('./db.js');
const express = require ('express');
const morgan = require('morgan')

//creat server + adding middlewares 
const app = express()
app.use(require('method-override')('_method'));
app.use(express.urlencoded({extended:false}))
app.use(morgan)

//app.get(routing)
app.get('/', async(req, res, next){
    try{
        
    } catch(error){
        next(error)
    }
})

app.get('/', async(req, res, next){
    try{

    } catch(error){
        next(error)
    }
})

app.get('/', async(req, res, next){
    try{

    } catch(error){
        next(error)
    }
})

app.get('/', async(req, res, next){
    try{

    } catch(error){
        next(error)
    }
})

app.get('/', async(req, res, next){
    try{

    } catch(error){
        next(error)
    }
})

//init : syncAndSeed + setup the Port 
const init = async() => {
    await db.syncAndSeed();

    const port = process.env.PORT || 0810 ; 
    app.listen(port,()=>console.log('app is listening to Port 0810'));
}

init()