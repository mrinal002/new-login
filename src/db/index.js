import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        //console.log(`${DB_NAME}`);
        //console.log(`${process.env.MONGODB_URL}`);
        //const connectionInstance = await mongoose.connect('mongodb://localhost:27017/login');
        console.log(`Connected to ${connectionInstance.connection.host}`);
    } catch (error){
        console.log(" mongoose connection error" );
        process.exit(1);
    }
  
};


export default connectDB;