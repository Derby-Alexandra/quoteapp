require('dotenv').config();
const { Pool } = require('pg');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
const bodyParser = require('body-parser');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString})

app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')))
app.post('/costcalculator', (req, res) => {

    // Set up a JSON object of the values we want to pass along to the EJS result page
    const params = {cost, weight, mailtype};

    console.log(params)
    res.render('pages/costcalculator', params)
})   

var sql = "SELECT * FROM siteuser";
pool.query(sql, function(err, result) {
    // If an error occurred...
    if (err) {
        console.log("Error in query: ")
        console.log(err);
    }
    // Log this to the console for debugging purposes.
    console.log("Back from DB with result:");
    console.log(result.rows);
});  


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
