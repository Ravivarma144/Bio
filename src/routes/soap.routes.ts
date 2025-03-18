import express from "express";
import { parseSoapXml } from "../controllers/soap.controller";

const router = express.Router();
// router.post("/convert", parseSoapXml);
router.post("/convert", async (req, res, next) => {
    try {
      await parseSoapXml(req, res,next);
    } catch (error) {
      next(error); // Pass the error to Express error handler
    }
  });
  

export default router;
