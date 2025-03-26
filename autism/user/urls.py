from django.urls import path
from .views import SignupView, SigninView, SignoutView, ProfileView


urlpatterns = [
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/signin/', SigninView.as_view(), name='signin'),
    path('api/signout/', SignoutView.as_view(), name='signout'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
]