//Setup: require: pg, sequelize ; Deconstruction ; conn = new Sequelize
const Sequelize = require('sequelize');
const pg = require('pg');
const {UUID, UUIDV4, STRING, DATE } = Sequelize.DataTypes;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_sequelize')

//models 
const Film = conn.define('film',{
 id:{
   primaryKey: true,
   type: UUID,
   defaultValue: UUIDV4,
 },
 
 filmName:{
    type: STRING, 
    unique: true,
    allowNull: false
 },

 // foreign key: categoryId
})


const Category = conn.define('category',{
    id:{
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,

    },
    categoryName:{
     type: STRING, 
     unique: true,
     allowNull: true
    }
})


const User = conn.define('user',{
    id:{
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,

    },
    firstName:{
      type: STRING, 
      allowNull: false

    },
   // a question: how to generate favCategory by counting everything the person streamed?
})

const Streaming = conn.define('streaming',{
    id: {
        primaryKey: true,
        type: UUID,
        defaultValue: UUIDV4
      },
    time: {
        type: DATE, 
        allowNull: true,
        defaultValue: ()=> new Date()
        },
    watchedById: {
        type: UUID,
        allowNull: true
      },
    filmId: {
        type: UUID,
        allowNull: false
    }
})

//associations
Category.hasMany(Film,{as:'category', foreignKey:'categoryId'}); //foreign key always in hasMany
Film.belongsTo(Category)

Streaming.belongsTo(User, {as:'streamedBy'});
User.hasMany(Streaming,{foreignKey:'watchById'}); //so, if you write "hasMany", you can use "include[]"" in server, right?
Streaming.belongsTo(Film);
Film.hasMany(Streaming,{foreignKey:'filmId'});

//datapoint
const users = ['Monica', 'Sonia', 'Sophia', 'Walter', 'Daniel', 'Indigo', 'Luna', 'James', 'Jason', 'Andrea']
;
const films = ['Kingdom', 'Florida Project', 'Annette', 'Avatar', 'The Favourite', 'Lady Bird', 'Roma', 'Titanic', 'Ex Machina', 'The Master', 'Her', 'Chungking Express', 'Spirited Away', 'Only Yesterday', 'Waking Life','American Factory'];
const categories= ['Horror', 'Sci-fi', 'Drama', 'Comedy', 'History', 'Asian', 'Independent', 'Documentary'];


//sync and seed
const syncAndSeed = async() =>{
    await conn.sync({force:true})
    const [Monica, Sonia, Sophia, Walter, Daniel, Indigo, Luna, James, Jason, Andrea] = await Promise.all(users.map (firstName=> User.create({firstName})))
    const [Horror, Scifi, Drama, Comedy, History, Asian, Independent, Documentary]= await Promise.all(categories.map (categoryName=> Category.create({categoryName})))
    //Film & set its category
    const [Kingdom, FloridaProject, Annette, Avatar, TheFavourite, LadyBird, Roma, Titanic, ExMachina, TheMaster, Her, ChungkingExpress, SpiritedAway, OnlyYesterday, WakingLife, AmericanFactory] = await Promise.all(films.map (filmName=> Category.create({filmName}))); //is this necessary?
    
    Kingdom.categoryId = Horror.id;  //question#1: is it okay that these variables are all capitalized?
    Avatar.categoryId = Scifi.id;    //question#2: how can I add two categories to one film?? like a tag?
    TheFavourite.categoryId = Drama.id;
    FloridaProject.categoryId = Drama.id;
    Annette.categoryId = Scifi.id;
    LadyBird.categoryId = Independent.id;
    Roma.categoryId = History.id;
    Titanic.categoryId = History.id;
    ExMachina.categoryId = Scifi.id;
    TheMaster.categoryId = History.id;
    Her.categoryId = Scifi.id;
    ChungkingExpress.categoryId = Comedy.id;
    SpiritedAway.categoryId = Asian.id;
    OnlyYesterday.categoryId = Asian.id;
    WakingLife.categoryId = Scifi.id;
    AmericanFactory.categoryId = Documentary.id;

    await Promise.all([Kingdom.save(), Avatar.save(), TheFavourite.save(),FloridaProject.save(), Annette.save(), LadyBird.save(), Roma.save(), Titanic.save(), ExMachina.save(), TheMaster.save(), Her.save(), ChungkingExpress.save(), SpiritedAway.save(), OnlyYesterday.save(), WakingLife.save(), AmericanFactory.save()]);
    //question#3: is there an easier way to save everything here?  

    //create some Streaminng history
    await Promise.all([
            Streaming.create({
              streamedById: Sophia.id,
              filmId: Kingdom.id
            }),
            Streaming.create({
                streamedById: Sonia.id,
                filmId: Avatar.id
              }),
            Streaming.create({
                streamedById: Indigo.id,
                filmId: LadyBird.id
            }),
            Streaming.create({
                streamedById: Sophia.id,
                filmId: Kingdom.id
            }),
            Streaming.create({
                streamedById:Jason.id,
                filmId: Her.id
              }),
            Streaming.create({
                streamedById: Sophia.id,
                filmId: Annette.id
            }),
            Streaming.create({
                streamedById: Monica.id,
                filmId: ExMachina.id
            }),
            Streaming.create({
                streamedById: Luna.id,
                filmId: ChungkingExpress.id
            }),
            Streaming.create({
                streamedById: Walter.id,
                filmId: SpiritedAway.id
            }),
            Streaming.create({
                streamedById: Andrea.id,
                filmId: ChungkingExpress.id
            }),
            Streaming.create({
                streamedById: James.id,
                filmId: AmericanFactory.id
            }),
            Streaming.create({
                streamedById: Daniel.id,
                filmId: LadyBird.id
            })
            ]);
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


