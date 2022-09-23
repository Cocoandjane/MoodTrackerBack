const express = require("express")
const mysql = require('mysql2')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

app.use(cors())

app.use(express.json())


const db = mysql.createConnection({
    user: process.env.MYSQLUSER,
    host: process.env.MYSQLHOST,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
})
const port = process.env.MYSQLPORT || 8000

app.listen(port, () => {
    console.log(`listenting on port ${port}`)
})

const created = new Date()
app.post('/api/create', (req, res) => {
    // console.log(req.body)
    const mood = req.body.mood
    const rating = req.body.rating
    db.query('INSERT INTO moods(mood, rating, created) VALUES(?,?,?);',
        [mood, rating, created], (err, result) => {
            // console.log(result)
            res.json({ id: result.insertId })
        })
})

app.get("/api/moods", (req, res) => {
    db.query("SELECT * FROM moods", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })

})

app.post("/api/delete/:id", (req, res) => {
    // console.log(req.params)
    let id = +req.params.id
    db.query("DELETE FROM moods WHERE id = ?;", [id])
})

app.post("/api/edit/:id", (req, res) => {
    // console.log(req.body)
    const id = req.params.id
    mood = req.body.mood
    rating = req.body.rating
    const newMood = req.body.newMood
    const newRating = req.body.newRating
    db.query("UPDATE moods SET mood =?, rating=?, created=? WHERE id = ?;",
        [newMood ? newMood : mood, newRating ? newRating : rating, created, id])
})

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});