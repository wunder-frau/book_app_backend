-- Create the blogs table
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

-- Insert sample data
INSERT INTO blogs (author, url, title, likes) 
VALUES 
('Dan Abramov', 'https://example.com/new-blog', 'On let vs const', 2),
('Laurenz Albe', 'https://postgresql.org', 'Gaps in sequences in PostgreSQL', 0);

-- Retrieve all blog entries
SELECT * FROM blogs;

-- Update a blog's like count
UPDATE blogs SET likes = likes + 1 WHERE id = 1;

-- Delete a blog entry
DELETE FROM blogs WHERE id = 2;
