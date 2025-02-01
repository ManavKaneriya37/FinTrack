import UserModel from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import redisClient from '../utils/redisClient.js'

export const verifyUser = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if(!token) {
            throw new ApiError(401, 'Unauthorized request');
        }

        const isBlackListed = await redisClient.get(token);
        if(isBlackListed) {
            res.clearCookie("token");
            throw new ApiError(401, 'Unauthorized request');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (error) {
            throw new ApiError(401, 'Invalid token');
        }

        const user = await UserModel.findById(decoded._id);
        if(!user) {
            throw new ApiError(401, 'Invalid token');
            process.exit(1);
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(409, error.message);
    }
})