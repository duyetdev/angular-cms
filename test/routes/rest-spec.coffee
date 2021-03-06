#Routes Spec
request = require('supertest')
expect = require('chai').expect

#//Dynamic rest server
rest = require(__dirname + '/routes/rest').rest

console.log(__dirname)
app = rest.init({port: 9191});

endpoint = 'http://localhost:8181/api/v2'
postData =
	"username": "nodetest"+Date.now(),
	"email": "nodetest@email.com",
	"password": "test",
	"active": true,
	"groups": ["member"],
	"_activation": "",
	"_key": "",
	"created": new Date(),
	"modified": new Date(),
	"metadata": {"avatar": "", "name": "Node Test User"}

describe 'Testing: API Server', () ->

	describe "GET /users", ->
		it "respond with json", (done) ->
			request(app)
				.get '/api/v2/angular-cms/users'
				.expect "Content-Type", /json/
				.expect 200, done