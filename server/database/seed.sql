-- ============================================
-- SEED DATA - Sample data for testing
-- ============================================

USE mahapola_maritime_academy;

-- Sample Courses
INSERT INTO courses (course_code, course_name, category, description, duration, duration_months, eligibility, fee, is_active) VALUES
('EQP-001', 'Equipment Operations and Logistics', 'Equipment Operations', 'Comprehensive training in port equipment operations and logistics management', '6 months', 6, 'O/L passed with Mathematics', 75000.00, TRUE),
('FIRE-001', 'Fire Safety and Occupational Health', 'Safety', 'Fire safety protocols and occupational health standards for maritime industry', '3 months', 3, 'O/L passed', 45000.00, TRUE),
('IT-001', 'Information Systems for Maritime', 'Information Technology', 'Digital systems and software used in modern port operations', '4 months', 4, 'A/L passed or equivalent', 60000.00, TRUE),
('MGT-001', 'Maritime Management', 'Management', 'Port and shipping management fundamentals', '8 months', 8, 'Degree or equivalent', 120000.00, TRUE),
('MAR-001', 'Maritime and Seamanship', 'Maritime', 'Core seamanship skills and maritime operations', '12 months', 12, 'O/L passed', 95000.00, TRUE),
('TECH-001', 'Technical Operations Level 1', 'Technical', 'Basic technical operations in maritime environment', '6 months', 6, 'O/L with Science subjects', 70000.00, TRUE),
('TECH-002', 'Technical Operations Level 2', 'Technical', 'Advanced technical operations and maintenance', '6 months', 6, 'Completion of Technical 1', 75000.00, TRUE),
('FORK-001', 'Forklift and Tug Operations', 'Equipment Operations', 'Professional forklift and tug operation training', '2 months', 2, 'Valid driving license', 35000.00, TRUE),
('CRANE-001', 'Crane Operator Training - Basic', 'Equipment Operations', 'Basic crane operation and safety protocols', '3 months', 3, 'O/L passed', 85000.00, TRUE),
('MOVE-001', 'Heavy Movers Operations', 'Equipment Operations', 'Training for operating heavy moving equipment', '3 months', 3, 'Valid driving license', 65000.00, TRUE),
('CRANE-002', 'Crane Operator Training - Advanced', 'Equipment Operations', 'Advanced crane operations for large-scale equipment', '4 months', 4, 'Completion of Crane Basic', 95000.00, TRUE);

-- Sample News and Events
INSERT INTO news_events (title, slug, content, excerpt, category, is_published, published_at) VALUES
('New Maritime Training Facility Inaugurated', 'new-maritime-training-facility', 
'The Mahapola Ports & Maritime Academy proudly announces the opening of its state-of-the-art maritime training facility...', 
'State-of-the-art facility opens to enhance maritime education', 
'news', TRUE, NOW()),

('Annual Maritime Career Fair 2025', 'maritime-career-fair-2025', 
'Join us for the biggest maritime career fair featuring top shipping companies and port authorities...', 
'Connect with industry leaders and explore career opportunities', 
'event', TRUE, NOW()),

('Safety Excellence Award Received', 'safety-excellence-award', 
'Our academy has been recognized for outstanding contribution to maritime safety education...', 
'Academy honored for safety training excellence', 
'achievement', TRUE, NOW());