import { useState } from "react"
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const API_URL = import.meta.env.VITE_API_URL;

    const naviagte = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);



    async function handleLogin() {
        try {
            setIsLoading(true)
            setError("");
            const response = await fetch(`${API_URL}/api/auth/log-in`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed.");
                return;
            }

            localStorage.setItem("id", String(data.user.id));
            localStorage.setItem("name", data.user.name)
            localStorage.setItem("email", data.user.email)
            localStorage.setItem("token", data.token)
            toast.success(data.message)
            naviagte("/board")

        }
        catch (error) {
            setError("Unable to connect to the server.");
        }
        finally{
            setIsLoading(false)
        }
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col gap-2 w-full max-w-100">
                    <input type="email" disabled={isLoading} className="input-default" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" disabled={isLoading} className="input-default" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}
                    <button className="button-positive" disabled={isLoading} onClick={() => handleLogin()}>
                        {isLoading? <Loader size={15} className="animate-spin" />: "Login"}
                    </button>
                </div>
            </div>
        </>
    )
}