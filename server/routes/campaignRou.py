import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import rich
from fastapi import APIRouter, Depends
from security.deps import check_aouthentication_token
from campaign import CampaignService
from Typeschema.AiBrief import BriefSchema

Campaign_Rou =  APIRouter(prefix="/campaign",  dependencies=[Depends(check_aouthentication_token)])

# --- 1. Campaign Management Routes ---

@Campaign_Rou.post("/{company_id}")
def add_campaign(company_id: int, data: BriefSchema) -> dict:
    try:
        campaign_service = CampaignService()
        return campaign_service.create_campaign(company_id, data)
    except Exception as e:
        rich.print(f"Error in /campaign/add route: {e}")
        return {"status": "error", "message": "An error occurred while adding the campaign"}
    
@Campaign_Rou.get("/{company_id}")
def get_company_campaigns(company_id: int) -> list:
    try:
        campaign_service = CampaignService()
        return campaign_service.get_all_company_campaigns(company_id)
    except Exception as e:
        rich.print(f"Error in /campaign/{company_id} route: {e}")
        return {"status": "error", "message": "An error occurred while fetching company campaigns"}
    
@Campaign_Rou.get("")
def get_all_campaigns() -> list:
    try:
        campaign_service = CampaignService()
        return campaign_service.get_all_company_campaigns()
    except Exception as e:
        rich.print(f"Error in /campaign route: {e}")
        return {"status": "error", "message": "An error occurred while fetching all campaigns"}

@Campaign_Rou.put("/{campaign_id}")
def update_campaign(campaign_id: int, data: BriefSchema) -> dict:
    try:
        campaign_service = CampaignService()
        return campaign_service.update_campaign(campaign_id, data)
    except Exception as e:
        rich.print(f"Error in /campaign/update/{campaign_id} route: {e}")
        return {"status": "error", "message": "An error occurred while updating the campaign"}
    
@Campaign_Rou.delete("/{campaign_id}")
def delete_campaign(campaign_id: int) -> dict:
    try:
        campaign_service = CampaignService()
        return campaign_service.delete_campaign(campaign_id)
    except Exception as e:
        rich.print(f"Error in /campaign/delete/{campaign_id} route: {e}")
        return {"status": "error", "message": "An error occurred while deleting the campaign"}