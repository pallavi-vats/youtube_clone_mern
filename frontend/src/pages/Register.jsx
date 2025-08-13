import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/registerLogin.css' // import css for styling
import axios from 'axios' // import axios for calling APIs

// Register page for new user sign up
function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ // controlled input for form fields
        username: '',
        email: '',
        avatar: '',
        password: ''
    });

    // Handle input changes
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle register form submit
    const handleSubmit = async e => {
        e.preventDefault(); // prevents page from reloading

        // check if the values are not white spaces (validation)
        const username = form.username.trim();
        const email = form.email.trim();
        const password = form.password.trim();
        let avatar = form.avatar.trim();

        // Validate required fields
        if (!username || !email || !password) {
            alert("Please fill in all required fields without empty spaces."); // send alert if white spaces
            return;
        }

        // Auto-generate avatar if blank
        if (!avatar) {
            const initial = username.charAt(0).toUpperCase();
            avatar = `https://placehold.co/40x40.png?text=${initial}`; // username's first letter (intials)
        }

        try {
            const { data } = await axios.post(
                "http://localhost:5100/api/register", // post request on API to create a new user
                { username, email, avatar, password },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            alert("✅ User registered successfully, please login."); // send alert
            navigate("/login"); // navigate to login page

        } catch (err) {

            // if any error is caught, console and alert it.
            console.error("❌ Registration failed:", err.response?.data?.message || err.message);
            alert("Registration failed: " + (err.response?.data?.message || "Something went wrong"));
        }
    };

    // return JSX
    return (

        // registratoin form
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Create your account</h2>

                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder='username'
                    value={form.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                />

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

                <label htmlFor="avatar">Avatar URL (optional)</label>
                <input
                    id="avatar"
                    name="avatar"
                    type="url"
                    placeholder='avatar url'
                    value={form.avatar}
                    onChange={handleChange}
                    autoComplete="photo"
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
                    autoComplete="new-password"
                />

                <button className="auth-btn" type="submit">Register</button>

                {/* link to login page for 'User Experience' */}
                <div className="auth-switch">
                    Already have an account?{' '}
                    <span className="auth-link" onClick={() => navigate('/login')}>Sign in</span>
                </div>
            </form>
        </div>
    )
}

export default Register; // export register page component
