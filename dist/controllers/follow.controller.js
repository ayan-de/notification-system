"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowing = exports.getFollowers = exports.unfollowUser = exports.followUser = void 0;
const db_cofig_1 = __importDefault(require("../DB/db.cofig"));
// @desc    Follow a user
// @route   POST /api/v1/users/:id/follow
const followUser = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id;
        const userToFollowId = req.params.id;
        if (loggedInUserId === userToFollowId) {
            res.status(400).json({ success: false, message: 'You cannot follow yourself' });
            return;
        }
        const existingFollow = await db_cofig_1.default.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: loggedInUserId,
                    followingId: userToFollowId,
                },
            },
        });
        if (existingFollow) {
            res.status(400).json({ success: false, message: 'You are already following this user' });
            return;
        }
        await db_cofig_1.default.follow.create({
            data: {
                followerId: loggedInUserId,
                followingId: userToFollowId,
            },
        });
        res.status(200).json({ success: true, message: 'User followed successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.followUser = followUser;
// @desc    Unfollow a user
// @route   POST /api/v1/users/:id/unfollow
const unfollowUser = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id;
        const userToUnfollowId = req.params.id;
        const existingFollow = await db_cofig_1.default.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: loggedInUserId,
                    followingId: userToUnfollowId,
                },
            },
        });
        if (!existingFollow) {
            res.status(400).json({ success: false, message: 'You are not following this user' });
            return;
        }
        await db_cofig_1.default.follow.delete({
            where: {
                id: existingFollow.id,
            },
        });
        res.status(200).json({ success: true, message: 'User unfollowed successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.unfollowUser = unfollowUser;
// @desc    Get followers of a user
// @route   GET /api/v1/users/:id/followers
const getFollowers = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const followers = await db_cofig_1.default.follow.findMany({
            where: { followingId: userId },
            include: { follower: true },
        });
        res.status(200).json({ success: true, data: followers });
    }
    catch (error) {
        next(error);
    }
};
exports.getFollowers = getFollowers;
// @desc    Get users a user is following
// @route   GET /api/v1/users/:id/following
const getFollowing = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const following = await db_cofig_1.default.follow.findMany({
            where: { followerId: userId },
            include: { following: true },
        });
        res.status(200).json({ success: true, data: following });
    }
    catch (error) {
        next(error);
    }
};
exports.getFollowing = getFollowing;
