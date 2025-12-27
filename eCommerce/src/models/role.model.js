"use strict";

const { model, Schema } = require("mongoose");

const { DOCUMENT_NAMES, COLLECTION_NAMES } = require("../constants");

const RoleSchema = new Schema(
  {
    rol_name: {
      type: String,
      default: "user",
      enum: ["user", "shop", "admin"],
    },
    rol_slug: { type: String, required: true },
    rol_status: {
      type: String,
      default: "active",
      enum: ["active", "block", "pending"],
    },
    rol_description: { type: String, default: "" },
    rol_grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: "*" },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.ROLE,
  }
);

module.exports = model(DOCUMENT_NAMES.ROLE, RoleSchema);

// let grantList = [
//   {
//     role: "shop",
//     resource: "video",
//     action: "create:any",
//     attributes: "*, !views",
//   },
//   { role: "admin", resource: "video", action: "read:any", attributes: "*" },
//   {
//     role: "admin",
//     resource: "video",
//     action: "update:any",
//     attributes: "*, !views",
//   },
//   { role: "admin", resource: "video", action: "delete:any", attributes: "*" },

//   {
//     role: "user",
//     resource: "video",
//     action: "create:own",
//     attributes: "*, !rating, !views",
//   },
//   { role: "user", resource: "video", action: "read:any", attributes: "*" },
//   {
//     role: "user",
//     resource: "video",
//     action: "update:own",
//     attributes: "*, !rating, !views",
//   },
//   { role: "user", resource: "video", action: "delete:own", attributes: "*" },
// ];
