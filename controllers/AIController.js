import OverViewOFFile from "./aiGemini.js";
import ExcelDetails from '../models/ExcelDataModel.js';

const getFileOverview = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const file = await ExcelDetails.findById(fileId);
   
    if (!file) {
      return res.status(404).json({ data: false, text: "File not found" });
    }


    const fileContent = file.ExcelData;
    

    if (!fileContent || fileContent.length === 0) {
      return res.status(400).json({ data: false, text: "File content is empty or invalid." });
    }

    const aiResponse = await OverViewOFFile(fileContent);

    if (aiResponse.data) {
      return res.status(200).json({ data: true, text: aiResponse.text });
    } else {
      return res.status(500).json({ data: false, text: "AI overview failed", error: aiResponse.e });
    }

  } catch (error) {
    console.error("Error generating AI overview:", error);
    return res.status(500).json({ data: false, text: "Server error", error });
  }
};

export default getFileOverview;
