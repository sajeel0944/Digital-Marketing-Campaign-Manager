from datetime import datetime
from typing import List, Optional
from sqlmodel import JSON, Column, Relationship, SQLModel, Field

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password: str  # Hashed password save hoga
    

class Company(SQLModel, table=True):
    __tablename__ = "company"
    id: Optional[int] = Field(default=None, primary_key=True)
    client_name: str
    status: str = Field(default="active") # active, paused
    budget: float
    spend: float = Field(default=0.0)
    
    # Soft Delete: Ismein date hogi to delete mana jayega
    deleted_at: Optional[datetime] = Field(default=None)
    
    notifications: List["Notification"] = Relationship(back_populates="company")
    campaigns: List["Campaign"] = Relationship(back_populates="company")

class Campaign(SQLModel, table=True):
    __tablename__ = "campaigns"
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: int = Field(foreign_key="company.id")
    campaign_title: str
    headline: List[str] = Field(sa_column=Column(JSON))
    budget: float
    tone_guide: str
    channel_allocation: List[dict[str, float]] = Field(sa_column=Column(JSON))
    visual_direction: str
    tag: List[str] = Field(sa_column=Column(JSON))
    description_about_brirf: str
    deleted_at: Optional[datetime] = Field(default=None)
    
    company: Company = Relationship(back_populates="campaigns")


class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: int = Field(foreign_key="company.id")
    message: str
    read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    company: Company = Relationship(back_populates="notifications")