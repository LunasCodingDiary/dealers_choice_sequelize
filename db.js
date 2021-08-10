//Setup: require: pg, sequelize ; Deconstruction ; conn = new Sequelize
const Sequelize = require('sequelize');
const pg = require('pg');
const {UUID, UUIDV4, STRING, DATE } = Sequelize.DataTypes;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_sequelize')

//models 
const Film = conn.define('film',{
 id:{

 },
 
 name:{

 },

 categoryId:{

 }
})


const Category = conn.define('category',{
    id:{

    },
    name:{

    }
})


const User = conn.define('user',{
    id:{

    },
    name:{

    },
    favCategory:{

    }
})

const Streaming = conn.define('streaming',{




})




//sync and seed
const syncAndSeed=async()=>{
    await conn.sync({force:true})
    await Promise.all()


}


//exports 
module.exports = {
    syncAndSeed, 
    models:{
     Film,
     Category,
     User,
     Streaming   
    }
};


