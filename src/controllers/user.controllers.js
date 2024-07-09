import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler( async(req, res) => {
    // get user details from frontend
    //validation check
    // check if user already exists username , email
    //check for image
    //update user image
    // create new object -create entry in db
    // remove password and refresh token field
    //check for user creation
    //return 

    const { fullname, email, username, password, role } = req.body;
    console.log("Request Body: ", req.body);
    console.log("Files: ", req.files);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        return res.status(409).json(new ApiResponse(409, null, "User already exists in database"));
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImagePath = req.files?.coverImage?.[0]?.path;
    if(!avatarLocalPath){
        throw new Error(400, "avater file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatarLocalPath,
        coverImage: coverImagePath || "",
        email,
        password,
        username: username.toLowerCase(),
        role: role || 'user'
    })
    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createUser){
        throw new Error(500, "Something went wrong")
    } 
    return res.status(201).json(
       new ApiResponse(200, createUser, "success")
    )
    // return res.status(201).json({ success: true, data: createUser });  
});

export {registerUser} 