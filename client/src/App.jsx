import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginSignupPage from "./pages/LoginSignupPage";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LoginSignupPage />} />
            </Routes>
        </>
    );
}

export default App;
