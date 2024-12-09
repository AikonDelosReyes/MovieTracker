CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
  id VARCHAR(255) PRIMARY KEY,
  tmdb_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  poster_path TEXT,
  overview TEXT,
  release_date VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS watchlist (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  movie_id VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  rating INT,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  INDEX user_idx (user_id),
  INDEX movie_idx (movie_id)
);

CREATE TABLE IF NOT EXISTS custom_lists (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX user_idx (user_id)
);

CREATE TABLE IF NOT EXISTS list_movies (
  id VARCHAR(255) PRIMARY KEY,
  list_id VARCHAR(255) NOT NULL,
  movie_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (list_id) REFERENCES custom_lists(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  INDEX list_idx (list_id),
  INDEX movie_idx (movie_id)
);