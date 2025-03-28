from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken,BlacklistedToken
from rest_framework_simplejwt.exceptions import TokenError


# Création d'un utilisateur (inscription)
class SignupView(APIView):
    permission_classes = [AllowAny]  # Permet l'accès à tous les utilisateurs
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username, email=email).exists() :
            return Response({"error": "Nom d'utilisateur déjà pris"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "Utilisateur créé avec succès"}, status=201)


# Authentification de l'utilisateur avec JWT
class SigninView(APIView):
    permission_classes = [AllowAny]  # Permet à tout le monde d'accéder à cette vue
    def post(self, request):
        # Récupération des identifiants depuis la requête
        username = request.data.get('username')
        password = request.data.get('password')

        # Authentification de l'utilisateur avec les identifiants
        user = authenticate(username=username, password=password)
        
        if user:
            # Si l'utilisateur est valide, génération des tokens JWT
            refresh = RefreshToken.for_user(user)
            # Retourne les tokens dans la réponse
            return Response({
                "message": "Connexion réussie",
                "access": str(refresh.access_token),  # Token pour les requêtes authentifiées
                "refresh": str(refresh)               # Token pour rafraîchir l'access token
            }, status=status.HTTP_200_OK)
        
        # Si l'authentification échoue
        return Response({"message": "Identifiants invalides"}, status=status.HTTP_400_BAD_REQUEST)


# Déconnexion de l'utilisateur (invalidation du refresh token)
class SignoutView(APIView):
    permission_classes = [IsAuthenticated]  # Seul un utilisateur authentifié peut se déconnecter

    def post(self, request):
        refresh_token = request.data.get("refresh")  # Récupérer le refresh token du corps de la requête

        if not refresh_token:
            return Response({"message": "Refresh token manquant"}, status=400)

        try:
             # Décoder le refresh token pour obtenir un token valide
            token = RefreshToken(refresh_token)

            # Vérifier si le refresh token est un OutstandingToken
            outstanding_token = OutstandingToken.objects.filter(token=token).first()

            if not outstanding_token:
                return Response({"message": "Token invalide"}, status=400)

            # Ajouter le token à la blacklist
            BlacklistedToken.objects.create(token=outstanding_token)
            return Response({"message": "Déconnexion réussie"}, status=200)

        except TokenError as e:
            return Response({"message": "Erreur de déconnexion", "error": str(e)}, status=400)


# Vue protégée nécessitant un authentification via JWT
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Nécessite un token valide pour accéder à la vue
    authentication_classes = [JWTAuthentication]  # Utilise JWT pour l'authentification

    def get(self, request):
        """
        Retourne le username de l'utilisateur authentifié
        Le token JWT doit être fourni dans l'en-tête Authorization: Bearer <access_token>
        """
        return Response({
            "username": request.user.username,
            "message": "Vous êtes authentifié avec JWT"
        }, status=status.HTTP_200_OK)
