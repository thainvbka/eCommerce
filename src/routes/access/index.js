"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticate } = require("../../auth/checkAuth");

router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.logIn));

router.use(authenticate);

router.post("/shop/logout", asyncHandler(accessController.logOut));
router.post(
  "/shop/refresh-token",
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
