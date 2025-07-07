from pydantic import BaseModel
from typing import List, Optional, Dict

class CareerPath(BaseModel):
    id: int
    title: str
    description: str
    required_skills: List[str]
    companies: List[str]
    suitability: str
    average_salary: int
    growth_potential: str
    difficulty: str
    
    class Config:
        from_attributes = True

class GitHubRepo(BaseModel):
    name: str
    url: str
    language: str
    stars: int
    last_updated: str

class GitHubSummary(BaseModel):
    public_repos: int
    total_commits: int
    most_used_languages: Dict[str, int]
    recent_repos: List[GitHubRepo]

class LeetCodeProblem(BaseModel):
    title: str
    difficulty: str
    solved_at: str
    url: str

class LeetCodeSummary(BaseModel):
    total_solved: int
    ranking: int
    recent_problems: List[LeetCodeProblem]

class CareerSuggestionRequest(BaseModel):
    skills: List[str]
    experience_years: int
    current_role: Optional[str] = None
    interests: Optional[List[str]] = None
    github_data: Optional[GitHubSummary] = None
    leetcode_data: Optional[LeetCodeSummary] = None
    
    class Config:
        from_attributes = True 