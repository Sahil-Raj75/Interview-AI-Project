const { GoogleGenAI } = require('@google/genai')
const { z } = require('zod')
const puppeteer = require('puppeteer')
const CompanyEmbedding = require('../model/company.model');

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

async function generateInterviewReport({ resume, selfDescription, jobDescription, companyPrompt }) {
        const companyRAGContext = await getCompanyContextViaRAG(companyPrompt);

        // augmentation - augment the prompt with company context retrieved via RAG if available
        const prompt = `You are a FAANG interview coach. Generate a DETAILED report with the following details:
                Resume: ${resume}
                Self Description: ${selfDescription}
                Job Description: ${jobDescription}
                
                Target Company & Culture Context (Retrieved via RAG / Target Details):
                ${companyRAGContext ? companyRAGContext : "Target Company Context: Rely on general industry standards and the job description for company alignment."}

CRITICAL: Do NOT return empty arrays.

GENERATE EXACTLY:
1. technicalQuestions (EXACTLY 5): ...
2. behavioralQuestions (EXACTLY 5): ...
3. skillGaps (AT LEAST 4): ...
4. preparationPlan (AT LEAST 7 DAYS): ...

NO EMPTY ARRAYS!`;

        const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                        responseMimeType: "application/json",
                        responseSchema: interviewReportJsonSchema
                },
        });

        // Parse the JSON string, then validate shape with Zod
        const report = interviewReportSchema.parse(JSON.parse(response.text));
        return report;
}

async function generatePdfFromHtml(htmlContent) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" })

        const pdfBuffer = await page.pdf({
                format: "A4", margin: {
                        top: "20mm",
                        bottom: "20mm",
                        left: "15mm",
                        right: "15mm"
                }
        })

        await browser.close()

        return pdfBuffer;
}
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
        const resumePdfJSONSchema = {
                type: "object",
                properties: {
                        html: {
                                type: "string",
                                description: "The HTML content of the resume which can be converted using the library like puppeteer"
                        }
                },
                required: ["html"]

        }

        const resumePdfScheme = z.fromJSONSchema(resumePdfJSONSchema);

        const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

        const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                        responseMimeType: "application/json",
                        responseSchema: resumePdfJSONSchema
                }
        })

        const JsonContent = resumePdfScheme.parse(JSON.parse(response.text));

        const pdfBuffer = generatePdfFromHtml(JsonContent.html)

        return pdfBuffer
}

async function generateFollowUpResponse({ resume, jobDescription, question, intention, suggestedAnswer, conversationHistory, userAnswer }) {
        // Format the previous conversation history into a readable transcript for Gemini
        const formattedHistory = conversationHistory.map(msg =>
                `${msg.sender === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.text}`
        ).join('\n');

        const prompt = `You are a strict, senior technical interviewer conducting a mock interview.
Job Description: ${jobDescription}
Candidate Resume Summary: ${resume}

Question being asked: ${question}
Interviewer Intention: ${intention}
Suggested Answer Guidelines: ${suggestedAnswer}

Previous Conversation Transcript:
${formattedHistory}

Candidate's Latest Answer: ${userAnswer}

Instructions:
1. Analyze the candidate's latest answer against the question's intention and guidelines.
2. If the answer is superficial, missing depth, or incorrect, act like a real interviewer and ask a sharp, probing follow-up question.
3. If the answer is comprehensive and strong, acknowledge it briefly and offer a constructive tip to make it even better, or move to a related nuance.
4. Keep your response conversational, concise (under 3-4 sentences), and professional. Do not output JSON, just output the plain text response.`;

        const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
        });

        return response.text;
}
// db is passed from the controller to avoid multiple connections and reuse the existing connection for RAG search
async function getCompanyContextViaRAG(companyPrompt) {
        try {
                if (!companyPrompt || companyPrompt.trim() === "") return "";

                // 1. Generate embedding for the user's company target prompt using Gemini
                const embeddingResult = await ai.models.embedContent({
                        model: 'gemini-embedding-001',
                        contents: companyPrompt,
                        config:{
                                outputDimensionality: 512
                        }
                });

                const queryEmbedding = embeddingResult.embeddings[0].values;

                // 2. Run MongoDB Atlas $vectorSearch pipeline
                const pipeline = [
                        {
                                $vectorSearch: {
                                        index: "company_vector_index",
                                        path: "embedding",
                                        queryVector: queryEmbedding,
                                        numCandidates: 10,
                                        limit: 2
                                }
                        },
                        {
                                $project: {
                                        companyName: 1,
                                        text: 1,
                                        score: { $meta: "vectorSearchScore" }
                                }
                        }
                ];

                const searchResults = await CompanyEmbedding.aggregate(pipeline);

                // 3. Extract and combine text chunks if relevance score is good
                if (searchResults && searchResults.length > 0) {
                        // console.log("RAG Match Found for companies:", searchResults.map(r => r.companyName));
                        return searchResults.map(r => `Company: ${r.companyName}\nEngineering Context: ${r.text}`).join('\n\n');
                }

                return ""; // Fallback if no local vector match found
        } catch (error) {
                console.error("RAG Vector Search Error:", error);
                return "";
        }
}

module.exports = { generateInterviewReport, generateResumePdf, generateFollowUpResponse, getCompanyContextViaRAG }