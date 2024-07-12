import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        
        const token = req.cookies?.accessToken || req.header
        ("Authorization")?.replace("Bearer ", "");
        console.log(token)
        if(!token) {
            throw new Error(401, "Unauthorized access token")
        }
        console.log("Token:", token);
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
        console.log(decodedToken)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        console.log(user)
        if(!user) {
            throw new Error(401, "Invalid access Token")
        }
    
        req.user = user;    
        next();
    } catch (error) {
        throw new Error(401, error?.message || "Invalid access Token");
    }

});  