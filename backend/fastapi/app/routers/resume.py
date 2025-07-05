from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import os
import uuid
from datetime import datetime

from app.services.resume_parser import ResumeParser
from app.models.resume import ResumeAnalysis, ResumeUploadResponse

router = APIRouter()

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload and analyze a resume PDF
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Create upload directory if it doesn't exist
        upload_dir = "uploads/resumes"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        filename = f"{file_id}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Parse resume
        parser = ResumeParser()
        analysis_data = await parser.parse_resume(file_path)
        
        # Convert dictionary to ResumeAnalysis model
        analysis = ResumeAnalysis(**analysis_data)
        
        # TODO: Save analysis to database
        
        return ResumeUploadResponse(
            file_id=file_id,
            filename=file.filename,
            analysis=analysis,
            uploaded_at=datetime.utcnow()
        )
        
    except Exception as e:
        import traceback
        print(f"Error processing resume: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@router.get("/analysis/{file_id}", response_model=ResumeAnalysis)
async def get_resume_analysis(file_id: str):
    """
    Get resume analysis by file ID
    """
    try:
        # TODO: Fetch analysis from database
        # For now, return mock data
        analysis = ResumeAnalysis(
            skills=["Python", "JavaScript", "React", "Node.js"],
            job_titles=["Software Engineer", "Full Stack Developer"],
            education=["Bachelor's in Computer Science"],
            experience_years=3,
            languages=["English", "Spanish"],
            certifications=["AWS Certified Developer"]
        )
        
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="Analysis not found")

@router.get("/skills", response_model=List[str])
async def get_extracted_skills(file_id: str):
    """
    Get extracted skills from resume
    """
    try:
        # TODO: Fetch skills from database
        skills = ["Python", "JavaScript", "React", "Node.js", "PostgreSQL"]
        return skills
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="Skills not found") 