import sys
from pathlib import Path
import rich
from dotenv import load_dotenv

# Path setup taake folders sahi se detect hon
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from campaign import CampaignService
from Typeschema.AiBrief import BriefSchema

load_dotenv()

def test_run():
    service = CampaignService()
    rich.print("\n[bold magenta]🚀 Starting Full CRUD Service Test...[/bold magenta]\n")

    # --- 1. CONFIGURATION ---
    company_id = 1  # Ensure karein ke ID 1 database mein exist karti ho
    campaign_id = None # Yeh hum create ke baad save karenge

    # --- 2. CREATE TEST ---
    rich.print("[bold yellow]STEP 1: Testing CREATE...[/bold yellow]")
    mock_brief = BriefSchema(
        campaign_title="Spring Launch 2026",
        headline=["Fast AI Solutions"],
        budget=1000.0,
        tone_guide="Professional",
        channel_allocation=[{"Google Ads": 100.0}],
        visual_direction="Minimalist Blue",
        tag=["ai", "launch"],
        description_about_brirf="Initial testing campaign"
    )

    create_res = service.create_campaign(mock_brief, company_id)
    
    if create_res["status"] == "success":
        # Note: Aapke service mein campaign_id return hona chahiye refresh ke baad
        # Agar return nahi ho raha to hum get_all se nikaal lenge
        rich.print(f"✅ [green]Create Success:[/green] {create_res['message']}")
    else:
        rich.print(f"❌ [red]Create Failed:[/red] {create_res['message']}")
        return

    # --- 3. READ TEST ---
    rich.print("\n[bold yellow]STEP 2: Testing READ (Get All)...[/bold yellow]")
    all_campaigns = service.get_all_company_campaigns(company_id)
    
    if all_campaigns:
        rich.print(f"✅ [green]Read Success:[/green] Found {len(all_campaigns)} campaigns.")
        # Latest campaign ki ID utha rahe hain update/delete ke liye
        campaign_id = all_campaigns[-1]['id'] 
    else:
        rich.print("❌ [red]Read Failed:[/red] No campaigns found.")
        return

    # --- 4. UPDATE TEST ---
    rich.print(f"\n[bold yellow]STEP 3: Testing UPDATE (ID: {campaign_id})...[/bold yellow]")
    # Budget $1000 se barha kar $1500 kar rahe hain
    mock_brief.campaign_title = "Updated Spring Launch"
    mock_brief.budget = 1500.0 
    
    update_res = service.update_campaign(campaign_id, mock_brief)
    
    if update_res["status"] == "success":
        rich.print(f"✅ [green]Update Success:[/green] {update_res['message']}")
    else:
        rich.print(f"❌ [red]Update Failed:[/red] {update_res['message']}")

    # --- 5. DELETE TEST ---
    rich.print(f"\n[bold yellow]STEP 4: Testing DELETE & REFUND (ID: {campaign_id})...[/bold yellow]")
    delete_res = service.delete_campaign(campaign_id)
    
    if delete_res["status"] == "success":
        rich.print(f"✅ [green]Delete Success:[/green] {delete_res['message']}")
    else:
        rich.print(f"❌ [red]Delete Failed:[/red] {delete_res['message']}")

    rich.print("\n[bold magenta]🏁 CRUD Test Sequence Completed![/bold magenta]\n")

if __name__ == "__main__":
    test_run()