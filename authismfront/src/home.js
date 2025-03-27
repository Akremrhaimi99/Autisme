import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Vérifier si l'utilisateur est connecté au chargement de la page
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/profile/", { withCredentials: true });
                setUser(response.data.username);
            } catch (error) {
                setUser(null);
            }
        };
        checkAuth();
    }, []);

    // Fonction de connexion
    const handleLogin = async () => {
        navigate("/signin");  // Redirige vers la page de connexion
    };
    const handleRegister = async () => {
        navigate("/signup");  // Redirige vers la page de register
    };

    // Fonction de déconnexion
    const handleLogout = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/api/signout/", {}, { withCredentials: true });
            setUser(null);  // Supprime l'utilisateur sans changer de page
        } catch (error) {
            console.error("Erreur de déconnexion :", error);
        }
    };

    return (
        <div>
            <h1>Bienvenue {user ? user : "sur notre site"} !</h1>
            {user ? (
                <button onClick={handleLogout}>Déconnexion</button>
            ) : (
                <button onClick={handleLogin}>Connexion</button>,
                <button onClick={handleRegister}>Signup</button>
            )}
        </div>
    );
};

export default Home;
