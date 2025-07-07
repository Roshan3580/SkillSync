from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
from dotenv import load_dotenv
import os

from app.routers import resume, career_paths, health

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

app = FastAPI(
    title="SkillSync FastAPI Backend",
    description="Resume analysis and career path suggestions API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*"  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware for production
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["your-domain.com", "api.your-domain.com"]
    )

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(career_paths.router, prefix="/api/career", tags=["career"])

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("FASTAPI_PORT", 8000)),
        reload=os.getenv("ENVIRONMENT") != "production"
    ) 