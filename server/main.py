import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
import logging

from routes.agentRou import Brief_Rou
from routes.authRou import Auth_Rou
from routes.campaignRou import Campaign_Rou
from routes.compRou import Comp_Rou
from routes.notificationRou import Router_Notification, check_budget_and_notify
from slowapi.util import get_remote_address
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# --- Load environment variables ---

load_dotenv()  

# --- Configure logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', datefmt='%d-%m-%Y %H:%M:%S')

# --- Initialize rate limiter ---
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

# ----- Lifespan event handlers for startup and shutdown ------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code here (e.g., connect to database, initialize resources)
    logging.info("✅ Starting up the application...")
    
    # 🚀 Start background task for checking budget notifications
    background_task = asyncio.create_task(check_budget_and_notify())
    
    yield
    
    # Shutdown code here (e.g., close database connections, clean up resources)
    logging.info("❌ Shutting down the application...")
    background_task.cancel()

# --- Initialize FastAPI app with lifespan event handlers ---
app = FastAPI(lifespan=lifespan)

# --- Attach rate limiter to the app and set up exception handler for rate limit exceeded ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------------------------------------------------

# Build allowed origins list safely (avoid None values and allow runtime override)
client_url = os.getenv("CLIENT_URL") or os.getenv("CLIET_URL")
allowed_origins = []

if client_url:
    allowed_origins.append(client_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] to allow all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------- Middleware for Secret API key authentication ------------------------------------------------------------
    
@app.middleware("http")
async def add_process_time_header(request: Request, call_next) -> JSONResponse:
    try:

        if request.method == "OPTIONS":
            # CORS preflight ke liye allow karo
            return await call_next(request)
        
        secretApikey = os.getenv("BACK_END_SECRET_API_KEY")

        api_api = request.headers.get("X-API-KEY") or request.query_params.get("X_API_KEY")

        if api_api is None:
            return JSONResponse(status_code=401, content={"message": "X-API-KEY header missing"})
        
        if api_api != secretApikey:
            return JSONResponse(status_code=401, content={"message": "Invalid X-API-KEY"})
        
        response = await call_next(request)
        return response
    except Exception as e:
        logging.info(f"[red]Error in API key authentication middleware: {e}[/red]")
        return JSONResponse(status_code=500, content={"message": "Internal server error"})

# ---------------------------------------------- Importing and including API routes ------------------------------------------------------------

app.include_router(Auth_Rou)
app.include_router(Comp_Rou)
app.include_router(Router_Notification)
app.include_router(Brief_Rou)
app.include_router(Campaign_Rou)