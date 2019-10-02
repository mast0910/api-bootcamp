var express = require('express')
var app = express()

var request = require('request')
// used for parsing POST payload
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// CouchDB params
var couchserver = process.env.couchdb || 'couchdb-bootcamp'
var couchDb = 'mydb/'
var couchUrl = 'http://' + couchserver + ':5984/' + couchDb

var logServerName = ' [Bootcamp API] - '

// This responds with "Good morning" on the homepage
app.get('/', function (req, res) {
   console.log(new Date().toJSON() + logServerName + 'Got a GET request for the homepage')
   res.send('This the Docker bootcamp API.<br>Try /user for a list of records.')
})

// This is where POST of new records come in
app.post('/user', urlencodedParser, function (req, res) {
   // Create a document in CouchDB
     request.post({
       url: couchUrl,
       body: {name: req.body.name, phone: req.body.phone},
       json: true,
     }, function(err, resp, body) {
       var returnPayload  = JSON.stringify(body)
       console.log(new Date().toJSON() + logServerName + 'API Record added: ' + returnPayload)
       res.end('API service - record added: ' + returnPayload + '\nReturn to previous page and reload')
     })
})

// This responds to a GET request on /user (list users)
app.get('/user', function (req, res) {
  // get all documents from CouchDB
  // + params include_docs=true
  request.get(couchUrl + '_all_docs?include_docs=true', function (error, response, body) {
    if (error != null) console.log(new Date().toJSON() + logServerName + 'GET Error: ', error)
    console.log(new Date().toJSON() + logServerName + 'List users:', body)
    // Turn body into html code before returning to client
    var obj = JSON.parse(body)
    var str = '<html><head><style>th {text-align: left}</style></head><body><font face="verdana" color="green"><table><tr><th>Name</th><th>Phone</th></tr>'
    for (i in obj.rows) {
      str+= '<tr><td>' + obj.rows[i].doc.name +'</td><td>' + obj.rows[i].doc.phone +'</td></tr>'
    }
    str += '</table></body></html>'
    // return HTML string to client (it's an iframe, not a REST client..)
    res.send(str)
  });
})

var server = app.listen(8081, function () {
  console.log(new Date().toJSON() + logServerName + 'API server listening on port %s', server.address().port, +
  ', will call couchdb: ' + couchUrl)
})
