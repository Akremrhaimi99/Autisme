import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [user, setUser] = useState(null); // Stocke le username de l'utilisateur connecté
    const navigate = useNavigate();

    // Vérifier si l'utilisateur est connecté au chargement de la page
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("access_token");  // Récupérer le token
            if (token) {
                try {
                    const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
                        headers: { Authorization: `Bearer ${token}` },  // Envoi du token dans les headers
                    });
                    setUser(response.data.username);  // Récupérer le nom d'utilisateur
                } catch (error) {
                    console.error("Erreur d'authentification :", error);
                    localStorage.removeItem("access_token");  // Supprimer le token invalide
                    localStorage.removeItem("refresh_token");
                    setUser(null);  // Réinitialiser l'utilisateur
                }
            }
        };
        checkAuth();
    }, []);  // Ce hook s'exécute une seule fois au montage du composant

    // Fonction de connexion
    const handleLogin = () => {
        navigate("/signin");  // Redirige vers la page de connexion
    };

    // Fonction d'inscription
    const handleRegister = () => {
        navigate("/signup");  // Redirige vers la page d'inscription
    };

    // Fonction de déconnexion
    const handleLogout = async () => {
        const token = localStorage.getItem("access_token"); // Récupérer le token d'accès
        const refreshToken = localStorage.getItem("refresh_token"); // Récupérer le refresh token
    
        if (refreshToken) {
            try {
                const response = await axios.post("http://127.0.0.1:8000/api/signout/", 
                    { refresh: refreshToken },  // Assure-toi d'envoyer le refresh token ici
                    {
                        headers: {
                            Authorization: `Bearer ${token}`  // Envoi du token d'accès dans l'en-tête
                        }
                    }
                );
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                setUser(null);
                navigate("/signin");
            } catch (error) {
                console.error("Erreur lors de la déconnexion :", error);
            }
        }
    };
    

    return (
        <div>
            <h1>Bienvenue {user ? user : "sur notre site"} !</h1>
            {user ? (
                <button onClick={handleLogout}>Déconnexion</button>  // Afficher le bouton de déconnexion si l'utilisateur est connecté
            ) : (
                <>
                    <button onClick={handleLogin}>Connexion</button>  
                    <button onClick={handleRegister}>S'inscrire</button> 
                </>
            )}
        </div>
    );
};

export default Home;
