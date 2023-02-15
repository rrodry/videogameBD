require('dotenv').config();
const { Router } = require('express')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const  axios  = require('axios')
const { APIKEY } = process.env
const { Videogame , Gender} = require('../db');
console.log("API KEY ESSSSSS"+APIKEY);

const router = Router();
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;

const infoApi = async () =>{
    const info = []
    try {
        for (let i = 1; i <= 5; i++) {
            const dataApi = await axios.get(`https://api.rawg.io/api/games?key=${APIKEY}&page=${i}`)
            dataApi.data.results.map(e => {
                info.push({
                    name: e.name,
                    id: e.id,
                    image: e.background_image,
                    genders: e.genres.map(el => el.name),
                    rating: e.rating,
                    api: true
                }
                )
            })
        }
        return info
    } catch (error) {
        console.log(error.message);
    }
}
const infoDb = async () => {
    const videogameDB= await Videogame.findAll({
        include:{
            model: Gender,
        }
    })
    const vgTOJSON = videogameDB.map(v => v.toJSON())
    let array = []
    for (let i = 0; i < vgTOJSON.length; i++) {
        array.push({name: vgTOJSON[i].name,
        id: vgTOJSON[i].id,
        description: vgTOJSON[i].description,
        launchDate: vgTOJSON[i].launchDate,
        rating: vgTOJSON[i].rating,
        src:vgTOJSON[i].src,
        genders:vgTOJSON[i].genders.map(g=> g.gender)})
    
    }
    return array

}

const videosGames = async () => {
    const dataDb = await infoDb()
    const dataApi = await infoApi()
    const all = dataDb.concat(dataApi)
    return all
}
router.get('/videogames', async (req,res) => {
    const  { name }  = req.query
    const allGames = await videosGames()
    const gameFilter = await allGames.filter( e => e.name.toLowerCase().includes(name) && e.name ) 
    
    name ?
        allGames ?
            res.status(200).send(gameFilter)
            :
            res.status(404).send("Game not found, :(")
        :
        res.status(200).send(allGames)
})

router.get('/videogame/:idVideogame', async ( req, res ) => {
    const { idVideogame } = req.params
    const dataApi = await axios(`https://api.rawg.io/api/games/${idVideogame}?key=${APIKEY}`).catch( function(error){ return false} )
    if (dataApi){
        console.log(dataApi);   
        let dataShowDet 
            dataShowDet = {
                description: dataApi.data.description_raw,
                name: dataApi.data.name,
                gender: dataApi.data.genres.map( e => e.name),
                src: dataApi.data.background_image,
                launchDate: dataApi.data.released,
                rating: dataApi.data.rating,
            }
    
            res.status(200).send(dataShowDet)
    }else{
        try {
            const gamesDb = await Videogame.findAll({
                where:{
                    id:idVideogame
                },
                include:{
                    model: Gender,
                }
            })
            res.status(200).send(gamesDb[0])
        } catch (error) {
            res.status(404).send("Game Not Found")
        }

    }
    })
router.get('/genres', async ( req, res) => {
    const dataApi = (await axios.get(`https://api.rawg.io/api/genres?key=${APIKEY}`)).data
    dataApi.results.map(async g => await Gender.findOrCreate(
        {where:{
            gender:g.name
        }
    }))
    const generosBD = await Gender.findAll(
        {attributes:[["gender","gender"],["id","id"]]}
    )
    const genres = generosBD.map(g=>
       g.dataValues
    )
    console.log(genres)    
    // {genres.push(generosBD.map(g=>g.id))}
    res.send(genres)

})

router.post("/videogames", async( req, res ) => {
    const { name, description,  genders, src } = req.body
    try {
        if (!name || !description || !genders || !src ){
            res.status(400).send("Atributtes not send")
        }else{
            const created = await Videogame.create(req.body)
            created.addGender(genders)
            }

    } catch (error) {
        console.log(error)
    }
    
})