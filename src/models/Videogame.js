const { Sequelize } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    id:{
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    description:{
      type: Sequelize.STRING,
      allowNull: false
    },
    launchDate:{
      type: Sequelize.STRING,
    },
    rating:{
      type: Sequelize.FLOAT,
    },
    src:{
      type: Sequelize.TEXT
    }
  });
};
