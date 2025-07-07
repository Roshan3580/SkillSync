from fastapi import APIRouter, HTTPException, Request
from typing import List
import os

from app.services.ai_service import AIService
from app.models.career import CareerPath, CareerSuggestionRequest

router = APIRouter()

@router.post("/suggest", response_model=List[CareerPath])
async def get_career_suggestions(request: Request):
    """
    Get AI-powered career path suggestions based on resume, GitHub, and LeetCode data (if provided)
    """
    try:
        data = await request.json()
        resume = data.get("resume")
        github = data.get("github")
        leetcode = data.get("leetcode")

        # Defensive: If resume is missing or incomplete, return error
        if not resume or not resume.get("skills") or not resume.get("experience_years"):
            raise HTTPException(status_code=400, detail="Resume analysis data is required (skills, experience_years)")

        ai_service = AIService()
        suggestions = await ai_service.get_career_suggestions(
            skills=resume.get("skills", []),
            experience_years=resume.get("experience_years", 0),
            current_role=resume.get("job_titles", [None])[0] if resume.get("job_titles") else None,
            interests=None,  # Optionally map from resume or frontend
            github_data=github,
            leetcode_data=leetcode
        )
        return suggestions
    except HTTPException:
        raise
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