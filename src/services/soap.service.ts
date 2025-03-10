// import { parseStringPromise } from "xml2js";

// export async function convertSoapToJson(xml: string) {
//   try {
//     const result = await parseStringPromise(xml, { explicitArray: false });

//     const response =
//       result["soap:Envelope"]["soap:Body"]["GetTransactionsLogResponse"];
//     const logsCount = response["GetTransactionsLogResult"];
//     const strDataList = response["strDataList"];

//     const transactions = strDataList
//       .trim()
//       .split("\n")
//       .map((line:any) => {
//         const [id, timestamp] = line.trim().split(/\s+/);
//         return { id: parseInt(id, 10), timestamp };
//       });

//     return {
//       GetTransactionsLogResponse: {
//         GetTransactionsLogResult: logsCount,
//         strDataList: transactions,
//       },
//     };
//   } catch (error) {
//     console.error("Error parsing SOAP XML:", error);
//     throw new Error("Invalid SOAP XML format");
//   }
// }


import { parseStringPromise } from "xml2js";

export async function convertSoapToJson(xml: string) {
  try {
    const result = await parseStringPromise(xml, { explicitArray: false });

    const response =
      result["soap:Envelope"]["soap:Body"]["GetTransactionsLogResponse"];
    const logsCount = response["GetTransactionsLogResult"];
    const strDataList = response["strDataList"];

    if (!strDataList) throw new Error("No transaction data found");

    // Ensure proper extraction of ID and timestamp
    const transactions = strDataList
      .trim()
      .split("\n")
      .map((line:any) => {
        const parts = line.trim().split(/\s+/);
        const id = parseInt(parts[0], 10);
        const timestamp = `${parts[1]} ${parts[2]}`; // Ensure full date-time format

        return { id, timestamp };
      });

    return {
      GetTransactionsLogResponse: {
        GetTransactionsLogResult: logsCount,
        strDataList: transactions,
      },
    };
  } catch (error) {
    console.error("Error parsing SOAP XML:", error);
    throw new Error("Invalid SOAP XML format");
  }
}

