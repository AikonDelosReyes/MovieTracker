-- Drop existing tables if they exist
DROP TABLE IF EXISTS list_movies;
DROP TABLE IF EXISTS user_lists;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS watchlist;
DROP TABLE IF EXISTS watchlists;
DROP TABLE IF EXISTS movies;

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

-- Create watchlists table
CREATE TABLE IF NOT EXISTS watchlists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id TEXT PRIMARY KEY,
  movie_id TEXT NOT NULL REFERENCES movies(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  watchlist_id TEXT REFERENCES watchlists(id),
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
  "order" INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
