import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null); // Gérer les erreurs
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/signin/", formData);
            const { access, refresh } = response.data;

            // Stocker les tokens dans localStorage
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            navigate("/"); // Rediriger vers Home après connexion
        } catch (error) {
            setError("Identifiants invalides !");
            console.error("Erreur de connexion :", error);
        }
    };

    return (
        <div>
            <h1>Connexion</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default Signin;
