"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const follow_routes_1 = __importDefault(require("./follow.routes"));
const post_routes_1 = __importDefault(require("./post.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/users', follow_routes_1.default);
router.use('/posts', post_routes_1.default);
router.use('/notifications', notification_routes_1.default);
exports.default = router;
