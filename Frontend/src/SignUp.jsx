import { useState } from "react";

function Signup({ setShowLogin }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignup = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        try {

            const response = await fetch("http://localhost:2000/api/auth/signup", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    email,
                    password
                })

            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            setSuccess("Account created successfully.");

            setTimeout(() => {
                setShowLogin(true);
            }, 1000);

        } catch (error) {

            console.log(error);
            setError("Unable to signup.");

        }

    };

    return (

        <div className="login-container">

            <h1>Create Account</h1>

            <form onSubmit={handleSignup}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

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
                    Sign Up
                </button>

            </form>

            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <p>
                Already have an account?
                <button onClick={() => setShowLogin(true)}>
                    Login
                </button>
            </p>

        </div>

    );

}

export default Signup;