import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import { generateInterviewReport, getAllInterviewReports, getInterviewReportById } from "../services/interview.api"


export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be use in a InterviewProvider");
    }

    const { loading, setloading, report, setreport, reports, setreports } = context

    const generateReport = async ({ resumeFile, selfDescription, jobDescription }) => {
        setloading(true)
        let response = null
        try {
            response = await generateInterviewReport({ resumeFile, selfDescription, jobDescription })
            setreport(response.data)
        } catch (error) {
            console.error();
        } finally {
            setloading(false)
        }
        return response.data
    }

    const getReportById = async (interviewId) => {
        setloading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setreport(response.data)
        } catch (error) {
            console.error();
        } finally {
            setloading(false)
        }
        return response.data
    }

    const getAllReports = async () => {
        setloading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setreport(response.data)
        } catch (error) {
            console.error();
        } finally {
            setloading(false)
        }
        return response.data
    }

    return { loading, report, reports, generateReport, getReportById, getAllReports }
}
