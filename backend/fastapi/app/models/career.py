from pydantic import BaseModel
from typing import List, Optional

class CareerPath(BaseModel):
    id: int
    title: str
    description: str
    required_skills: List[str]
    average_salary: int
    growth_potential: str
    difficulty: str
    
    class Config:
        from_attributes = True

class CareerSuggestionRequest(BaseModel):
    skills: List[str]
    experience_years: int
    current_role: Optional[str] = None
    interests: Optional[List[str]] = None
    
    class Config:
        from_attributes = True 