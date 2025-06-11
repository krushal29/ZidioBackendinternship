import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY })

const OverViewOFFile = async (data) => {

    const aiPrompt = `Provide an overview of the following Excel file content:\n${JSON.stringify(data)}`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-05-20",
            contents: aiPrompt
        });
        const text = response.text;
        return {
            data:true,
            text
        }

    } catch (e) {
        return {
            data:false,
            e
        }
    }
}

export default OverViewOFFile;