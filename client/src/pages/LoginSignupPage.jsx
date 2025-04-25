import React, { useState } from "react";
import "../styles/LoginSignupPage.css";

const LoginSignupPage = () => {
    const [formType, setFormType] = useState("");

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
                    <form>
                        <h1>Login</h1>
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <button>Login</button>
                        <div className="sign-up-link">
                            <p>
                                Don't have an account?{" "}
                                <a onClick={signUpLinkClicked}>Sign up</a>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="authentication-form sign-up">
                    <form>
                        <h1>Sign Up</h1>
                        <input type="text" placeholder="Username" />
                        <input type="text" placeholder="Full Name" />
                        <input type="email" placeholder="E-Mail" />
                        <input type="password" placeholder="Password" />
                        <input type="password" placeholder="Confirm Password" />
                        <button>Sign Up</button>
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
