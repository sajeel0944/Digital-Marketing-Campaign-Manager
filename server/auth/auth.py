from dataclasses import dataclass
from typing import Optional
from sqlmodel import create_engine, Session, select
import os
from dotenv import load_dotenv
from auth.password_hashing import hash_password, verify_password
from models import User
from security.generate_token import create_long_lived_token

# --- LOAD ENV VARIABLES ---
load_dotenv()

# --- DATABASE CONNECTION STRING ---
NEON_DB_CONNECTION = os.getenv("NEON_DB_CONNECTION")
engine  = create_engine(NEON_DB_CONNECTION)

@dataclass
class AuthService:

    def signup(self, email: str, password: str) -> Optional[str]:
        """Register a new user and return a token if successful."""
        try:
            with Session(engine) as session:
                # Check if user already exists
                statement = select(User).where(User.email == email)
                existing_user = session.exec(statement).first()
                
                if existing_user:
                    return {"status": "error", "message": "User already exists"}
                
                # Store hashed password securely
                hashed_password = hash_password(password)
                new_user = User(email=email, password=hashed_password)
                session.add(new_user)
                session.commit()
                session.refresh(new_user)
                
                # Token generate karne ka logic yahan hoga (e.g., JWT)
                token = create_long_lived_token({"user_id": new_user.id, "email": new_user.email})
                return {"status": "success", "message": "User created successfully", "token": token}
        except Exception as e:
            print(f"Error during signup: {e}")
            return {"status": "error", "message": "An error occurred during signup"}

    def login(self, email: str, password: str) -> Optional[str]:
        """Authenticate user and return a token if successful."""
        try:
            with Session(engine) as session:
                statement = select(User).where(User.email == email)
                user = session.exec(statement).first()
                if user and verify_password(password, user.password):
                    # Token generate karne ka logic yahan hoga (e.g., JWT)
                    token = create_long_lived_token({"user_id": user.id, "email": user.email})
                    return {"status": "success", "message": "Login successful", "token": token}
            return {"status": "error", "message": "Invalid email or password"}
        except Exception as e:
            print(f"Error during login: {e}")
            return {"status": "error", "message": "An error occurred during login"}