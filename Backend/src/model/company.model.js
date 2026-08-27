const mongoose = require('mongoose');

const companyEmbeddingSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true }
}, {
    collection: 'company_embeddings'
});

const companyEmbeddingModel = mongoose.models.CompanyEmbedding
    || mongoose.model('CompanyEmbedding', companyEmbeddingSchema);

module.exports = companyEmbeddingModel;