import express from "express";

import { adminLogin } from "../../controllers/auth/adminlogin.js";
import { registerUser,loginUser } from "../../controllers/auth/userAuth.js";

const router = express.Router();


router.post("/admin/login",adminLogin);
router.post("/user/register", async (req, res) => {
    await registerUser(req, res);
  });
router.post("/user/login",loginUser);


export default router;