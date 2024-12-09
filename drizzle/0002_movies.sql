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
