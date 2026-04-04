from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import rich
from sqlmodel import create_engine, Session, select
import os
from dotenv import load_dotenv
from Typeschema.compType import AddCompSchema
from models import Campaign, Company

# --- LOAD ENV VARIABLES ---
load_dotenv()

# --- DATABASE CONNECTION STRING ---
NEON_DB_CONNECTION = os.getenv("NEON_DB_CONNECTION")
engine  = create_engine(NEON_DB_CONNECTION)

@dataclass
class CompService:

    def create_comp(self, data: AddCompSchema) -> dict:
        """Create a new comp and return its details if successful."""
        try:
            with Session(engine) as session:
                new_comp = Company(
                    client_name=data.client_name,
                    status=data.status,
                    budget=data.budget,
                    spend=data.spend,
                    deleted_at=None
                )

                session.add(new_comp)
                session.commit()
                session.refresh(new_comp)
                
                return {"status": "success", "message": "Comp created successfully"}
        except Exception as e:
            rich.print(f"Error during comp creation: {e}")
            return {"status": "error", "message": "An error occurred during comp creation"}

    def get_comp(self, comp_id: Optional[int] = None) -> dict| list:
        try:
            with Session(engine) as session:
                if comp_id:
                    statement = select(Company).where(Company.id == comp_id, Company.deleted_at == None)
                    comp = session.exec(statement).first()
                    if comp:
                        return comp.model_dump()
                    else:
                        return {"status": "error", "message": "Comp not found"}
                else:
                    statement = select(Company).where(Company.deleted_at == None)
                    comps = session.exec(statement).all()
                    return [c.model_dump() for c in comps][::-1]  # Latest first
        except Exception as e:
            rich.print(f"Error during comp retrieval: {e}")
            return {"status": "error", "message": "An error occurred during comp retrieval"}
        
    def update_comp(self, comp_id: int, data: AddCompSchema) -> dict:
        try:
            with Session(engine) as session:
                statement = select(Company).where(Company.id == comp_id, Company.deleted_at == None)
                comp = session.exec(statement).first()
                if comp:
                    comp.client_name = data.client_name
                    comp.status = data.status
                    comp.budget = data.budget
                    comp.spend = data.spend
                    
                    session.add(comp)
                    session.commit()
                    return {"status": "success", "message": "Comp updated successfully"}
                else:
                    return {"status": "error", "message": "Comp not found"}
        except Exception as e:
            rich.print(f"Error during comp update: {e}")
            return {"status": "error", "message": "An error occurred during comp update"}
    
    def delete_comp(self, comp_id: int) -> dict:
        try:
            with Session(engine) as session:
                statement = select(Company).where(Company.id == comp_id, Company.deleted_at == None)
                comp = session.exec(statement).first()
                if comp:
                    current_time = datetime.utcnow()
                    
                    campaigns_statement = select(Campaign).where(
                        Campaign.company_id == comp_id, 
                        Campaign.deleted_at == None
                    )
                    related_campaigns = session.exec(campaigns_statement).all()

                    for campaign in related_campaigns:
                        campaign.deleted_at = current_time
                        session.add(campaign)

                    comp.deleted_at = current_time  # Soft delete by setting deleted_at

                    session.add(comp)
                    session.commit()

                    return {"status": "success", "message": f"Company and {len(related_campaigns)} associated campaigns deleted successfully"}
                else:
                    return {"status": "error", "message": "Comp not found"}
        except Exception as e:
            rich.print(f"Error during comp deletion: {e}")
            return {"status": "error", "message": "An error occurred during comp deletion"}