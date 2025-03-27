from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.
# Create your views here.

class SignupView(APIView):
     def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({"error": "Nom d'utilisateur déjà pris"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "Utilisateur créé avec succès"}, status=201)

class SigninView(APIView):
    """
    Vue pour l'authentification de l'utilisateur avec JWT
    Remplace le système de session par des tokens JWT
    """
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


class SignoutView(APIView):
    """
    Vue pour la déconnexion (invalidation du refresh token)
    Nécessite que l'utilisateur soit authentifié
    """
    permission_classes = [IsAuthenticated]  # Seul un utilisateur authentifié peut se déconnecter

    def post(self, request):
        try:
            # Récupération du refresh token depuis le corps de la requête
            refresh_token = request.data["refresh"]
            
            # Création d'un objet token et ajout à la blacklist
            token = RefreshToken(refresh_token)
            token.blacklist()  # Rend le token inutilisable
            
            return Response({"message": "Déconnexion réussie"}, status=status.HTTP_200_OK)
        except Exception as e:
            # Gestion des erreurs (token manquant ou invalide)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """
    Vue protégée qui nécessite une authentification par JWT
    Retourne des informations sur l'utilisateur connecté
    """
    # Configuration de l'authentification
    permission_classes = [IsAuthenticated]      # Nécessite un token valide
    authentication_classes = [JWTAuthentication] # Utilise JWT pour l'authentification

    def get(self, request):
        """
        Retourne le username de l'utilisateur authentifié
        Le token JWT doit être fourni dans le header:
        Authorization: Bearer <access_token>
        """
        # request.user est disponible grâce au JWT authentication
        return Response({
            "username": request.user.username,
            "message": "Vous êtes authentifié avec JWT"
        }, status=status.HTTP_200_OK)







class ProfileView(APIView):
    """ Vérifie si l'utilisateur est connecté """
    def get(self, request):
        if request.user.is_authenticated:
            return Response({"username": request.user.username}, status=status.HTTP_200_OK)
        return Response({"message": "Non connecté"}, status=status.HTTP_401_UNAUTHORIZED)