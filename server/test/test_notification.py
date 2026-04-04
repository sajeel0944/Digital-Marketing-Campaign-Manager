import sys
from pathlib import Path
import rich

# Path setup taake imports kaam karein
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from create_comp import CompService
from notification import NotificationService # Apni file ka sahi naam check karlein
from Typeschema.compType import AddCompSchema

def test_notification_flow():
    comp_service = CompService()
    notif_service = NotificationService()

    rich.print("[bold blue]--- Step 1: Creating a Campaign with 95% Spend ---[/bold blue]")
    
    # Ek aisi campaign banate hain jo alert trigger kare (Spend 4500, Budget 5000 = 90%)
    trigger_data = AddCompSchema(
        client_name="Test User",
        status="active",
        budget=1000.0,
        spend=950.0,  # 95% spend
    )

    comp_service.create_comp(trigger_data)

    rich.print("\n[bold blue]--- Step 2: Running Notification Logic ---[/bold blue]")
    # Notification create karne wala function chalaein
    notif_res = notif_service.create_notification()
    rich.print("Create Notification Response:", notif_res)

    rich.print("\n[bold blue]--- Step 3: Fetching All Notifications ---[/bold blue]")
    all_notifs = notif_service.get_notifications()
    rich.print(f"Total Notifications in DB: {len(all_notifs)}")
    
    if len(all_notifs) > 0:
        last_notif = all_notifs[-1]
        notif_id = last_notif['id']
        rich.print(f"Latest Notification Message: [green]{last_notif['message']}[/green]")

        rich.print(f"\n[bold blue]--- Step 4: Marking Notification {notif_id} as Read ---[/bold blue]")
        read_res = notif_service.unread_notification(notif_id)
        rich.print(read_res)

if __name__ == "__main__":
    try:
        test_notification_flow()
        rich.print("\n[bold green]✅ Notification Service Test Completed![/bold green]")
    except Exception as e:
        rich.print(f"\n[bold red]❌ Test failed with error: {e}[/bold red]")