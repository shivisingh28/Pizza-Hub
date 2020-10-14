const Menu = require("../../models/menu");

function homeController() {
	//Factory pattern=> object creational pattern
	return {
		async index(req, res) { 
			const pizzas = await Menu.find();
			//console.log(pizzas);
			return res.render("home", { pizzas: pizzas });
		},
	};
}
module.exports = homeController;
