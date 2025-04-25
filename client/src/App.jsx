import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginSignupPage from "./pages/LoginSignupPage";
import { useQuery } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";

function App() {
    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/auth/user");
                const data = res.json();
                if (data.error) {
                    return null;
                }

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong.");
                }

                console.log("User: ", data);
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        retry: false,
    });

    console.log(authUser);

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={authUser ? <HomePage /> : <LoginSignupPage />}
                />
                <Route
                    path="/login"
                    element={
                        !authUser ? <LoginSignupPage /> : <Navigate to="/" />
                    }
                />
            </Routes>
        </>
    );
}

export default App;
