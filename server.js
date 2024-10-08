const express = require("express")
const app = express()
const mysql = require("mysql2")
const dotenv = require("dotenv")
const PORT = 3300

dotenv.config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


db.connect((err) => {
    if (err) {
        console.log("Unable to connect to database!", err)
        return;
    }
    
    console.log("Database connected successfully to MySQL: " + db.threadId)
})


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.get("/patients", (req,res) => {
    const patients_table = "SELECT patient_id,first_name,last_name,date_of_birth FROM patients"
    db.query(patients_table, (err, data) => {
        if (err) {
            res.status(400).send("Error displaying data", err)
            return;
        }

        res.status(200).render("data", {data})
    })
})

app.get("/providers", (req,res) => {
    const providers_table = "SELECT first_name,last_name,provider_specialty FROM providers"
    db.query(providers_table, (err, data) => {
        if (err) {
            res.status(400).send("Error displaying data", err)
            return;
        }

        res.status(200).render("data", {data})
    })
})

app.get("/filtered_patients", (req,res) => {
    const first_name = req.query.first_name
    const patients_table = "SELECT * FROM patients WHERE first_name = ?"
    db.query(patients_table, [first_name], (err, data) => {
        if (err) {
            res.status(400).send("Error displaying data", err)
            return;
        }

        res.status(200).render("data", {data})
    })
})

app.get("/filtered_providers", (req,res) => {
    const provider_specialty = req.query.provider_specialty
    const providers_table = "SELECT * FROM providers WHERE provider_specialty = ?"
    db.query(providers_table, [provider_specialty], (err, data) => {
        if (err) {
            res.status(400).send("Error displaying data", err)
            return;
        }

        res.status(200).render("data", {data})
    })
})

app.listen(PORT,(err) => {
    if(err) {
        console.log("Something is wrong", err)
        return;
    }

    console.log(`server is runnig on http://localhost:${PORT}`)
})