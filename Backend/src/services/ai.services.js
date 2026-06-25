const { GoogleGenAI, GenerateImagesResponse } = require('@google/genai')
const { z } = require('zod')


const ai = new GoogleGenAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportJsonSchema = {
        type: "object",
        properties: {
                title: {
                        type: "string",
                        description: "The title of the job for which the interview report is generated",
                },
                matchScore: {
                        type: "integer",
                        description:
                                "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
                },
                technicalQuestions: {
                        type: "array",
                        description:
                                "Technical questions likely to be asked in the interview, with the interviewer's intention and how to answer",
                        items: {
                                type: "object",
                                properties: {
                                        question: {
                                                type: "string",
                                                description: "The technical question that can be asked in the interview",
                                        },
                                        intention: {
                                                type: "string",
                                                description: "The intention of the interviewer behind asking this question",
                                        },
                                        answer: {
                                                type: "string",
                                                description:
                                                        "How to answer this question — what points to cover, what approach to take, etc.",
                                        },
                                },
                                required: ["question", "intention", "answer"],
                        },
                },
                behavioralQuestions: {
                        type: "array",
                        description:
                                "Behavioral questions likely to be asked in the interview, with the interviewer's intention and how to answer",
                        items: {
                                type: "object",
                                properties: {
                                        question: {
                                                type: "string",
                                                description: "The behavioral question that can be asked in the interview",
                                        },
                                        intention: {
                                                type: "string",
                                                description: "The intention of the interviewer behind asking this question",
                                        },
                                        answer: {
                                                type: "string",
                                                description:
                                                        "How to answer this question — what points to cover, what approach to take, etc.",
                                        },
                                },
                                required: ["question", "intention", "answer"],
                        },
                },
                skillGaps: {
                        type: "array",
                        description:
                                "List of skill gaps identified in the candidate's profile, along with their severity",
                        items: {
                                type: "object",
                                properties: {
                                        skill: {
                                                type: "string",
                                                description: "The skill which the candidate is lacking",
                                        },
                                        severity: {
                                                type: "string",
                                                enum: ["low", "medium", "high"],
                                                description:
                                                        "How important this skill is for the job and how much it can impact the candidate's chances",
                                        },
                                },
                                required: ["skill", "severity"],
                        },
                },
                preparationPlan: {
                        type: "array",
                        description:
                                "A day-wise preparation plan for the candidate to follow in order to prepare effectively",
                        items: {
                                type: "object",
                                properties: {
                                        day: {
                                                type: "integer",
                                                description: "The day number in the preparation plan, starting from 1",
                                        },
                                        focus: {
                                                type: "string",
                                                description:
                                                        "The main focus area for this day — e.g. data structures, system design, mock interviews, etc.",
                                        },
                                        tasks: {
                                                type: "array",
                                                description:
                                                        "List of concrete tasks to complete on this day — e.g. read a specific article, solve N problems, watch a video, etc.",
                                                items: { type: "string" },
                                        },
                                },
                                required: ["day", "focus", "tasks"],
                        },
                },
        },
        required: [
                "title",
                "matchScore",
                "technicalQuestions",
                "behavioralQuestions",
                "skillGaps",
                "preparationPlan",
        ],
};

const interviewReportSchema = z.fromJSONSchema(interviewReportJsonSchema);

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
        const prompt = `Generate a comprehensive interview report for a candidate with the following details:
 
Resume:
${resume}
 
Self Description:
${selfDescription}
 
Job Description:
${jobDescription}
`;

        const response = await ai.models.generateContent({
                model:'gemini-2.5-flash',
                contents: prompt,
                config: {
                        responseMimeType:"application/json",
                        responseSchema: interviewReportJsonSchema
                },
        });

        // Parse the JSON string, then validate shape with Zod
        const report = interviewReportSchema.parse(JSON.parse(response.text));

        console.log(report);
}


module.exports = generateInterviewReport