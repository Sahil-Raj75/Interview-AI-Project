import { createContext, useState, useEffect } from "react";
import { getme } from "./services/auth.api";
export const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)

    useEffect(() => {
        const getSetUser = async () => {
            try {
                const data = await getme();
                if (data?.user) {
                    setuser(data.user)
                }
            }
            catch (error) {
                return error;
            }
            finally {
                setloading(false)
            }
        }
        getSetUser();
    }, [])
    return (
        <AuthContext.Provider value={{ user, setuser, loading, setloading }}>
            {children}
        </AuthContext.Provider>
    )
}