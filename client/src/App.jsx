import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginSignupPage from "./pages/LoginSignupPage";
import { useQuery } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/SideBar";
import ProfilePage from "./pages/ProfilePage";
import FeatureBar from "./components/FeatureBar";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/auth/user");
                const data = await res.json();
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

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="app">
            {authUser && <Sidebar />}
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
                <Route
                    path="/profile/:username"
                    element={
                        authUser ? <ProfilePage /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="*"
                    element={
                        authUser ? <NotFoundPage /> : <Navigate to="/login" />
                    }
                />
            </Routes>
            {authUser && <FeatureBar />}
        </div>
    );
}

export default App;
