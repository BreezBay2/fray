import React, { useState } from "react";
import "../styles/LoginSignupPage.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginSignupPage = () => {
    const [formType, setFormType] = useState("");
    const [loginFormData, setLoginFormData] = useState({
        username: "",
        password: "",
    });
    const [signUpFormData, setSignUpFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const queryClient = useQueryClient();

    const {
        mutate: login,
        isPending: loginPending,
        isError: loginErrorFound,
        error: loginError,
    } = useMutation({
        mutationFn: async ({ username, password }) => {
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to login.");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const {
        mutate: signup,
        isPending: signupPending,
        isError: signupErrorFound,
        error: signupError,
    } = useMutation({
        mutationFn: async ({
            username,
            fullname,
            email,
            password,
            confirmPassword,
        }) => {
            try {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username,
                        fullname,
                        email,
                        password,
                        confirmPassword,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to create account.");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        login(loginFormData);
    };

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        signup(signUpFormData);
    };

    const handleLoginInputChange = (e) => {
        setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
    };

    const handleSignUpInputChange = (e) => {
        setSignUpFormData({
            ...signUpFormData,
            [e.target.name]: e.target.value,
        });
    };

    const signUpLinkClicked = () => {
        setFormType(" active");
    };

    const loginLinkClicked = () => {
        setFormType("");
    };

    return (
        <div className="authentication-page">
            <div className={`authentication-container${formType}`}>
                <div className="authentication-form login">
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Login</h1>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={loginFormData.username}
                            onChange={handleLoginInputChange}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={loginFormData.password}
                            onChange={handleLoginInputChange}
                        />
                        <button>{loginPending ? "Loading..." : "Login"}</button>
                        {loginErrorFound && (
                            <p className="error-message">
                                {loginError.message}
                            </p>
                        )}
                        <div className="sign-up-link">
                            <p>
                                Don't have an account?{" "}
                                <a onClick={signUpLinkClicked}>Sign up</a>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="authentication-form sign-up">
                    <form onSubmit={handleSignUpSubmit}>
                        <h1>Sign Up</h1>
                        <input
                            type="email"
                            placeholder="E-Mail"
                            name="email"
                            value={signUpFormData.email}
                            onChange={handleSignUpInputChange}
                        />
                        <div className="sign-up-names">
                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={signUpFormData.username}
                                onChange={handleSignUpInputChange}
                            />
                            <input
                                type="text"
                                placeholder="Full Name"
                                name="fullname"
                                value={signUpFormData.fullname}
                                onChange={handleSignUpInputChange}
                            />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={signUpFormData.password}
                            onChange={handleSignUpInputChange}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={signUpFormData.confirmPassword}
                            onChange={handleSignUpInputChange}
                        />
                        <button>
                            {signupPending ? "Loading..." : "Sign Up"}
                        </button>
                        {signupErrorFound && (
                            <p className="error-message">
                                {signupError.message}
                            </p>
                        )}
                        <div className="sign-up-link">
                            <p>
                                Already have an account?{" "}
                                <a onClick={loginLinkClicked}>Login</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginSignupPage;
