import sys
from pathlib import Path
import rich

# Path setup taake imports kaam karein
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from create_comp import CompService
from Typeschema.compType import AddCompSchema

def test_campaign_flow():
    service = CompService()

    # 1. Dummy Data Tayyar Karein
    mock_data = AddCompSchema(
        client_name="Ali Khan",
        status="active",
        budget=5000.0,
        spend=0.0,
    )

    rich.print("--- Testing Create ---")
    create_res = service.create_comp(mock_data)
    rich.print("Create Response:", create_res)

    rich.print("\n--- Testing Get All ---")
    all_comps = service.get_comp()
    rich.print(all_comps)

    if len(all_comps) > 0:
        last_id = all_comps[-1]['id']
        
        rich.print(f"\n--- Testing Get Single (ID: {last_id}) ---")
        single_comp = service.get_comp(comp_id=last_id)
        rich.print("Single Comp Name:", getattr(single_comp, 'campaign_name', 'Not Found'))

        rich.print("\n--- Testing Update ---")
        mock_data.client_name = "Updated Summer Sale"
        update_res = service.update_comp(last_id, mock_data)
        rich.print("Update Response:", update_res)

        rich.print("\n--- Testing Soft Delete ---")
        delete_res = service.delete_comp(last_id)
        rich.print("Delete Response:", delete_res)

        # Re-check deletion
        check_deleted = service.get_comp(comp_id=last_id)
        rich.print("Verify Deletion (Should be error):", check_deleted)

if __name__ == "__main__":
    try:
        test_campaign_flow()
        rich.print("\n✅ All CompService tests finished!")
    except Exception as e:
        rich.print(f"\n❌ Test failed with error: {e}")