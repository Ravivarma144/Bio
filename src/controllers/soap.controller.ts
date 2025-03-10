import { Request, Response,NextFunction} from "express";
import { convertSoapToJson } from "../services/soap.service";

export async function parseSoapXml(req: Request, res: Response,next: NextFunction) {
  try {
    const { xml } = req.body;
    if (!xml) return res.status(400).json({ error: "XML input is required" });

    const jsonResponse = await convertSoapToJson(xml);
    res.json(jsonResponse);
  } catch (error) {
    res.status(500).json({ error: "Failed to parse SOAP XML" });
  }
}

// export async function parseSoapXml(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { xml } = req.body;
//       if (!xml) {
//         return res.status(400).json({ error: "XML input is required" });
//       }
  
//       const jsonResponse = await convertSoapToJson(xml);
//       res.json(jsonResponse);
//     } catch (error) {
//       next(error); // Forward error to Express error handler
//     }
//   }