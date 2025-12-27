// "use strict";

// const rbac = require("./role.middleware");
// const { AuthFailureError } = require("../core/error.response");

// /**
//  * action: 'createOwn', 'readAny', 'updateOwn', 'deleteAny', etc.
//  * resource: 'profile', 'product', etc.
//  */
// const grantAccess = (action, resource) => {
//   return async (req, res, next) => {
//     try {
//       const permission = rbac
//         .can(req.user.user_role.role_name) //tam thoi de lay role_name chu chưa có thực hiện cấp role
//         [action](resource);
//       if (!permission.granted) {
//         throw new AuthFailureError(
//           "You don't have enough permission to access"
//         );
//       }
//       next();
//     } catch (error) {
//       console.error("Error in grantAccess middleware:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   };
// };

// module.exports = grantAccess;
