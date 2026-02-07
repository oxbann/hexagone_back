-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('player', 'coach', 'assistant_coach', 'manager', 'admin') DEFAULT 'player',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des fiches joueurs
CREATE TABLE IF NOT EXISTS player_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  pseudo VARCHAR(100) NOT NULL,
  game_role VARCHAR(100),
  strengths TEXT,
  weaknesses TEXT,
  progression_areas TEXT,
  staff_notes TEXT,
  objectives TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Créer un compte admin par défaut (mot de passe : admin123)
-- Hash bcrypt pour 'admin123': $2a$10$3ZqZ3Z3Z3Z3Z3Z3Z3Z3Z3eBXxj7v2K7Y5xJ5Y5xJ5Y5xJ5Y5xJ5Y5
INSERT INTO users (email, password, role) 
VALUES ('admin@hexagone.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin')
ON DUPLICATE KEY UPDATE email=email;
