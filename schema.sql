DROP DATABASE IF EXISTS pg_express_books;

CREATE DATABASE pg_express_books
  WITH
  OWNER = Vincent
  ENCODING = 'UTF8'
  LC_COLLATE = 'English_United States.1252'
  LC_CTYPE = 'English_United States.1252'
  TABLESPACE = pg_default
  CONNECTION LIMIT = -1;

CREATE TABLE public.books (
  title CHARACTER VARYING COLLATE pg_catalog."default",
  authors CHARACTER VARYING[] COLLATE pg_catalog."default",
  description CHARACTER VARYING(140) COLLATE pg_catalog."default",
  categories CHARACTER VARYING[] COLLATE pg_catalog."default",
  publisher CHARACTER VARYING COLLATE pg_catalog."default",
  preview_link CHARACTER VARYING COLLATE pg_catalog."default",
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  query_string CHARACTER VARYING COLLATE pg_catalog."default" NOT NULL,
  published_date CHARACTER VARYING COLLATE pg_catalog."default",
  id SERIAL,
  CONSTRAINT books_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.books
  OWNER TO Vincent;