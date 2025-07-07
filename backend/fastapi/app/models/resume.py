from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ResumeAnalysis(BaseModel):
    skills: List[str]
    job_titles: List[str]
    education: List[str]
    experience_years: int
    
    class Config:
        from_attributes = True

class ResumeUploadResponse(BaseModel):
    file_id: str
    filename: str
    analysis: ResumeAnalysis
    uploaded_at: datetime
    
    class Config:
        from_attributes = True 