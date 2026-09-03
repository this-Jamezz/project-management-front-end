import { useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

export default function Signup() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSignup() {
        try {
            setIsLoading(true)
            setError("");
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed.");
                return;
            }

            toast.success(data.message)
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
                    <input type="text" disabled={isLoading} className="input-default" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
                    <input type="text" disabled={isLoading} className="input-default" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" disabled={isLoading} className="input-default" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}
                    <button className="button-positive" disabled={isLoading} onClick={() => handleSignup()}>
                        {isLoading? <Loader size={15} className="animate-spin" />: "Signup"}
                    </button>
                </div>

            </div>
        </>
    )
}