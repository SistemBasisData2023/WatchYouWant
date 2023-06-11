--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: basisdatay25
--

CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    comment text NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    reply_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comments OWNER TO basisdatay25;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: basisdatay25
--

CREATE SEQUENCE public.comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_comment_id_seq OWNER TO basisdatay25;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: basisdatay25
--

ALTER SEQUENCE public.comments_comment_id_seq OWNED BY public.comments.comment_id;


--
-- Name: movies; Type: TABLE; Schema: public; Owner: basisdatay25
--

CREATE TABLE public.movies (
    movie_id integer NOT NULL,
    title text NOT NULL,
    genre text NOT NULL,
    rating integer,
    release_date date NOT NULL
);


ALTER TABLE public.movies OWNER TO basisdatay25;

--
-- Name: ratings; Type: TABLE; Schema: public; Owner: basisdatay25
--

CREATE TABLE public.ratings (
    user_id integer,
    movie_id integer,
    rating numeric
);


ALTER TABLE public.ratings OWNER TO basisdatay25;

--
-- Name: users; Type: TABLE; Schema: public; Owner: basisdatay25
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email text NOT NULL,
    username character varying(20) NOT NULL,
    password text NOT NULL,
    movie_ids integer[]
);


ALTER TABLE public.users OWNER TO basisdatay25;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: basisdatay25
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO basisdatay25;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: basisdatay25
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: basisdatay25
--

ALTER TABLE ONLY public.comments ALTER COLUMN comment_id SET DEFAULT nextval('public.comments_comment_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: basisdatay25
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: basisdatay25
--

COPY public.comments (comment_id, comment, user_id, movie_id, reply_id, created_at) FROM stdin;
1	Bagus	1	634649	\N	2023-06-06 17:17:30.511847
2	Biasa aja si	3	634649	1	2023-06-06 17:19:28.122136
3	iyain dah bang	1	634649	1	2023-06-06 17:34:33.761856
4	halo bang\n	14	303857	\N	2023-06-09 10:02:50.636637
5	halo dek	14	303857	\N	2023-06-09 10:03:03.269243
6	halo rel\n	11	303857	\N	2023-06-09 10:23:08.747456
7	halo rel\n	11	303857	\N	2023-06-09 10:23:08.775007
8	halo	11	303857	\N	2023-06-09 10:23:18.425565
9	yellow	11	569094	\N	2023-06-10 05:35:24.875946
10	halo	11	363088	\N	2023-06-10 05:55:59.4797
11	halo	11	569094	\N	2023-06-10 06:46:42.599752
12	ini film yang bagus, gua acc 	11	569094	\N	2023-06-10 06:46:57.918529
13	test2	11	51876	\N	2023-06-10 07:12:21.880555
14	gua pengen dah nonton film ini	11	264660	\N	2023-06-10 07:13:06.109906
15	halo	14	284054	\N	2023-06-10 08:09:39.255972
16	halo rel	11	284054	\N	2023-06-10 08:11:34.349734
17	gila pada nilai 4, ini 100 cuyy	11	569094	\N	2023-06-10 15:20:22.409797
18	I like this movie	16	129	\N	2023-06-11 13:59:29.936395
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: basisdatay25
--

COPY public.movies (movie_id, title, genre, rating, release_date) FROM stdin;
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: basisdatay25
--

COPY public.ratings (user_id, movie_id, rating) FROM stdin;
1	634649	4
11	447332	5
11	569094	5
14	303857	5
1	569094	3
14	536437	5
14	335983	4
14	98566	5
16	129	5
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: basisdatay25
--

COPY public.users (user_id, email, username, password, movie_ids) FROM stdin;
10	halolo@gmail.com	halo1	$2b$10$UH5HPte10oXY0eAouULtauuCuhnN6EhSO2jalUEz8A8jsMD1LV7vy	\N
5	undefined	farrel	$2b$10$rSzOdQBeVO7tZ/45Gc8x.O.19zCy7FIU32gbWP8JuaKJJ7.12peL2	\N
16	day00test@gmail.com	day0test2	$2b$10$OyZO.ReK9pmj9sKUXqtNieoBE/9F6PFFsi6O2SS4sD48Es3KxDgiq	\N
11	baculgeming@gmail.com	bacul	$2b$10$t9..q8jDDwmIZp1QbY0moeStAaS/2.mdAiiM35RaGWd96BSFbywrO	\N
12	test2@gmail.com	test2	$2b$10$d4nI81Ol68L41/bZSubDDu.M1vyy/AlGEH2SueTcDx5DmZzmer2r2	\N
13	test1@gmail.com	test1	$2b$10$5wM7D4B2B9ZfFUqgwOHsle16pYYZmvq9yosG319hdPN999RBh/gtG	\N
15	day0@gmail.com	day0test	$2b$10$I3PajNqSsDJngx9OcR8YAOWqJm/LRuiNQrDqCo16eS72npd6.fwqC	\N
3	B@gmail.com	B	$2b$10$RpsrimWEVrqSPDt/8e4uFuNwFoM4yVWvRgOekEoMjZYraSsHHNcde	\N
14	Farrel@gmail.com	Farrel	$2b$10$pT608diJrkhYuwX6FN/kIuG9Ux3kqYS9vjifuCKEHCCjeebQMA5Wq	\N
17	C@gmail.com	C	$2b$10$U3Tm2RA8OEM.UJ5qimn9GOwPhyckE.v3Gp11HWr7kyPH.5hJHfBNK	\N
1	A@gmail.com	A	$2b$10$KJgIyyGve3R1QZfwnoxaj.czdu16YAnBbOLBn3tXATl.hmXp4/1fO	{238,278,385687,569094}
18	D@gmail.com	D	$2b$10$hs0minru3gwAt8IGSwS1Ee2ApGMuJTJaKAQc2YCtBi/.75qaLOi2K	{1}
19	finaltest@gmail.com	finaltest	$2b$10$HKkEyWYDUoXmdhQ44FRGueXWVzsy.vkibLzwGr20CmXPq10EMNGtm	{983282}
\.


--
-- Name: comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: basisdatay25
--

SELECT pg_catalog.setval('public.comments_comment_id_seq', 18, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: basisdatay25
--

SELECT pg_catalog.setval('public.users_user_id_seq', 19, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: basisdatay25
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: basisdatay25
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movie_id);


--
-- Name: ratings ratings_user_id_movie_id_key; Type: CONSTRAINT; Schema: public; Owner: basisdatay25
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_movie_id_key UNIQUE (user_id, movie_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: basisdatay25
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: basisdatay25
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: basisdatay25
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

