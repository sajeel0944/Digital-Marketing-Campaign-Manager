
from typing import Literal
from pydantic import BaseModel

class BriefSchema(BaseModel):
    campaign_title: str
    headline: list[str]
    tone_guide: str
    budget: float
    channel_allocation: list[dict[str, float]]
    visual_direction: str
    tag: list[str]
    description_about_brirf: str

class AiBriefSchema(BaseModel):
    name: str
    industry: str
    website: str
    campaign_objective: Literal["awareness", "consideration", "conversion"]
    target_audience: str
    budget: float
    tone: Literal["formal", "informal", "friendly", "professional", "funny", "luxury"]
    imagery_style: str
    do_and_dont: str