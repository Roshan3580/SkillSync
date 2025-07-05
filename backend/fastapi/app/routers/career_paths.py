from fastapi import APIRouter, HTTPException
from typing import List
import os

from app.services.ai_service import AIService
from app.models.career import CareerPath, CareerSuggestionRequest

router = APIRouter()

@router.post("/suggest", response_model=List[CareerPath])
async def get_career_suggestions(request: CareerSuggestionRequest):
    """
    Get AI-powered career path suggestions based on skills and experience
    """
    try:
        ai_service = AIService()
        
        # Get career suggestions from external AI API
        suggestions = await ai_service.get_career_suggestions(
            skills=request.skills,
            experience_years=request.experience_years,
            current_role=request.current_role,
            interests=request.interests
        )
        
        return suggestions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting career suggestions: {str(e)}")

@router.get("/paths", response_model=List[CareerPath])
async def get_all_career_paths():
    """
    Get all available career paths
    """
    try:
        # TODO: Fetch from database or external API
        career_paths = [
            CareerPath(
                id=1,
                title="Backend Developer",
                description="Focus on server-side development and database management",
                required_skills=["Python", "Node.js", "PostgreSQL", "Docker"],
                average_salary=85000,
                growth_potential="High",
                difficulty="Intermediate"
            ),
            CareerPath(
                id=2,
                title="Frontend Developer",
                description="Focus on user interface and user experience",
                required_skills=["JavaScript", "React", "CSS", "HTML"],
                average_salary=75000,
                growth_potential="High",
                difficulty="Beginner"
            ),
            CareerPath(
                id=3,
                title="Full Stack Developer",
                description="Handle both frontend and backend development",
                required_skills=["JavaScript", "Python", "React", "Node.js", "PostgreSQL"],
                average_salary=95000,
                growth_potential="Very High",
                difficulty="Advanced"
            ),
            CareerPath(
                id=4,
                title="ML Engineer",
                description="Focus on machine learning and data science",
                required_skills=["Python", "TensorFlow", "Pandas", "Scikit-learn"],
                average_salary=110000,
                growth_potential="Very High",
                difficulty="Advanced"
            )
        ]
        
        return career_paths
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching career paths: {str(e)}")

@router.get("/paths/{path_id}", response_model=CareerPath)
async def get_career_path(path_id: int):
    """
    Get specific career path details
    """
    try:
        # TODO: Fetch from database
        career_path = CareerPath(
            id=path_id,
            title="Backend Developer",
            description="Focus on server-side development and database management",
            required_skills=["Python", "Node.js", "PostgreSQL", "Docker"],
            average_salary=85000,
            growth_potential="High",
            difficulty="Intermediate"
        )
        
        return career_path
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="Career path not found") 