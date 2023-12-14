import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import Sidebar from "./components/sidebar/Sidebar";
import ChatPage from "./pages/ChatPage";
import Patients from "./pages/Patients";
import GlucoseAverages from "./components/Statics/GlucoseAverange";
import PatientPage from "./pages/PatientPage";
import ActivityCharts from "./components/Statics/ActivityCharts";
import ChartsPage from "./pages/ChartsPage";
function App() {
    const { currentUser } = useContext(AuthContext);

    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/login" />;
        }

        return children;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/patients" element={<PatientPage />} />
                <Route path="/statistics" element={<ChartsPage />} />

                {/* Sidebar dla zalogowanego użytkownika */}
                {currentUser && (
                    <Route
                        path="/"
                        element={
                            <Sidebar>
                                <Route
                                    index
                                    element={
                                        <ProtectedRoute>
                                            <Route
                                                path="dashboard"
                                                element={<App user={currentUser} />}
                                            />
                                        </ProtectedRoute>
                                    }
                                />
                            </Sidebar>
                        }
                    />
                )}

                {/* Niezalogowany użytkownik */}
                {!currentUser && (
                    <Route
                        path="/*"
                        element={<Navigate to="/login" />} // Przekieruj niezalogowanego użytkownika do logowania
                    />
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
