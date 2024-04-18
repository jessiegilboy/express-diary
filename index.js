const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();

const port = process.env.PORT || 3000;

// Set templating engine as ejs
app.set("view engine", "ejs");

// serving Static files
app.use(express.static('public'));

// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// Middleware for method-override
app.use(methodOverride('_method'));


// Database url
const url = "mongodb+srv://groovyfiore:12345@cluster0.ngu4olf.mongodb.net/Diary?retryWrites=true&w=majority&appName=Cluster0";
  
// Connecting application with database
mongoose.connect(url).then(console.log("Mongo DB Connected")).catch(err => console.log(err));

// Import Diary Model
const Diary = require('./models/Diary');

// ROUTING

// Route for /
app.get("/", (req, res) => {
  res.render("Home");
});

// Route for about page
app.get("/about", (req, res) => {
  res.render("About");
});

// Route for diary page
app.get('/diary', (req, res) => {
    Diary.find().then(data => {
        res.render("Diary", { data: data });
    }).catch(err => console.log(err));
});

//Route for adding records
app.get('/add', (req, res) => {
    res.render('Add');
});

// Route for saving diary entries 
app.post('/add-to-diary', (req, res) => {
    //save data on the database
    const Data = new Diary({
        title: req.body.title,
        description: req.body.description,
        date:req.body.date
    })
    
    Data.save().then(() => {
        res.redirect('/diary');
    }).catch(err => console.log(err));
});

// Route for displaying entries 
app.get('/diary/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Page', { data });
    }).catch(err => console.log(err));
});

// Route for edit 
app.get('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Edit', { data: data });
    }).catch(err => console.log(err));
})

// Edit Data
app.put('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        data.title = req.body.title
        data.description = req.body.description
        data.date = req.body.date
        
        data.save().then(() => {
            res.redirect('/diary');
        }).catch(err => console.log(err));

    }).catch(err => console.log(err));
})

// Delete from database 
app.delete('/data/delete/:id', (req, res) => {
    Diary.deleteOne({
        _id: req.params.id
    }).then(() => {
        res.redirect('/diary');
    }).catch(err => console.log(err));
})
// Server
app.listen(3000, () => {
  console.log("server is running");
});
