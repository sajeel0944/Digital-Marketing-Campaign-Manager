from pydantic import BaseModel

class AddCompSchema(BaseModel):
    client_name: str
    status: str
    budget: float
    spend: float

    
