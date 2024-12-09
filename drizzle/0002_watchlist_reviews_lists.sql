-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  year TEXT,
  poster TEXT,
  plot TEXT,
  genre TEXT,
  director TEXT,
  actors TEXT,
  rating TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  movie_id TEXT NOT NULL REFERENCES movies(id),
  status TEXT NOT NULL DEFAULT 'want_to_watch',
  progress INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  movie_id TEXT NOT NULL REFERENCES movies(id),
  rating INTEGER NOT NULL,
  review TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create user_lists table
CREATE TABLE IF NOT EXISTS user_lists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  is_public INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create list_movies table
CREATE TABLE IF NOT EXISTS list_movies (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES user_lists(id),
  movie_id TEXT NOT NULL REFERENCES movies(id),
  "order" INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);
