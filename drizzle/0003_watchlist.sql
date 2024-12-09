CREATE TABLE IF NOT EXISTS watchlist (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  movie_id TEXT NOT NULL REFERENCES movies(id),
  status TEXT NOT NULL DEFAULT 'want_to_watch',
  progress INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
