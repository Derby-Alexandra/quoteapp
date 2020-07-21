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
var session = require('express-session');
app.use(session({secret: 'bunny hat'}));

app.use(bodyParser.json()) // for parsing application/json
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
app.get('/logout', (req, res) => {
    req.session.user_id = undefined
        get_quote(function(quotes) {
        let random_index = Math.floor((Math.random() * quotes.length) + 1)
        res.render('index', {quote: quotes[random_index].text, author: quotes[random_index].author})
    })
})
app.get('/generate2', (req, res) => {
    get_quote(function(quotes) {
        let random_index = Math.floor((Math.random() * quotes.length) + 1)
        res.render('account', {quote: quotes[random_index].text, author: quotes[random_index].author})
    })
})
app.get('/view', (req, res) => {
    var sql = `
    SELECT 
        q.quote, 
        c.categoryname, 
        c.id AS categoryid
    FROM userhasquote AS u 
    JOIN quote as q ON q.id = u.quoteid 
    JOIN category AS c ON c.id = q.categoryid 
    WHERE u.userid = ${req.session.user_id}`
    pool.query(sql, function(err, result) {
        console.log("error: ", err)
        res.render('view', {quotes: result.rows})
    }) 
})
app.get('/account', (req, res) => {
    get_quote(function(quotes) {
        let random_index = Math.floor((Math.random() * quotes.length) + 1)
        res.render('account', {quote: quotes[random_index].text, author: quotes[random_index].author})
    })
})
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
        if (result.rows[0].password == req.body.password) {
            req.session.user_id = result.rows[0].id
            get_quote(function(quotes) {
                let random_index = Math.floor((Math.random() * quotes.length) + 1)
                res.render('account', {quote: quotes[random_index].text, author: quotes[random_index].author})
            })
        } else {
            res.render('login', {loginFailed: true})
        }
    });
})
app.post('/savequote', (req, res) => {
    var sql = `INSERT INTO quote (categoryid, quote) VALUES (${req.body.categoryid}, '${req.body.quote}') RETURNING id`
    pool.query(sql, function(err, result) {
        // check if the insert worked
        if (result.rows[0]) {
            // if it worked, then get the newly generated id for the quote
            // and add a linking record (userhasquote)
            let quote_id = result.rows[0].id
            let user_id = req.session.user_id
            sql = `INSERT INTO userhasquote (userid, quoteid) VALUES (${user_id}, ${quote_id})`
            pool.query(sql, function(err, result) {
                // check if the insert worked
                if (result.rowCount === 1) {
                    res.json({quoteWasSaved: true})
                } else {
                    res.json({quoteWasSaved: false, error: err})
                }
            })
        } else {
            res.json({quoteWasSaved: false, error: err})
        }
    })
})

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