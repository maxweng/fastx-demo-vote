module.exports = {
	port : process.env.PORT || 8000,
	goldPerMinute: 1,
	pollCreateGold: 5,
	dataBase : 'mongodb://localhost:27017/Wallet'
}
