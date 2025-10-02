

// Importamos los controladores separados
const registerController = require("./registerController");
const loginController = require("./loginController");

// Reexportamos para que las rutas puedan usarlo
module.exports = {
  register: registerController.register,
  login: loginController.login,
};
