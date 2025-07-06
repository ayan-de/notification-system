"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../../controllers/notification.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.protect, notification_controller_1.getNotifications);
router.patch('/:id/read', auth_middleware_1.protect, notification_controller_1.markAsRead);
exports.default = router;
