import sys
from pathlib import Path

import rich

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from security.generate_token import decode_token

# ---------------------------------------------- Middleware for Token authentication ------------------------------------------------------------

Oauth = OAuth2PasswordBearer(tokenUrl="/login", auto_error=False)

def check_aouthentication_token(request: Request, header_token=Depends(Oauth)):
    try:
        query_token = request.query_params.get("token")

        final_token = None

        # 1️⃣ Header token (normal API)
        if header_token:
            final_token = header_token

        # 2️⃣ Query token (SSE)
        elif query_token:
            final_token = query_token

        if not final_token:
            raise HTTPException(status_code=401, detail="Authentication token missing")

        payload = decode_token(final_token)

        if payload is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")

        return payload  # ✅ return user data

    except Exception as e:
        rich.print(f"Error in token authentication: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")