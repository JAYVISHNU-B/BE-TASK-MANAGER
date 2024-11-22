import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import troutes from './routes/troutes.js';
import connectDB from './database/server.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/",(req,res)=>{
  res.status(200).send("Welcome to our api")
})


app.use('/api/auth', routes);
app.use('/api/tasks', troutes);

const port = process.env.PORT || 4000;

app.listen(port,()=>{
    console.log("server started");
    
})