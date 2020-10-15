require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 3300;
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);
const pasport = require("passport");
const passport = require("passport");

//DATABASE CONNECTION
//const url = "mongodb://localhost:27017/pizza";
mongoose.connect(
	"mongodb+srv://user:root@cluster0.gwqrl.mongodb.net/pizza?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: true,
	}
);
const connection = mongoose.connection;
connection
	.once("open", () => {
		console.log("Database connected...");
	})
	.catch((err) => {
		console.log("Connection failed...");
	});

// Session store
let mongoStore = new MongoDbStore({
	mongooseConnection: connection,
	collection: "sessions",
});

//Session Config
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		store: mongoStore,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hours
	})
);
//Passport Config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global middleware
app.use((req, res, next) => {
	res.locals.session = req.session;
	res.locals.user = req.user;
	next();
});

//Set Template Engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
//routes
require("./routes/web")(app);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
