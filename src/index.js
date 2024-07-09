import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";



 dotenv.config({
     path: './.env',
 })


connectDB()

.then(() => {
    app.on('error',(err) => {
        console.log("err:", err);
        throw err;
    })
    
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Sarvers listening on ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("MongoDB connect Erro", err)
})