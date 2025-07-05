-- SkillSync Database Schema
-- PostgreSQL

-- Create database (run this separately)
-- CREATE DATABASE skillsync;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    github_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,
    access_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resumes table
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    file_id VARCHAR(255) UNIQUE NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume analysis table
CREATE TABLE resume_analysis (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    skills JSONB,
    job_titles JSONB,
    education JSONB,
    experience_years INTEGER,
    languages JSONB,
    certifications JSONB,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GitHub stats table
CREATE TABLE github_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    repositories INTEGER DEFAULT 0,
    commits INTEGER DEFAULT 0,
    stars INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    public_repos INTEGER DEFAULT 0,
    private_repos INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LeetCode stats table
CREATE TABLE leetcode_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    problems_solved INTEGER DEFAULT 0,
    total_problems INTEGER DEFAULT 2000,
    contest_rating INTEGER DEFAULT 0,
    submissions INTEGER DEFAULT 0,
    acceptance_rate DECIMAL(5,2) DEFAULT 0,
    ranking INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Career paths table
CREATE TABLE career_paths (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    required_skills JSONB,
    average_salary INTEGER,
    growth_potential VARCHAR(50),
    difficulty VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User career suggestions table
CREATE TABLE user_career_suggestions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    career_path_id INTEGER REFERENCES career_paths(id) ON DELETE CASCADE,
    confidence_score DECIMAL(3,2),
    suggested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    preferences JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_file_id ON resumes(file_id);
CREATE INDEX idx_github_stats_user_id ON github_stats(user_id);
CREATE INDEX idx_leetcode_stats_user_id ON leetcode_stats(user_id);
CREATE INDEX idx_user_career_suggestions_user_id ON user_career_suggestions(user_id);

-- Insert sample career paths
INSERT INTO career_paths (title, description, required_skills, average_salary, growth_potential, difficulty) VALUES
('Backend Developer', 'Focus on server-side development and database management', '["Python", "Node.js", "PostgreSQL", "Docker"]', 85000, 'High', 'Intermediate'),
('Frontend Developer', 'Focus on user interface and user experience', '["JavaScript", "React", "CSS", "HTML"]', 75000, 'High', 'Beginner'),
('Full Stack Developer', 'Handle both frontend and backend development', '["JavaScript", "Python", "React", "Node.js", "PostgreSQL"]', 95000, 'Very High', 'Advanced'),
('ML Engineer', 'Focus on machine learning and data science', '["Python", "TensorFlow", "Pandas", "Scikit-learn"]', 110000, 'Very High', 'Advanced'),
('DevOps Engineer', 'Focus on infrastructure and deployment automation', '["Docker", "Kubernetes", "AWS", "Jenkins"]', 90000, 'High', 'Intermediate'),
('Data Scientist', 'Focus on data analysis and statistical modeling', '["Python", "Pandas", "Scikit-learn", "SQL"]', 95000, 'Very High', 'Advanced');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 