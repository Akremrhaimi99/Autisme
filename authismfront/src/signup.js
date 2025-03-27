import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";



const Signup = () => {
    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    // État pour les messages de feedback à l'utilisateur
    const [message, setMessage] = useState('');
    // État pour gérer l'affichage du loader pendant les requêtes
    const [isLoading, setIsLoading] = useState(false);
    // Hook pour la navigation entre les pages
    const navigate = useNavigate();

    /**
     * Gère les changements dans les champs du formulaire
     * @param {Object} e - L'événement de changement
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Soumet le formulaire d'inscription
     * @param {Object} e - L'événement de soumission
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        setIsLoading(true); // Active l'état de chargement
        setMessage(''); // Réinitialise les messages d'erreur

        try {
            // Envoie les données d'inscription au backend
            const response = await axios.post('http://127.0.0.1:8000/api/signup/', formData);
            
            // Affiche le message de succès du backend
            setMessage(response.data.message);
            
            // Redirige vers la page de connexion après 2 secondes
            setTimeout(() => {
                navigate('/signin');
            }, 1000);
            
        } catch (error) {
            // Gestion des erreurs avec différents formats de réponse possibles
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Email ou username déjà existant';
            setMessage(errorMessage);
        } finally {
            // Désactive le loader quoi qu'il arrive
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h1>Inscription</h1>
            
            {/* Formulaire d'inscription */}
            <form onSubmit={handleSubmit}>
                {/* Champ Nom d'utilisateur */}
                <div className="form-group">
                    <label>Nom d'utilisateur :</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        minLength="3"
                    />
                </div>
                
                {/* Champ Email */}
                <div className="form-group">
                    <label>Email :</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                {/* Champ Mot de passe */}
                <div className="form-group">
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />
                </div>
                
                {/* Bouton de soumission */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={isLoading ? 'loading' : ''}
                >
                    {isLoading ? 'Traitement...' : 'S\'inscrire'}
                </button>
            </form>
            
            {/* Affichage des messages (succès ou erreur) */}
            {message && (
                <p className={`message ${message.includes('déjà') ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Signup;