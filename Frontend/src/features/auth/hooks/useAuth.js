import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getme } from "../services/auth.api.jsx";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setuser, loading, setloading } = context

    const handlelogin = async ({ email, password }) => {
        setloading(true);
        try {
            const data = await login({ email, password })
            setuser(data.user)
        } catch (error) {
            throw new Error("Faild to login");
        }
        finally {
            setloading(false)
        }
    }

    const handleregister = async ({ username, email, password }) => {
        setloading(true)
        try {
            const data = await register({ username, email, password })
            setuser(data.user)
        } catch (error) {
            throw new Error("Faild to register");
        }
        finally {
            setloading(false)
        }
    }

    const handlelogout = async () => {
        setloading(true)
        try {
            const data = await logout()
            setuser(null)
        } catch (error) {
            throw new Error("Faild to logout");
        } finally {
            setloading(false)
        }
    }

    return { user, loading, handlelogin, handleregister, handlelogout }
}