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
        try {
            const response = await generateInterviewReport({ resumeFile, selfDescription, jobDescription })
            setreport(response.data)
        } catch (error) {
            console.error();
        } finally {
            setloading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setloading(true)
        try {
            const response = await getInterviewReportById(interviewId)
            setreport(response.data)
        } catch (error) {
            console.error();
        } finally {
            setloading(false)
        }
    }

    const getAllReports = async () => {
        setloading(true)
        try {
            const response = await getAllInterviewReports()
            setreport(response.data)
        } catch (error) {
            console.error();
        } finally {
            setloading(false)
        }
    }

    return { loading, report, reports, generateReport, getReportById, getAllReports }
}
