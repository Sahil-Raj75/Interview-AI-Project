require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const companyEmbeddingModel = require('../model/company.model');
const { GoogleGenAI } = require('@google/genai');
const connectToDB = require('../config/database');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function seedDatabase() {
    try {
        await connectToDB();
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data to avoid duplicates
        await companyEmbeddingModel.deleteMany({});
        console.log("Cleared existing company embeddings.");

        // Read company data JSON
        const dataPath = path.join(__dirname, 'companydata.json');
        const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        const documentsToInsert = [];

        for (const item of jsonData) {
            // Generate a 512-dimensional vector for MongoDB vector search.
            const response = await ai.models.embedContent({
                model: 'gemini-embedding-001',
                contents: item.text,
                config: {
                    outputDimensionality: 512
                }
            });

            const embedding = response.embeddings[0].values;

            documentsToInsert.push({
                companyName: item.companyName,
                text: item.text,
                embedding: embedding
            });
        }

        // Insert all documents into MongoDB collection
        if (documentsToInsert.length > 0) {
            await companyEmbeddingModel.insertMany(documentsToInsert);
            console.log("Successfully seeded company knowledge embeddings into MongoDB!");
        }

    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedDatabase();