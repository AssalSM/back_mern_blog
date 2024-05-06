// 127.0.0.1


const express = require("express");

const connectToDb = require("./config/connectToDb");
const { errorhandler, notfound } = require("./middlewares/error");
require("dotenv").config();
const cors = require("cors")
// connect to db
connectToDb()

// init app
const app = express()

//
app.use(cors({
    origin:["http://localhost:3000","https://mern-blog-api-7p7s.onrender.com"]
}))

// middlewares 

app.use(express.json())

// Router 
app.use("/api/auth" , require("./routes/authRoute"));
app.use("/api/users" , require("./routes/usersRoute"));
app.use("/api/posts" , require("./routes/postsRoute"));
app.use("/api/comments" , require("./routes/commentRoute"));
//app.use("/api/category" , require("./routes/CategoryRoute"));


// error handler mid
app.use(notfound)
app.use(errorhandler)
// Running the server
const PORT = process.env.PORT || 4000 ;
app.listen( PORT, () => {
    console.log(` server is running is ${process.env.NODE_ENV} MODE OM PORT ${PORT} `)
});