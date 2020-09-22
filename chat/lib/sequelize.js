const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("database", "", "", {
  dialect: "sqlite",
  storage: "./database/database.sqlite",
});

sequelize.authenticate().then(() => {
  console.log("Se establecio conexion a base de datos");
});

module.exports = sequelize;
