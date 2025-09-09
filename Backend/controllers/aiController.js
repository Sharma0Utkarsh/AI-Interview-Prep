const {GoogleGenAI} = require("@google/genai");
const {conceptExplainPrompt, questionAnswerPrompt} = require("../utils/prompts");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

//@desc Generate interview questions and answers using Gemini
//@route POST/api/ai/generate-questions
//@access Private
const generateInterviewQuestion = async (req,res)=>{
try {

    const {role, experience, topicsToFocus, numberOfQuestions} = req.body;

    if(!role || !experience ||! topicsToFocus|| !numberOfQuestions){
        return res.status(400).json({ message: "Missing required fileds"});
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: prompt,
    });

    let rawText = response.text;

    //Clean it: Remove``` from begining and ending```

    const cleanedText = rawText
    .replace(/^```json\s*/,"")//Remove starting```json
    .replace(/```$/,"")// removes ending
    .trim();//Remove extra spaces

    //Now safe to paste
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);

    
} catch (error) {
    res.status(500).json({
        message: "Failed to generate questions",
        error: error.message,
    });
    
}
};

//@desc Generate explains a interview questions
//@route POST/api/ai/generate-explaination
//@access Private

const generateConceptExplanation = async (req,res)=>{
    try {

        const {question } = req.body;
        if(!question){
            return res.status(400).json({message: "Missing required fields"});

        }

        const prompt  = conceptExplainPrompt(question);
            
            const response = await ai.models.generateContent({
            model:"gemini-2.0-flash-lite",
            contents: prompt,
        });

        let rawText = response.text;

        //Clean it :Remove ```Json and ``` from beginning and end
        const cleanedText = rawText
    .replace(/^```json\s*/,"")//Remove starting```json
    .replace(/```$/,"")// removes ending
    .trim();//Remove extra spaces

    //Now safe to parse

    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({
        message: "Failed to generate questions",
        error: error.message,
    });
    }
};

module.exports = {generateInterviewQuestion,generateConceptExplanation};