import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'; // import logged in user from auth context
import '../css/registerLogin.css' // import css for styling
import axios from 'axios' // import axios for calling APIs

// Login page for user authentication
function Login() {
    const { user, setUser } = useAuth(); // get logged in user
    const navigate = useNavigate();
    const [form, setForm] = useState({ // controlled input for form fields
        email: '',
        password: ''
    });

    // Handle input changes
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle login form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents page from reloading on submission
        
        // TODO: handle login logic
        try {
            const { data } = await axios.post(
                "http://localhost:5100/api/login", // call post method on API
                form,
                {
                    headers: {
                        "Content-Type": "application/json" // send content type in header
                    }
                }
            );

            // Backend response includes: _id, username, email, avatar, token, maybe channel
            setUser(data); // This will trigger useEffect to store it in localStorage
            navigate("/"); // navigate to homepage after login

        } catch (err) {

            // if any error is caught send it to console and alert
            console.error("❌ Login failed:", err.response?.data?.message || err.message);
            alert("Login failed: " + (err.response?.data?.message || "Something went wrong"));
        }
    };

    // return JSX
    return (

        // login form
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Sign in</h2>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder='email'
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder='password'
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                />
                <button className="auth-btn" type="submit">Login</button>
                
                {/* sign up page Link */}
                <div className="auth-switch">
                    Don't have an account?{' '}
                    <span className="auth-link" onClick={() => navigate('/register')}>Sign up</span>
                </div>
            </form>
        </div>
    )
}

export default Login; // export login page component