
INSERT INTO department (name)
VALUES
('Accounting'),
('Human Resources'),
('Marketing'),
('Project Manager');

INSERT INTO role (title, salary, department_id)
VALUES
('Chief Accounting Officer', 10000, 1),
('Accounting Manager', 9500, 1),
('Accountant', 7000, 1),
('Accounting Clerk', 4000, 1),
('Vice President (HR)', 9200, 2),
('Director (HR)', 9000, 2),
('Manager (HR)', 8600, 2),
('Entry Level (HR)', 4000, 2),
('Vice President of Digital Marketing', 11000, 3),
('Sales and Marketing Manager', 9400, 3),
('Sales and Marketing Executive', 8300, 3),
('Senior Project Manager', 10000, 4),
('Assistant Project Manager', 6000, 4),
('Project Coordinator', 5000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Smith', 12, NULL),
('Ethan', 'Anderson', 11, 1),
('Ava', 'Peterson', 10, 2),
('Noah', 'Ramirez', 9, NULL),
('Olivia', 'Bennett', 8, 4),
('Liam', 'Cooper', 7, 5),
('Emma', 'Jenkins', 6, 6),
('Mason', 'Rodriguez', 5, NULL),
('Sophia', 'Morgan', 4, 8),
('Lucas', 'Mitchell', 3, 19),
('Mia', 'Turner', 2, NULL),
('Isabella', 'Reed', 1, 11);

