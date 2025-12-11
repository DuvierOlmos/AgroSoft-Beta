const registerController = require("./registerController");
const loginController = require("./loginController");

module.exports = {
  register: registerController.register,
  login: loginController.login,
};
