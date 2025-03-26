from rest_framework import serializers
from .models import User
from django.contrib import messages
from django.contrib.auth.hashers import make_password

# Serializer pour le modèle User
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()  # Assure-toi d'utiliser get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
            
    def create(self, validated_data):
        email = validated_data.get('email')

        # Vérifier si l'email existe déjà
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Cet email est déjà utilisé."})

        # Créer l'utilisateur avec un mot de passe haché
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=email,
            password=validated_data['password']
        )
        
        return user

    
