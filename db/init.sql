CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE authors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    biography TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE,
    published_year SMALLINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_book_author 
        FOREIGN KEY (author_id) 
        REFERENCES authors(id) 
        ON DELETE RESTRICT
);

CREATE INDEX idx_books_author_id ON books(author_id);
