if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const MongoStore = require('connect-mongo');


const dbURL = process.env.DB_URL


mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})


const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.secret;

const store = MongoStore.create({
    mongoUrl: dbURL,
    secret,
    touchAfter: 24 + 60 + 60
});

store.on('error', function(e) {
    console.log('SESSION STORE ERROR', e)
})


const sessionConfig = {
    store,
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


// const scriptSrcUrls = [
//     "https://cdn.jsdelivr.net/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://kit.fontawesome.com/",
//     "http://fonts.googleapis.com/*",
//     "http://fonts.gstatic.com/*",
//     `https://res.cloudinary.com/${process.env.CLOUDINARY}`,
//     "http://c1.staticflickr.com/*",
//     "http://c2.staticflickr.com/",
//     "https://content.fortune.com/wp-content/uploads/2020/08/AP20242071038593.jpg",
//     "https://giphy.com/gifs/people-hd-gifsremastered-10Jpr9KSaXLchW",
    


// ];

// const styleSrcUrls = [
//     "https://cdn.jsdelivr.net/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://kit.fontawesome.com/",
//     "http://fonts.googleapis.com/*",
//     "http://fonts.gstatic.com/*",
//     `https://res.cloudinary.com/${process.env.CLOUDINARY}`,
//     "http://c1.staticflickr.com/",
//     "http://c2.staticflickr.com/",
//     "https://content.fortune.com/wp-content/uploads/2020/08/AP20242071038593.jpg",
//     "https://giphy.com/gifs/people-hd-gifsremastered-10Jpr9KSaXLchW",
//     "https://giphy.com/embed/10Jpr9KSaXLchW"

// ];

// const connectSrcUrls = [
//     `https://res.cloudinary.com/${process.env.CLOUDINARY}`,
    
// ];

// const fontSrcUrls = [ `https://res.cloudinary.com/${process.env.CLOUDINARY}`];

// app.use(
//     helmet.contentSecurityPolicy({
//         directives : {
//             defaultSrc : [],
//             connectSrc : [ "'self'", ...connectSrcUrls ],
//             scriptSrc  : [ "'unsafe-inline'", "'self'", "http://fonts.googleapis.com/", "http://fonts.gstatic.com/", ...scriptSrcUrls ],
//             styleSrc   : [ "'self'", "'unsafe-inline'", "http://fonts.googleapis.com/", "http://fonts.gstatic.com/", ...styleSrcUrls ],
//             workerSrc  : [ "'self'", "blob:" ],
//             objectSrc  : [],
//             imgSrc     : [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 `https://res.cloudinary.com/${process.env.CLOUDINARY}`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
//                 "https://images.unsplash.com/",
//                 "http://c1.staticflickr.com/",
//                 "http://c2.staticflickr.com/",
//                 "https://content.fortune.com/wp-content/uploads/2020/08/AP20242071038593.jpg"
//             ],
//             fontSrc    : [ "'self'", "http://fonts.googleapis.com/", "http://fonts.gstatic.com/", ...fontSrcUrls ],
//             mediaSrc   : [ `https://res.cloudinary.com/${process.env.CLOUDINARY}`],
//             childSrc   : [ "blob:", 
//                     "https://giphy.com/embed/10Jpr9KSaXLchW"]
//         }
//     })
// );

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


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`serving on port ${port}`)
});
