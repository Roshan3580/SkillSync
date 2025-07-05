import PyPDF2
import pdfplumber
import re
from typing import List
import os

class ResumeParser:
    def __init__(self):
        # Simple text processing without spaCy
        pass
        
        # Common skills and job titles
        self.skills_keywords = [
            "python", "javascript", "java", "react", "node.js", "angular", "vue",
            "postgresql", "mysql", "mongodb", "redis", "docker", "kubernetes",
            "aws", "azure", "gcp", "git", "github", "jenkins", "ci/cd",
            "html", "css", "sass", "typescript", "php", "ruby", "go", "rust",
            "machine learning", "ai", "tensorflow", "pytorch", "pandas", "numpy"
        ]
        
        self.job_titles = [
            "software engineer", "developer", "programmer", "full stack",
            "frontend", "backend", "devops", "data scientist", "ml engineer",
            "product manager", "project manager", "team lead", "architect"
        ]

    async def parse_resume(self, file_path: str):
        """
        Parse resume PDF and extract information
        """
        try:
            # Extract text from PDF
            text = await self._extract_text_from_pdf(file_path)
            
            # Parse extracted information
            skills = self._extract_skills(text)
            job_titles = self._extract_job_titles(text)
            education = self._extract_education(text)
            experience_years = self._extract_experience_years(text)
            languages = self._extract_languages(text)
            certifications = self._extract_certifications(text)
            
            # Return a dictionary instead of importing the model
            return {
                "skills": skills,
                "job_titles": job_titles,
                "education": education,
                "experience_years": experience_years,
                "languages": languages,
                "certifications": certifications
            }
            
        except Exception as e:
            raise Exception(f"Error parsing resume: {str(e)}")

    async def _extract_text_from_pdf(self, file_path: str) -> str:
        """
        Extract text from PDF using pdfplumber
        """
        try:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
            return text.lower()
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")

    def _extract_skills(self, text: str) -> List[str]:
        """
        Extract skills from resume text
        """
        skills = []
        for skill in self.skills_keywords:
            if skill in text:
                skills.append(skill.title())
        return list(set(skills))

    def _extract_job_titles(self, text: str) -> List[str]:
        """
        Extract job titles from resume text
        """
        titles = []
        for title in self.job_titles:
            if title in text:
                titles.append(title.title())
        return list(set(titles))

    def _extract_education(self, text: str) -> List[str]:
        """
        Extract education information with complete university names and degrees
        """
        education = []
        
        # More comprehensive education patterns
        education_patterns = [
            # Bachelor's degree patterns
            r"bachelor['']?s?\s+(?:degree|of|in)\s+(?:science|arts|engineering|technology|computer|information|business|management)\s+(?:in\s+)?([^,\n]+)",
            r"b\.?s\.?\s+(?:in\s+)?([^,\n]+)",
            r"bachelor['']?s?\s+([^,\n]+)",
            
            # Master's degree patterns
            r"master['']?s?\s+(?:degree|of|in)\s+(?:science|arts|engineering|technology|computer|information|business|management)\s+(?:in\s+)?([^,\n]+)",
            r"m\.?s\.?\s+(?:in\s+)?([^,\n]+)",
            r"master['']?s?\s+([^,\n]+)",
            
            # PhD patterns
            r"ph\.?d\.?\s+(?:in\s+)?([^,\n]+)",
            r"doctorate\s+(?:in\s+)?([^,\n]+)",
            
            # University/College patterns with names
            r"([a-zA-Z\s&]+(?:university|college|institute|school)[a-zA-Z\s&]*)",
            r"([a-zA-Z\s&]+(?:university|college|institute|school))",
            
            # Degree with university context
            r"([^,\n]+(?:university|college|institute)[^,\n]*)",
        ]
        
        for pattern in education_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    # Handle groups in regex
                    for group in match:
                        if group and len(group.strip()) > 2:
                            education.append(group.strip().title())
                else:
                    if match and len(match.strip()) > 2:
                        education.append(match.strip().title())
        
        # Clean up and filter results
        cleaned_education = []
        for edu in education:
            # Remove common words that don't add value
            edu_clean = re.sub(r'\b(degree|in|of|the|and|or)\b', '', edu, flags=re.IGNORECASE)
            edu_clean = re.sub(r'\s+', ' ', edu_clean).strip()
            
            # Filter out non-education related text
            if (len(edu_clean) > 3 and 
                edu_clean not in cleaned_education and
                not any(word in edu_clean.lower() for word in ['projects', 'schools', 'engineered', 'simulator', 'propagation']) and
                not edu_clean.startswith(':') and
                not edu_clean.startswith('for')):
                cleaned_education.append(edu_clean)
        
        return cleaned_education[:3]  # Limit to top 3 results

    def _extract_experience_years(self, text: str) -> int:
        """
        Extract years of experience
        """
        experience_patterns = [
            r"(\d+)\s+years?\s+of?\s+experience",
            r"experience:\s*(\d+)",
            r"(\d+)\s+years?\s+in"
        ]
        
        for pattern in experience_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return int(match.group(1))
        
        return 0

    def _extract_languages(self, text: str) -> List[str]:
        """
        Extract programming languages and spoken languages
        """
        languages = []
        language_patterns = [
            r"languages?:\s*([^.\n]+)",
            r"programming\s+languages?:\s*([^.\n]+)",
            r"spoken\s+languages?:\s*([^.\n]+)"
        ]
        
        for pattern in language_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                languages.extend([lang.strip() for lang in match.group(1).split(',')])
        
        return list(set(languages))

    def _extract_certifications(self, text: str) -> List[str]:
        """
        Extract certifications
        """
        certifications = []
        cert_patterns = [
            r"certifications?:\s*([^.\n]+)",
            r"certified\s+([^.\n]+)",
            r"aws\s+certified",
            r"microsoft\s+certified",
            r"google\s+certified"
        ]
        
        for pattern in cert_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            certifications.extend(matches)
        
        return list(set(certifications)) 