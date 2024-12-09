import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations, type InferModel } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expires_at').notNull(),
});

export const movies = sqliteTable('movies', {
  id: text('id').primaryKey(), // OMDB movie ID
  title: text('title').notNull(),
  year: text('year'),
  poster: text('poster'),
  plot: text('plot'),
  genre: text('genre'),
  director: text('director'),
  actors: text('actors'),
  rating: text('rating'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export const watchlists = sqliteTable('watchlists', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const watchlist = sqliteTable('watchlist', {
  id: text('id').primaryKey(),
  movieId: text('movie_id')
    .notNull()
    .references(() => movies.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  watchlistId: text('watchlist_id')
    .references(() => watchlists.id),
  status: text('status', { enum: ['want_to_watch', 'watching', 'watched'] })
    .default('want_to_watch')
    .notNull(),
  progress: integer('progress').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  movieId: text('movie_id')
    .notNull()
    .references(() => movies.id),
  rating: integer('rating').notNull(), // 1-5 stars
  review: text('review'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export const userLists = sqliteTable('user_lists', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export const listMovies = sqliteTable('list_movies', {
  id: text('id').primaryKey(),
  listId: text('list_id')
    .notNull()
    .references(() => userLists.id),
  movieId: text('movie_id')
    .notNull()
    .references(() => movies.id),
  order: integer('order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export type User = InferModel<typeof users>;
export type Movie = InferModel<typeof movies>;
export type WatchlistItem = InferModel<typeof watchlist>;
export type Watchlist = InferModel<typeof watchlists>;
export type Review = InferModel<typeof reviews>;
export type UserList = InferModel<typeof userLists>;
export type ListMovie = InferModel<typeof listMovies>;

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  watchlists: many(watchlists),
  watchlistItems: many(watchlist),
  reviews: many(reviews),
  userLists: many(userLists)
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  watchlistItems: many(watchlist),
  reviews: many(reviews),
  listMovies: many(listMovies)
}));

export const watchlistsRelations = relations(watchlists, ({ one, many }) => ({
  user: one(users, {
    fields: [watchlists.userId],
    references: [users.id]
  }),
  items: many(watchlist)
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, {
    fields: [watchlist.userId],
    references: [users.id]
  }),
  movie: one(movies, {
    fields: [watchlist.movieId],
    references: [movies.id]
  }),
  watchlist: one(watchlists, {
    fields: [watchlist.watchlistId],
    references: [watchlists.id]
  })
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  }),
  movie: one(movies, {
    fields: [reviews.movieId],
    references: [movies.id]
  })
}));

export const userListsRelations = relations(userLists, ({ one, many }) => ({
  user: one(users, {
    fields: [userLists.userId],
    references: [users.id]
  }),
  movies: many(listMovies)
}));

export const listMoviesRelations = relations(listMovies, ({ one }) => ({
  list: one(userLists, {
    fields: [listMovies.listId],
    references: [userLists.id]
  }),
  movie: one(movies, {
    fields: [listMovies.movieId],
    references: [movies.id]
  })
}));
