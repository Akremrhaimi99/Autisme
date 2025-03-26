from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializer import UserSerializer
from django.contrib.auth import authenticate, login, logout

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
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)  # Crée une session pour l'utilisateur
            return Response({"message": "Connexion réussie"}, status=status.HTTP_200_OK)
        
        return Response({"message": "Identifiants invalides"}, status=status.HTTP_400_BAD_REQUEST)
    


class SignoutView(APIView):
    def post(self, request):
        logout(request)  # Supprime la session
        return Response({"message": "Déconnexion réussie"}, status=status.HTTP_200_OK)






class ProfileView(APIView):
    """ Vérifie si l'utilisateur est connecté """
    def get(self, request):
        if request.user.is_authenticated:
            return Response({"username": request.user.username}, status=status.HTTP_200_OK)
        return Response({"message": "Non connecté"}, status=status.HTTP_401_UNAUTHORIZED)