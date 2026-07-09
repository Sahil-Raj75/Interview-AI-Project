import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

const generateInterviewReport = async ({ resumeFile, selfDescription, jobDescription }) => {

    const formData = new FormData()
    formData.append("resume", resumeFile)
    formData.append("selfDescription", selfDescription)
    formData.append("jobDescription", jobDescription)

    const response = await api.post('/api/interview/generate', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data;
}

const getAllInterviewReports = async () => {
    const response = await api.get('/api/interview/reports')

    return response.data;
}

const getInterviewReportById = async => {
    const response = await api.get('/api/interview/report/:id')

    return response.data;
}

export default { generateInterviewReport, getAllInterviewReports, getInterviewReportById }