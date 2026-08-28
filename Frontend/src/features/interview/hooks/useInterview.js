import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import { generateInterviewReport, getAllInterviewReports, getInterviewReportById, generateResumePdf, logoutUser } from "../services/interview.api"


export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be use in a InterviewProvider");
    }

    const { loading, setloading, report, setreport, reports, setreports } = context

    const generateReport = async ({ resumeFile, selfDescription, jobDescription, companyPrompt }) => {
        setloading(true)
        let response = null
        try {
            // generateInterviewReport Mera Khuda api func. hai interview.api me tho Jo Hum return Karwaenge O wahi lake dega response me
            response = await generateInterviewReport({ resumeFile, selfDescription, jobDescription, companyPrompt })
            // generateInterviewReport Return the whole response which first comes form the backend then Axios ke baad yaha per aa rha tho response.data.data use krna hoga actual report ke liye.
            const reportData = response?.data?.data  // pehle .data axios ka response payload read kr rha jisme backend ka payload hai data ke andara tho .data use to read the actual report data.
            setreport(reportData)
            return reportData
        } catch (error) {
            console.error(error);
            return null
        } finally {
            setloading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setloading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setreport(response.interviewReport)
        } catch (error) {
            console.error(error);
        } finally {
            setloading(false)
        }
        return response?.interviewReport
    }

    const getAllReports = async () => {
        setloading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setreports(response.reports)
        } catch (error) {
            console.error(error);
        } finally {
            setloading(false)
        }
        return response?.reports
    }

    const getResumePdf = async (interviewId) => {
        setloading(true);
        let response = null;
        try {
            response = await generateResumePdf(interviewId)
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setloading(false);
        }
    }

    const handleLogout = async () => {
        setloading(true);
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout failed:", error);
        }finally{
            setloading(false);
        }
    }

    return { loading, report, reports, generateReport, getReportById, getAllReports, getResumePdf, handleLogout }
}
