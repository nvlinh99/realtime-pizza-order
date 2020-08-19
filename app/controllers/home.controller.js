function homeController() { 
	return {
		index(req, res) {
			res.render('home');
		}
	}
}

module.exports = homeController;