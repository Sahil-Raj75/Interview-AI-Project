import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export const generateInterviewReport = async ({ resumeFile, selfDescription, jobDescription }) => {

    const formData = new FormData()

    formData.append("resume", resumeFile)
    formData.append("selfDescription", selfDescription)
    formData.append("jobDescription", jobDescription)

    const response = await api.post('/api/interview/generate', formData)

    return response.data;
}

export const getAllInterviewReports = async () => {
    const response = await api.get('/api/interview/reports')

    return response.data;
}

export const getInterviewReportById = async () => {
    const response = await api.get('/api/interview/report/:id')

    return response.data;
}
