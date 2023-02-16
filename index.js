//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { Videogame , Gender} = require('./src/db');
const  axios  = require('axios')
const { PORT , APIKEY } = require('./src/config.js')
// Syncing all the models at once.
async function getGenders() {
const dataApi = (await axios.get(`https://api.rawg.io/api/genres?key=${APIKEY}`)).data
dataApi.results.map(async g => await Gender.findOrCreate(
    {where:{
        gender:g.name
    }
}))
const generosBD = await Gender.findAll()
const genres= generosBD.map(g=>g.gender)
return genres
}


conn.sync({ force: true }).then(() => {
  getGenders()
  server.listen(PORT, () => {
    console.log(`%s listening at ${PORT}`); // eslint-disable-line no-console
  })
});
console.log(PORT);
