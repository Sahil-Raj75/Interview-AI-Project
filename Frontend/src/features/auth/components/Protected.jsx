import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import '../style/auth.form.scss'
const Protected = ({ children }) => {

    const { loading, user } = useAuth()

    if (loading) {
        return (
            <main className="auth-loading">
                <h1>loading....</h1>
            </main>
        )
    }

    if (!user) {
        return <Navigate to={'/login'} />
    }

    return children
}

export default Protected