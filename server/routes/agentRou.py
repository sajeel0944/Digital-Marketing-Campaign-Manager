from datetime import datetime
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from Agent.assistant import run_agent
from Typeschema.AiBrief import AiBriefSchema
import rich
from fastapi import APIRouter, Depends, HTTPException
from security.deps import check_aouthentication_token

Brief_Rou =  APIRouter(prefix="/agent",  dependencies=[Depends(check_aouthentication_token)])

@Brief_Rou.post("/aibrief")
def create_social_media_content(schema: AiBriefSchema):
    try:
        # Call the agent function with the input schema
        result = run_agent(schema)
        return result
    except Exception as e:
        rich.print(f"Error creating social media content: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while creating social media content")

@Brief_Rou.get("/health", tags=["System"])
def health_check():
    """
    Returns the current status of the AI Agent service and model metadata.
    """
    return {
        "status": "active",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Social Media AI Strategist",
        "model_info": {
            "name": "moonshotai/kimi-k2-instruct-0905",
            "provider": "Groq/Moonshot",
            "status": "online"
        },
        "message": "AI Agents are ready to generate briefs."
    }