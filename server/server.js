const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); //communication between frontend and backend
const app = express();
const PORT = 5000;
app.use(express.json()); //parse json data from request body
app.use(cors({
    origin: ["http://localhost:5175"],
    methods: ["POST","GET","PATCH","DELETE"],
    allowedHeaders: ["Content-type"]
}))
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Revathy@2509",
    database: "student_db"
})
function connectDB(){
    db.connect(error => {
        if(error){
            console.log("DataBase connection failed", error);
            setTimeout(connectDB, 5000);
        }
        else{
            console.log("Connected to mysql database");
        }
    })
}
connectDB();
app.post("/users",(req,res)=>{
    
})