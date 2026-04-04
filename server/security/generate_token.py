from datetime import datetime, timedelta
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

import rich

load_dotenv()

SECRET_KEY = os.getenv("SECRET_TOKEN_KEY")
ALGORITHM = "HS256"

# Ye token practically expire nahi hoga (100 saal ke liye)
LONG_LIVED_EXPIRE_DAYS = 30

def create_long_lived_token(data: dict) -> str:
    """Create a long-lived JWT token (practically never expires)."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=LONG_LIVED_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict | None:
    """Decode and validate a JWT token."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None