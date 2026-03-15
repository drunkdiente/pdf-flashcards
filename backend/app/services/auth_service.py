from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token
from app.schemas import UserAuth

class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def authenticate_user(self, email: str, password: str):
        user = self.user_repository.get_by_email(email)
        if not user or not verify_password(password, user["hashed_password"]):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        return user

    def register_user(self, user_data: UserAuth):
        if self.user_repository.email_exists(user_data.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_pw = get_password_hash(user_data.password)
        # Note: In a real DB, ID generation is handled by the DB. 
        # Here we do a simple len() check for the fake DB.
        new_user = {
            "id": str(len(self.user_repository.get_all()) + 1), 
            "email": user_data.email,
            "hashed_password": hashed_pw,
            "role": "user"
        }
        self.user_repository.create(new_user)
        return new_user

    def refresh_token(self, token: str):
        payload = decode_token(token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
        user_email = payload.get("sub")
        user = self.user_repository.get_by_email(user_email)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return create_access_token(subject=user_email), user

    def get_current_user_from_token(self, token: str):
        if self.user_repository.is_blacklisted(token):
            raise HTTPException(status_code=401, detail="Token revoked")
        
        payload = decode_token(token)
        if not payload or payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        user_email = payload.get("sub")
        user = self.user_repository.get_by_email(user_email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        return user

    def logout(self, token: str):
        self.user_repository.add_to_blacklist(token)
