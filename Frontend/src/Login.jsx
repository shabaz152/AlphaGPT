import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import Signup from "./SignUp.jsx";
import { GoogleLogin } from "@react-oauth/google";

function Login() {

    const { setIsLoggedIn } = useContext(MyContext);

    const [showLogin, setShowLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        console.log("API URL:", import.meta.env.VITE_API_URL);
    }, []);

    if (!showLogin) {
        return <Signup setShowLogin={setShowLogin} />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setIsLoggedIn(true);

        } catch (error) {
            console.error(error);
            setError("Unable to login.");
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {

            console.log(
                "Google API URL:",
                `${import.meta.env.VITE_API_URL}/api/auth/google`
            );

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/google`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: credentialResponse.credential,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setIsLoggedIn(true);

        } catch (error) {
            console.error(error);
            setError("Google login failed.");
        }
    };

    return (
        <div className="login-container">

            <h1>AlphaGPT</h1>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

            <div
                style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                        setError("Google login failed.");
                    }}
                />
            </div>

            {error && (
                <p
                    style={{
                        color: "red",
                        textAlign: "center",
                        marginTop: "15px",
                    }}
                >
                    {error}
                </p>
            )}

            <p
                style={{
                    marginTop: "20px",
                    textAlign: "center",
                }}
            >
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                >
                    Sign Up
                </button>
            </p>

        </div>
    );
}

export default Login;