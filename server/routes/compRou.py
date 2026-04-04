import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import rich
from create_comp import CompService
from Typeschema.compType import AddCompSchema
from fastapi import APIRouter, Depends
from security.deps import check_aouthentication_token

Comp_Rou =  APIRouter(prefix="/company",  dependencies=[Depends(check_aouthentication_token)])

# --- 1. Campaign Management Routes ---

@Comp_Rou.post("")
def add_comp(data: AddCompSchema) -> dict:
    try:
        comp_service = CompService()
        return comp_service.create_comp(data)
    except Exception as e:
        rich.print(f"Error in /comp/add route: {e}")
        return {"status": "error", "message": "An error occurred while adding the comp"}

@Comp_Rou.get("",)
def get_all_comps():
    try:
        comp_service = CompService()
        return comp_service.get_comp(None)
    except Exception as e:
        rich.print(f"Error in /comp/get-all route: {e}")
        return []
    
@Comp_Rou.get("/{comp_id}")
def get_comp(comp_id: int):
    try:
        comp_service = CompService()
        return comp_service.get_comp(comp_id)
    except Exception as e:
        rich.print(f"Error in /comp/get/{comp_id} route: {e}")
        return {"status": "error", "message": "An error occurred while retrieving the comp"}
    
@Comp_Rou.put("/{comp_id}")
def update_comp(comp_id: int, companyData: AddCompSchema):
    try:
        comp_service = CompService()
        return comp_service.update_comp(comp_id, companyData)
    except Exception as e:
        rich.print(f"Error in /comp/update/{comp_id} route: {e}")
        return {"status": "error", "message": "An error occurred while updating the comp"}

@Comp_Rou.delete("/{comp_id}")
def delete_comp(comp_id: int):
    try:
        comp_service = CompService()
        return comp_service.delete_comp(comp_id)
    except Exception as e:
        rich.print(f"Error in /comp/delete/{comp_id} route: {e}")
        return {"status": "error", "message": "An error occurred while deleting the comp"}