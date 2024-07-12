import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (err) {
        console.log(err);
        throw new Error(500, "Something went wrong While Generating Access and Refresh Token")
    }
}



const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    //validation check
    // check if user already exists username , email
    //check for image
    //update user image
    // create new object -create entry in db
    // remove password and refresh token field
    //check for user creation
    //return 

    const { fullname, email, username, password, } = req.body;
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
    if (!avatarLocalPath) {
        throw new Error(400, "avater file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatarLocalPath,
        coverImage: coverImagePath || "",
        email,
        password,
        username: username.toLowerCase(),
        //: role || 'user'
    })
    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createUser) {
        throw new Error(500, "Something went wrong")
    }
    return res.status(201).json(
        new ApiResponse(200, createUser, "success")
    )
    // return res.status(201).json({ success: true, data: createUser });  
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password, } = req.body
    console.log(req.body)
    if (!email && !username) {
        throw new Error(400, " username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) { throw new Error(400, "User does not exist") }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) { throw new Error(401, "Invalid password") }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshtoken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "user Login successful"
            )
        )

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined,
        }
    }, {
        new: true
    }
    )
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        // .clearCookie("accessToken, options")
        // .clearCookie("refreshToken, options")
        .json(new ApiResponse(200, {}, "User Logged Out"))
})



export {
    registerUser,
    loginUser,
    logoutUser
}; 