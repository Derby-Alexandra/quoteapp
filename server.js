require('dotenv').config()
const { Pool } = require('pg')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()
const bodyParser = require('body-parser')
const connectionString = process.env.DATABASE_URL
const pool = new Pool({connectionString: connectionString})
const https = require('https');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    get_quote(function(quotes) {
        let random_index = Math.floor((Math.random() * quotes.length) + 1)
        res.render('index', {quote: quotes[random_index].text, author: quotes[random_index].author})
    })
})
app.get('/generate', (req, res) => {
    get_quote(function(quotes) {
        let random_index = Math.floor((Math.random() * quotes.length) + 1)
        res.render('index', {quote: quotes[random_index].text, author: quotes[random_index].author})
    })
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/generate2', (req, res) => {
    get_quote(function(quotes) {
        let random_index = Math.floor((Math.random() * quotes.length) + 1)
        res.render('account', {quote: quotes[random_index].text, author: quotes[random_index].author})
    })
})
app.get('/view', (req, res) => {
    res.render('view')
})
//app.get('/save', (req, res) => {
//    toggle_modal()
//})
app.post('/createaccount', (req, res) => {
//    console.log(req.body);
    var sql = `INSERT INTO siteuser (firstname, email, password) VALUES ('${req.body.firstname}', '${req.body.email}', '${req.body.password}')`;
    pool.query(sql, function(err, result) {
        res.render('success')
    });  
})
app.post('/accountlogin', (req, res) => {
//    console.log(req.body);
    var sql = `SELECT * FROM siteuser WHERE email = '${req.body.email}'`;
    pool.query(sql, function(err, result) {
        if (result.password == req.body.password) {
            console.log(result.password)
            get_quote(function(quotes) {
                let random_index = Math.floor((Math.random() * quotes.length) + 1)
                res.render('account', {quote: quotes[random_index].text, author: quotes[random_index].author})
            })
        }
    })
})

   
//
//var sql = "SELECT * FROM siteuser";
//pool.query(sql, function(err, result) {
//    // If an error occurred...
//    if (err) {
//        console.log("Error in query: ")
//        console.log(err)
//    }
//    // Log this to the console for debugging purposes.
//    console.log("Back from DB with result:")
//    console.log(result.rows)
//});  


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

function get_quote(callback) {
    https.get("https://type.fit/api/quotes", res => {
      res.setEncoding("utf8")
      let body = ""
      res.on("data", data => {
        body += data
      })
      res.on("end", () => {
        body = JSON.parse(body)
        callback(body)
      })
    })
}