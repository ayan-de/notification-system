"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationForFollowers = exports.createNotification = void 0;
const db_cofig_1 = __importDefault(require("../DB/db.cofig"));
const createNotification = async (data) => {
    return db_cofig_1.default.notification.create({
        data,
    });
};
exports.createNotification = createNotification;
const createNotificationForFollowers = async (userId, data) => {
    const user = await db_cofig_1.default.user.findUnique({
        where: { id: userId },
        include: { followers: true },
    });
    if (!user) {
        return;
    }
    const notifications = user.followers.map((follow) => {
        return db_cofig_1.default.notification.create({
            data: {
                ...data,
                userId: follow.followerId,
            },
        });
    });
    await Promise.all(notifications);
};
exports.createNotificationForFollowers = createNotificationForFollowers;
