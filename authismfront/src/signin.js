import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/signin/', formData);
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error) {
            console.error('Login error', error);
        }
    };

    return (
        <div>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    onChange={handleChange}
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    onChange={handleChange}
                    required 
                />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default Signin;