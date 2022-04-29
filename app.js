if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');



const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.secret;

const sessionConfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 1,
        maxAge: 1000 * 60 * 60 * 24 * 1
    }
}

app.use(session(sessionConfig));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/main/trib', (req, res) => {
    res.render('main/trib')
});

app.get('/main/bb', (req, res) => {
    res.render('main/bb')
});

app.get('/main/moc', (req, res) => {
    res.render('main/moc')
});

app.get('/main/photo', (req, res) => {
    res.render('main/photo')
});

app.get('/main/oldgrove', (req, res) => {
    res.render('main/oldgrove')
});


app.listen(3000, () => {
    console.log('serving on port 3000')
});
