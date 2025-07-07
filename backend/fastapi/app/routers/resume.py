from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import os
import uuid
from datetime import datetime

from app.services.ai_service import AIService
from app.models.resume import ResumeAnalysis, ResumeUploadResponse

router = APIRouter()

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload and analyze a resume PDF using AI
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
        
        # Extract text from PDF
        import pdfplumber
        resume_text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                resume_text += page.extract_text() or ""
        
        # Analyze with AI
        ai_service = AIService()
        analysis_data = await ai_service.analyze_resume_with_ai(resume_text)
        
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