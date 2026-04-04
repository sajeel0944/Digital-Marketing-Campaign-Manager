from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import rich
from sqlmodel import create_engine, Session, select
import os
from dotenv import load_dotenv

from Typeschema.AiBrief import BriefSchema
from models import Campaign, Company

# --- LOAD ENV VARIABLES ---
load_dotenv()

# --- DATABASE CONNECTION STRING ---
NEON_DB_CONNECTION = os.getenv("NEON_DB_CONNECTION")
engine  = create_engine(NEON_DB_CONNECTION)

@dataclass
class CampaignService:
    def create_campaign(self, company_id: int, data: BriefSchema) -> dict:
        """Create a new campaign brief and deduct budget from company."""
        try:
            with Session(engine) as session:
                # 1. Check karein ke Company exist karti hai ya nahi
                statement = select(Company).where(Company.id == company_id, Company.deleted_at == None)
                get_company = session.exec(statement).first()

                if not get_company:
                    return {"status": "error", "message": "Company not found or deleted"}

                # 2. Budget Check Karein
                # Calculation: Kya Total Budget mein se itne paise bache hain?
                remaining_balance = get_company.budget - get_company.spend
                
                if remaining_balance < data.budget:
                    return {
                        "status": "error", 
                        "message": f"Insufficient budget. Available: {remaining_balance}, Required: {data.budget}"
                    }

                # 3. Campaign Object Create Karein
                new_brief = Campaign(
                    company_id=company_id,
                    campaign_title=data.campaign_title,
                    headline=data.headline,
                    budget=data.budget, # Campaign ka apna budget
                    tone_guide=data.tone_guide,
                    channel_allocation=data.channel_allocation,
                    visual_direction=data.visual_direction,
                    tag=data.tag,
                    description_about_brirf=data.description_about_brirf
                )

                # 4. Company ka Spend Update Karein
                # Purane spend mein campaign ka budget plus kardein
                get_company.spend += data.budget

                # 5. Database mein Save Karein
                session.add(new_brief)
                session.add(get_company) # Company update ho rahi hai
                
                session.commit()
                
                # Refresh karein taake ID wagaira mil jaye
                session.refresh(new_brief)
                
                return {
                    "status": "success", 
                    "message": "Campaign brief created and budget deducted successfully. remaining_company_balance: " + str(get_company.budget - get_company.spend),
                }

        except Exception as e:
            # Commit se pehle error aaye to session rollback automatically hota hai context manager mein
            rich.print(f"[bold red]Error during brief creation:[/bold red] {e}")
            return {"status": "error", "message": str(e)}
        
    def get_all_company_campaigns(self, company_id: Optional[int] = None) -> list:
        try:
            with Session(engine) as session:
                if company_id:
                    statement = select(Campaign).where(Campaign.company_id == company_id, Campaign.deleted_at == None)
                else:
                    statement = select(Campaign).where(Campaign.deleted_at == None)
                    
                campaigns = session.exec(statement).all()
                return [c.model_dump() for c in campaigns][::-1]  # Latest first
        except Exception as e:
            rich.print(f"[red]Fetch Error:[/red] {e}")
            return []
        
    def update_campaign(self, id: int, data: BriefSchema) -> dict:
        try:
            with Session(engine) as session:
                # 1. Purani Campaign dhundein
                campaign = session.exec(select(Campaign).where(Campaign.id == id, Campaign.deleted_at == None)).first()
                if not campaign:
                    return {"status": "error", "message": "Campaign not found"}

                # 2. Company check karein taake budget adjust ho sake
                company = session.exec(select(Company).where(Company.id == campaign.company_id)).first()
                
                # 3. Budget Adjustment Logic
                # Naya difference nikaalein (New Budget - Old Budget)
                budget_diff = data.budget - campaign.budget
                
                # Agar budget barh raha hai, to check karein ke company ke paas extra paise hain?
                if budget_diff > 0:
                    available_balance = company.budget - company.spend
                    if available_balance < budget_diff:
                        return {"status": "error", "message": "Insufficient additional budget in company"}

                # 4. Data Update Karein
                campaign.campaign_title = data.campaign_title
                campaign.headline = data.headline
                campaign.tone_guide = data.tone_guide
                campaign.channel_allocation = data.channel_allocation
                campaign.visual_direction = data.visual_direction
                campaign.tag = data.tag
                campaign.description_about_brirf = data.description_about_brirf
                
                # Budget update aur Company spend update
                campaign.budget = data.budget
                company.spend += budget_diff

                session.add(campaign)
                session.add(company)
                session.commit()
                
                return {"status": "success", "message": "Campaign and budget updated successfully"}
        except Exception as e:
            rich.print(f"[red]Update Error:[/red] {e}")
            return {"status": "error", "message": str(e)}
        
    def delete_campaign(self, id: int) -> dict:
        try:
            with Session(engine) as session:
                # 1. Campaign dhundein
                campaign = session.exec(select(Campaign).where(Campaign.id == id, Campaign.deleted_at == None)).first()
                if not campaign:
                    return {"status": "error", "message": "Campaign not found or already deleted"}

                # 2. Company ka spend wapis kam karein (Refund)
                company = session.exec(select(Company).where(Company.id == campaign.company_id)).first()
                if company:
                    company.spend -= campaign.budget
                    session.add(company)

                # 3. Soft Delete: Sirf timestamp add karein
                campaign.deleted_at = datetime.utcnow()
                session.add(campaign)
                
                session.commit()
                return {"status": "success", "message": "Campaign deleted and budget refunded"}
        except Exception as e:
            rich.print(f"[red]Delete Error:[/red] {e}")
            return {"status": "error", "message": str(e)}