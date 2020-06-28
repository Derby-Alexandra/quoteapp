const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const bodyParser = require('body-parser');

express()
    .use(bodyParser.urlencoded({ extended: true }))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/postageform.html')))
    .post('/costcalculator', (req, res) => {
         // do stuff with req
        let weight = req.body.weight 
        let mailtype = req.body.mailtype
        let cost = 0
        console.log(req.body)
        console.log(weight)
        console.log(mailtype)
        switch(mailtype) {
            case 'Letters (Stamped)':
                if (weight <= 1) {
                    cost = 0.55
                } else if (weight <= 2) {
                    cost = 0.70
                } else if (weight <= 3) {
                    cost = 0.85
                } else if (weight <= 3.5) {
                    cost = 1.00
                } else {
                    cost = "N/A"
                }
                break;
            case 'Letters (Metered)':
                if (weight <= 1) {
                    cost = 0.50
                } else if (weight <= 2) {
                    cost = 0.65
                } else if (weight <= 3) {
                    cost = 0.80
                } else if (weight <= 3.5) {
                    cost = 0.95
                } else {
                    cost = "N/A"
                }    
                break;
            case 'Large Envelopes (Flats)':
                if (weight <= 1) {
                    cost = 1.00
                } else if (weight <= 2) {
                    cost = 1.20
                } else if (weight <= 3) {
                    cost = 1.40
                } else if (weight <= 4) {
                    cost = 1.60
                } else if (weight <= 5) {
                    cost = 1.80
                } else if (weight <= 6) {
                    cost = 2.00
                } else if (weight <= 7) {
                    cost = 2.20
                } else if (weight <= 8) {
                    cost = 2.40
                } else if (weight <= 9) {
                    cost = 2.60
                } else if (weight <= 10) {
                    cost = 2.80
                } else if (weight <= 11) {
                    cost = 3.00
                } else if (weight <= 12) {
                    cost = 3.20
                } else if (weight <= 13) {
                    cost = 3.40
                } else {
                    cost = "N/A"
                }          
                break;
            case 'First-Class Package Service—Retail':
                 if (weight <= 4) {
                    cost = 3.80
                } else if (weight <= 8) {
                    cost = 4.60
                } else if (weight <= 12) {
                    cost = 5.30
                } else if (weight <= 13) {
                    cost = 5.90
                } else {
                    cost = "N/A"
                }
                break;
           }

    	// Set up a JSON object of the values we want to pass along to the EJS result page
        const params = {cost, weight, mailtype};

        console.log(params)
        res.render('pages/costcalculator', params)
    })   

.listen(PORT, () => console.log(`Listening on ${ PORT }`))
