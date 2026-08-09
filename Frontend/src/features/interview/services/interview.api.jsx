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

    const response = await api.post('/api/interview/generate', formData) // backend return the { "message": "Report Created successfully","data": {...}}
    return response; // so the Axios response puts the actual report at response.data.data;
    // normalize service to return the report directly 
    // so we can also use : { return response.data.data } here after this — return the inner payload directly
}

export const getAllInterviewReports = async () => {
    const response = await api.get('/api/interview/reports')

    return response.data;
}

export const getInterviewReportById = async (id) => {
    const response = await api.get(`/api/interview/report/${id}`)

    return response.data;
}
