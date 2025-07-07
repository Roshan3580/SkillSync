import httpx
import os
from typing import List
from app.models.career import CareerPath

class AIService:
    def __init__(self):
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.api_key = os.getenv("GROQ_API_KEY", "your-groq-api-key")
        self.model = os.getenv("GROQ_MODEL", "llama3-8b-8192")  # Default to Llama3-8b

    async def get_career_suggestions(
        self, 
        skills: List[str], 
        experience_years: int, 
        current_role: str = None, 
        interests: List[str] = None
    ) -> List[CareerPath]:
        """
        Get career suggestions from Groq API
        """
        try:
            # Prepare the prompt for Groq
            prompt = self._create_career_prompt(skills, experience_years, current_role, interests)
            
            # Make request to Groq API
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.api_url,
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a career advisor specializing in software development and technology careers. Provide specific, actionable career path suggestions based on the user's skills and experience."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.7,
                        "max_tokens": 1000
                    },
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return self._parse_groq_response(data, skills, experience_years)
                else:
                    # Fallback to mock data if API fails
                    return self._get_mock_suggestions(skills, experience_years)
                    
        except Exception as e:
            # Fallback to mock data on error
            return self._get_mock_suggestions(skills, experience_years)

    def _create_career_prompt(self, skills: List[str], experience_years: int, current_role: str = None, interests: List[str] = None) -> str:
        """
        Create a detailed prompt for career suggestions
        """
        prompt = f"""
        Based on the following developer profile, suggest 3-4 specific career paths with detailed information:

        Skills: {', '.join(skills)}
        Years of Experience: {experience_years}
        Current Role: {current_role or 'Not specified'}
        Interests: {', '.join(interests) if interests else 'Not specified'}

        For each suggested career path, provide:
        1. Career title
        2. Brief description
        3. Required skills (specific technologies)
        4. Average salary range
        5. Growth potential (Low/Medium/High/Very High)
        6. Difficulty level (Beginner/Intermediate/Advanced)

        Focus on realistic career transitions and growth opportunities in software development, data science, and related fields.
        """
        return prompt

    def _parse_groq_response(self, data: dict, skills: List[str], experience_years: int) -> List[CareerPath]:
        """
        Parse response from Groq API
        """
        try:
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            # Parse the AI response to extract career suggestions
            # This is a simplified parser - you might want to make it more robust
            suggestions = self._extract_career_suggestions_from_text(content)
            
            if suggestions:
                return suggestions
            else:
                # Fallback if parsing fails
                return self._get_mock_suggestions(skills, experience_years)
                
        except Exception as e:
            # Fallback to mock data on error
            return self._get_mock_suggestions(skills, experience_years)

    def _extract_career_suggestions_from_text(self, text: str) -> List[CareerPath]:
        """
        Extract career suggestions from Groq's text response
        This is a basic implementation - you might want to improve the parsing logic
        """
        suggestions = []
        
        # Simple parsing logic - you can enhance this based on Groq's response format
        # For now, we'll use the mock suggestions as a fallback
        # In a real implementation, you'd parse the text response more carefully
        
        return suggestions

    def _get_mock_suggestions(self, skills: List[str], experience_years: int) -> List[CareerPath]:
        """
        Get mock career suggestions based on skills and experience
        """
        suggestions = []
        
        # Determine suggestions based on skills
        if any(skill.lower() in ["python", "java", "javascript"] for skill in skills):
            if experience_years >= 3:
                suggestions.append(CareerPath(
                    id=1,
                    title="Senior Backend Developer",
                    description="Lead backend development with advanced system design",
                    required_skills=["Python", "Node.js", "PostgreSQL", "Docker", "System Design"],
                    average_salary=120000,
                    growth_potential="Very High",
                    difficulty="Advanced"
                ))
            else:
                suggestions.append(CareerPath(
                    id=2,
                    title="Backend Developer",
                    description="Develop server-side applications and APIs",
                    required_skills=["Python", "Node.js", "PostgreSQL", "Docker"],
                    average_salary=85000,
                    growth_potential="High",
                    difficulty="Intermediate"
                ))
        
        if any(skill.lower() in ["react", "angular", "vue", "javascript"] for skill in skills):
            suggestions.append(CareerPath(
                id=3,
                title="Frontend Developer",
                description="Build user interfaces and interactive web applications",
                required_skills=["JavaScript", "React", "CSS", "HTML", "TypeScript"],
                average_salary=75000,
                growth_potential="High",
                difficulty="Beginner"
            ))
        
        if any(skill.lower() in ["python", "tensorflow", "pytorch", "machine learning"] for skill in skills):
            suggestions.append(CareerPath(
                id=4,
                title="ML Engineer",
                description="Develop machine learning models and AI systems",
                required_skills=["Python", "TensorFlow", "Pandas", "Scikit-learn", "MLOps"],
                average_salary=110000,
                growth_potential="Very High",
                difficulty="Advanced"
            ))
        
        if len(skills) >= 5 and experience_years >= 2:
            suggestions.append(CareerPath(
                id=5,
                title="Full Stack Developer",
                description="Handle both frontend and backend development",
                required_skills=["JavaScript", "Python", "React", "Node.js", "PostgreSQL"],
                average_salary=95000,
                growth_potential="Very High",
                difficulty="Advanced"
            ))
        
        return suggestions[:3]  # Return top 3 suggestions 

    async def analyze_resume_with_ai(self, resume_text: str) -> dict:
        """
        Analyze resume text using Groq API and extract structured information.
        """
        prompt = f"""
        You are a resume analysis assistant. Given the following resume text, extract the following information and return it as a JSON object with these keys:
        - skills (list of strings)
        - job_titles (list of strings)
        - education (list of strings)
        - experience_years (integer)
        
        Resume Text:
        '''
        {resume_text}
        '''
        
        Respond ONLY with a valid JSON object with the above keys and no extra commentary.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.api_url,
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": "You are a helpful assistant."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.2,
                        "max_tokens": 800
                    },
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    timeout=30.0
                )
                if response.status_code == 200:
                    data = response.json()
                    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                    import json
                    return json.loads(content)
                else:
                    raise Exception(f"Groq API error: {response.status_code} {response.text}")
        except Exception as e:
            raise Exception(f"AI resume analysis failed: {str(e)}") 