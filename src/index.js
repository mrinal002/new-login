 import dotenv from "dotenv";
//require('dotenv').config()

import connectDB from "./db/index.js";
//require('dotenv').config({ path: './.env' });


 dotenv.config({
     path: './env',
 })


connectDB()