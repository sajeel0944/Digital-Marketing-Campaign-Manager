import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import rich
from Typeschema.authType import AuthSchema
from auth.auth import AuthService
from fastapi import APIRouter

Auth_Rou =  APIRouter(prefix="/auth")

# --- 1. Authentication Routes ---

@Auth_Rou.post("/signup")
def signup(payload: AuthSchema):
    try:
        auth_service = AuthService()
        return auth_service.signup(payload.email, payload.password)
    except Exception as e:
        rich.print(f"Error in /signup route: {e}")
        return {"status": "error", "message": "An error occurred during signup"}

@Auth_Rou.post("/login")
def login(payload: AuthSchema):
    try:
        auth_service = AuthService()
        return auth_service.login(payload.email, payload.password)
    except Exception as e:
        rich.print(f"Error in /login route: {e}")
        return {"status": "error", "message": "An error occurred during login"}
