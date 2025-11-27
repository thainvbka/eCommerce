"use strict";

const express = require("express");
const notificationController = require("../../controllers/notification.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");

const { authenticate } = require("../../auth/checkAuth");

// authentication
router.use(authenticate);
router.get("", asyncHandler(notificationController.listNotificationsByUser));

module.exports = router;
