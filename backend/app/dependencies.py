from fastapi import Depends
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService

def get_user_repository() -> UserRepository:
    return UserRepository()

def get_auth_service(user_repo: UserRepository = Depends(get_user_repository)) -> AuthService:
    return AuthService(user_repository=user_repo)
