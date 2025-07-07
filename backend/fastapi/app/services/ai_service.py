import httpx
import os
from typing import List
from app.models.career import CareerPath, GitHubSummary, LeetCodeSummary

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
        interests: List[str] = None,
        github_data: GitHubSummary = None,
        leetcode_data: LeetCodeSummary = None
    ) -> List[CareerPath]:
        """
        Get career suggestions from Groq API
        """
        # Prepare the prompt for Groq
        prompt = self._create_career_prompt(skills, experience_years, current_role, interests, github_data, leetcode_data)
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.api_url,
                json={
                    "model": self.model,
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "You are a career advisor specializing in software development and technology careers. "
                                "Provide specific, actionable career path suggestions based on the user's skills, experience, and public coding profiles. "
                                "For each suggestion, include key skills, a list of realistic companies with current or similar openings, and a personalized explanation of why the user is suited for the job, referencing their resume or coding activity. "
                                "Respond ONLY with a valid JSON array of objects with these keys: title, description, required_skills, companies, suitability, average_salary, growth_potential, difficulty. "
                                "companies should be a list of company names. suitability should be a short paragraph referencing the user's background."
                            )
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1200
                },
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                timeout=40.0
            )
            if response.status_code == 200:
                data = response.json()
                return self._parse_groq_response(data, skills, experience_years)
            else:
                raise Exception(f"Groq API error: {response.status_code} {response.text}")

    def _create_career_prompt(self, skills: List[str], experience_years: int, current_role: str = None, interests: List[str] = None, github_data: GitHubSummary = None, leetcode_data: LeetCodeSummary = None) -> str:
        """
        Create a detailed prompt for career suggestions
        """
        github_section = ""
        if github_data:
            github_section = f"""
GitHub Stats:
- Public Repos: {github_data.public_repos}
- Total Commits: {github_data.total_commits}
- Most Used Languages: {', '.join([f'{lang} ({count})' for lang, count in github_data.most_used_languages.items()])}
- Recent Repos: {', '.join([repo.name for repo in github_data.recent_repos])}
"""
        leetcode_section = ""
        if leetcode_data:
            leetcode_section = f"""
LeetCode Stats:
- Total Solved: {leetcode_data.total_solved}
- Ranking: {leetcode_data.ranking}
- Recent Problems: {', '.join([p.title for p in leetcode_data.recent_problems])}
"""
        prompt = f"""
Based on the following developer profile, suggest 3-4 specific career paths with detailed information:

Skills: {', '.join(skills)}
Years of Experience: {experience_years}
Current Role: {current_role or 'Not specified'}
Interests: {', '.join(interests) if interests else 'Not specified'}
{github_section}{leetcode_section}
For each suggested career path, provide:
1. title (string)
2. description (string)
3. required_skills (list of strings)
4. companies (list of company names with current or similar openings)
5. suitability (short paragraph referencing the user's background)
6. average_salary (integer, USD)
7. growth_potential (string)
8. difficulty (string)

Respond ONLY with a valid JSON array of objects with these keys and no extra commentary.

Example:
[
  {{
    "id": 1,
    "title": "Full Stack Developer",
    "description": "Design, develop, and deploy scalable web applications using Python and React.",
    "required_skills": ["Python", "React", "Docker", "SQL"],
    "companies": ["Google", "Amazon", "Microsoft"],
    "suitability": "Your experience with Python and React makes you a strong fit for this role.",
    "average_salary": 125000,
    "growth_potential": "High",
    "difficulty": "Medium"
  }}
]

Every object in the array must include all fields exactly as shown in the example, even if some are empty.
"""
        return prompt

    def _parse_groq_response(self, data: dict, skills: List[str], experience_years: int) -> List[CareerPath]:
        """
        Parse response from Groq API
        """
        import json
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        try:
            parsed = json.loads(content)
            # Defensive: ensure required fields exist and add id
            for idx, obj in enumerate(parsed, start=1):
                obj['id'] = idx
                if 'required_skills' not in obj:
                    obj['required_skills'] = []
                if 'companies' not in obj or not isinstance(obj['companies'], list):
                    obj['companies'] = []
                if 'suitability' not in obj or not isinstance(obj['suitability'], str):
                    obj['suitability'] = ''
            return parsed
        except Exception as e:
            raise Exception(f"Failed to parse Groq response as JSON: {e}\nRaw content: {content}")

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