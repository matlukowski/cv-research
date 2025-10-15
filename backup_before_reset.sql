--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

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

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    team_id integer NOT NULL,
    user_id integer,
    action text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    ip_address character varying(45)
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO postgres;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_keys (
    id integer NOT NULL,
    team_id integer NOT NULL,
    name character varying(100),
    key_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_used_at timestamp without time zone,
    revoked_at timestamp without time zone
);


ALTER TABLE public.api_keys OWNER TO postgres;

--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.api_keys_id_seq OWNER TO postgres;

--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    cv_id integer NOT NULL,
    job_position_id integer,
    application_type character varying(20) DEFAULT 'direct'::character varying NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    applied_at timestamp without time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp without time zone,
    review_notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO postgres;

--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: candidate_matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidate_matches (
    id integer NOT NULL,
    job_position_id integer NOT NULL,
    candidate_id integer NOT NULL,
    cv_id integer NOT NULL,
    match_score integer NOT NULL,
    ai_analysis text,
    strengths jsonb,
    weaknesses jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    summary text,
    application_id integer,
    match_type character varying(20) DEFAULT 'cross'::character varying NOT NULL
);


ALTER TABLE public.candidate_matches OWNER TO postgres;

--
-- Name: candidate_matches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidate_matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidate_matches_id_seq OWNER TO postgres;

--
-- Name: candidate_matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidate_matches_id_seq OWNED BY public.candidate_matches.id;


--
-- Name: candidates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidates (
    id integer NOT NULL,
    team_id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    email character varying(255),
    phone character varying(50),
    summary text,
    skills jsonb,
    experience jsonb,
    education jsonb,
    linkedin_url character varying(500),
    location character varying(200),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    years_of_experience integer,
    technical_skills jsonb,
    soft_skills jsonb,
    certifications jsonb,
    languages jsonb,
    key_achievements jsonb
);


ALTER TABLE public.candidates OWNER TO postgres;

--
-- Name: candidates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidates_id_seq OWNER TO postgres;

--
-- Name: candidates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidates_id_seq OWNED BY public.candidates.id;


--
-- Name: cvs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cvs (
    id integer NOT NULL,
    team_id integer NOT NULL,
    candidate_id integer,
    file_name character varying(255) NOT NULL,
    file_url text NOT NULL,
    file_size integer,
    mime_type character varying(100) DEFAULT 'application/pdf'::character varying,
    parsed_text text,
    email_subject character varying(500),
    email_from character varying(255),
    email_date timestamp without time zone,
    gmail_message_id character varying(255),
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    ai_validation_score integer,
    ai_validation_reason text,
    uploaded_at timestamp without time zone DEFAULT now() NOT NULL,
    processed_at timestamp without time zone
);


ALTER TABLE public.cvs OWNER TO postgres;

--
-- Name: cvs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cvs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cvs_id_seq OWNER TO postgres;

--
-- Name: cvs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cvs_id_seq OWNED BY public.cvs.id;


--
-- Name: features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.features (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.features OWNER TO postgres;

--
-- Name: features_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.features_id_seq OWNER TO postgres;

--
-- Name: features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.features_id_seq OWNED BY public.features.id;


--
-- Name: gmail_connections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gmail_connections (
    id integer NOT NULL,
    user_id integer NOT NULL,
    team_id integer NOT NULL,
    email character varying(255) NOT NULL,
    refresh_token text NOT NULL,
    access_token text,
    token_expiry timestamp without time zone,
    last_sync_at timestamp without time zone,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gmail_connections OWNER TO postgres;

--
-- Name: gmail_connections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gmail_connections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gmail_connections_id_seq OWNER TO postgres;

--
-- Name: gmail_connections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gmail_connections_id_seq OWNED BY public.gmail_connections.id;


--
-- Name: invitations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invitations (
    id integer NOT NULL,
    team_id integer NOT NULL,
    email character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    invited_by integer NOT NULL,
    invited_at timestamp without time zone DEFAULT now() NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL
);


ALTER TABLE public.invitations OWNER TO postgres;

--
-- Name: invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invitations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invitations_id_seq OWNER TO postgres;

--
-- Name: invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invitations_id_seq OWNED BY public.invitations.id;


--
-- Name: job_positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_positions (
    id integer NOT NULL,
    team_id integer NOT NULL,
    created_by integer NOT NULL,
    title character varying(200) NOT NULL,
    description text NOT NULL,
    requirements text NOT NULL,
    responsibilities text,
    location character varying(200),
    employment_type character varying(50),
    salary_range character varying(100),
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.job_positions OWNER TO postgres;

--
-- Name: job_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_positions_id_seq OWNER TO postgres;

--
-- Name: job_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_positions_id_seq OWNED BY public.job_positions.id;


--
-- Name: plan_features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_features (
    plan_id integer NOT NULL,
    feature_id integer NOT NULL,
    included boolean DEFAULT true NOT NULL,
    limit_monthly integer
);


ALTER TABLE public.plan_features OWNER TO postgres;

--
-- Name: plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plans (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    stripe_product_id text,
    stripe_price_id text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.plans OWNER TO postgres;

--
-- Name: plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plans_id_seq OWNER TO postgres;

--
-- Name: plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plans_id_seq OWNED BY public.plans.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    team_id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    user_id integer NOT NULL,
    team_id integer NOT NULL,
    role character varying(50) NOT NULL,
    joined_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_members_id_seq OWNER TO postgres;

--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    stripe_product_id text,
    plan_name character varying(50),
    subscription_status character varying(20)
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_id_seq OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: usage_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usage_events (
    id integer NOT NULL,
    team_id integer NOT NULL,
    project_id integer,
    event_key character varying(100) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    properties jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usage_events OWNER TO postgres;

--
-- Name: usage_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usage_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usage_events_id_seq OWNER TO postgres;

--
-- Name: usage_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usage_events_id_seq OWNED BY public.usage_events.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role character varying(20) DEFAULT 'member'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: webhook_deliveries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.webhook_deliveries (
    id integer NOT NULL,
    endpoint_id integer NOT NULL,
    event character varying(100) NOT NULL,
    status character varying(30) NOT NULL,
    response_status integer,
    payload jsonb,
    delivered_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.webhook_deliveries OWNER TO postgres;

--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.webhook_deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.webhook_deliveries_id_seq OWNER TO postgres;

--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.webhook_deliveries_id_seq OWNED BY public.webhook_deliveries.id;


--
-- Name: webhook_endpoints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.webhook_endpoints (
    id integer NOT NULL,
    team_id integer NOT NULL,
    url text NOT NULL,
    secret text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.webhook_endpoints OWNER TO postgres;

--
-- Name: webhook_endpoints_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.webhook_endpoints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.webhook_endpoints_id_seq OWNER TO postgres;

--
-- Name: webhook_endpoints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.webhook_endpoints_id_seq OWNED BY public.webhook_endpoints.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: candidate_matches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_matches ALTER COLUMN id SET DEFAULT nextval('public.candidate_matches_id_seq'::regclass);


--
-- Name: candidates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates ALTER COLUMN id SET DEFAULT nextval('public.candidates_id_seq'::regclass);


--
-- Name: cvs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cvs ALTER COLUMN id SET DEFAULT nextval('public.cvs_id_seq'::regclass);


--
-- Name: features id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features ALTER COLUMN id SET DEFAULT nextval('public.features_id_seq'::regclass);


--
-- Name: gmail_connections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gmail_connections ALTER COLUMN id SET DEFAULT nextval('public.gmail_connections_id_seq'::regclass);


--
-- Name: invitations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations ALTER COLUMN id SET DEFAULT nextval('public.invitations_id_seq'::regclass);


--
-- Name: job_positions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions ALTER COLUMN id SET DEFAULT nextval('public.job_positions_id_seq'::regclass);


--
-- Name: plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans ALTER COLUMN id SET DEFAULT nextval('public.plans_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: usage_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_events ALTER COLUMN id SET DEFAULT nextval('public.usage_events_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: webhook_deliveries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_deliveries ALTER COLUMN id SET DEFAULT nextval('public.webhook_deliveries_id_seq'::regclass);


--
-- Name: webhook_endpoints id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_endpoints ALTER COLUMN id SET DEFAULT nextval('public.webhook_endpoints_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	5a710a65173f1c510ebe80d425fbaa0696bdc850f77be850e3bff22e5bcc5ebb	1726443359662
2	4ef9694e3a8ee9d38433fb4d929ac818c33a442fa5dcffd1610bdaa55092670f	1759168807964
3	bc9192e0b616339435f48be1fd284917b9fd3023f3601e64a275f8b687ac61f8	1760371439232
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, team_id, user_id, action, "timestamp", ip_address) FROM stdin;
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_keys (id, team_id, name, key_hash, created_at, last_used_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, cv_id, job_position_id, application_type, status, applied_at, reviewed_at, review_notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: candidate_matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidate_matches (id, job_position_id, candidate_id, cv_id, match_score, ai_analysis, strengths, weaknesses, created_at, updated_at, summary, application_id, match_type) FROM stdin;
\.


--
-- Data for Name: candidates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidates (id, team_id, first_name, last_name, email, phone, summary, skills, experience, education, linkedin_url, location, created_at, updated_at, years_of_experience, technical_skills, soft_skills, certifications, languages, key_achievements) FROM stdin;
1	1	Mateusz	Łukowski	mateusz.lukowski@wp.pl	+48 578 360 277	Junior Full-Stack Developer (React/Node.js) oraz specjalista ds. dokumentacji technicznej z ok. 4 latami doświadczenia zawodowego. Kluczowe kompetencje techniczne to React, Node.js i TypeScript, uzupełnione praktyką w pracy z bazą Supabase oraz integracjami API (Google Gemini). Największym wyróżnikiem jest samodzielne zaprojektowanie, zbudowanie i wdrożenie produkcyjnie aplikacji AI do generowania CV i listów motywacyjnych (Vercel, Render). Posiada zaplecze w zakresie testowania manualnego oraz tworzenia dokumentacji techniczno‑ruchowej dla branży militarnej. Obecny poziom kariery: junior.	\N	[{"company": "AiJobdex", "endDate": "2025-07", "position": "Founder", "startDate": "2025-02", "description": "Samodzielnie zaprojektował i zbudował pełną aplikację webową generującą spersonalizowane CV i listy motywacyjne dopasowane do ofert pracy. Wykorzystał React, Node.js, TypeScript, bazę Supabase oraz integracje z Google Gemini API; wdrożył rozwiązanie na Vercel i Render."}, {"company": "EJ Tech Consulting", "endDate": null, "position": "Specjalista ds. zarządzania dokumentacją techniczną", "startDate": "2024-03", "description": "Tworzy i zarządza dokumentacją techniczno‑ruchową dla klienta z branży militarnej produkującego podzespoły elektroniczne. Odpowiada za przygotowanie materiałów graficznych i technicznych w CorelDRAW oraz Adobe Illustrator, dbając o spójność i kompletność dokumentacji."}, {"company": "Coyote Logistics", "endDate": "2023-11", "position": "Specjalista ds. dystrybucji", "startDate": "2021-08", "description": "Obsługa przewoźników na rynku amerykańskim, monitorowanie ładunków i terminowości dostaw, raportowanie incydentów i przekazywanie informacji do zespołu operacyjnego. Współpraca międzydziałowa i utrzymywanie wysokiej jakości komunikacji z interesariuszami."}]	[{"field": "Ekonomia (specjalizacja: Ekonomia menedżerska)", "degree": null, "institution": "Politechnika Opolska", "graduationYear": "2018"}, {"field": "Zarządzanie (specjalizacja: Zarządzanie logistyczno‑marketingowe)", "degree": null, "institution": "Uniwersytet Opolski", "graduationYear": "2016"}]	https://www.linkedin.com/in/mateusz-łukowski-015637245	Wrocław, Polska	2025-10-14 17:12:13.851661	2025-10-14 17:12:13.851661	4	["React", "Node.js", "TypeScript", "HTML", "CSS", "Git", "MySQL", "Supabase", "Google Gemini API", "Vercel", "Render", "CorelDRAW", "Adobe Illustrator", "Manual Testing", "LLM", "Qwen 32B"]	["Komunikacja", "Myślenie analityczne", "Myślenie krytyczne", "Organizacja pracy", "Praca zespołowa", "Samodzielność", "Rozwiązywanie problemów"]	["Tester Manualny (CodersLab, 2022)"]	[{"level": "Advanced", "language": "Angielski"}]	["Wdrożenie produkcyjne autorskiej aplikacji AIJobdex na Vercel i Render (React, Node.js, TypeScript, Supabase, Google Gemini API).", "Zbudowanie aplikacji MyLLM z pamięcią wektorową i obsługą wielu modeli LLM poprzez własne klucze API.", "Opracowanie aplikacji YouTube Free Summary wykorzystującej lokalny model Qwen 32B do generowania streszczeń o różnym poziomie szczegółowości.", "Utworzenie i prowadzenie kompletnej dokumentacji techniczno‑ruchowej dla klienta z branży militarnej z użyciem CorelDRAW i Adobe Illustrator."]
2	1	Karolina	Lechowicz	karolina.lechowicz111@wp.pl	+48 790 890 523	Junior Marketing Specialist z około 3 latami łącznego doświadczenia, łącząca praktykę w e-commerce i prowadzeniu własnej działalności. Specjalizuje się w social media, tworzeniu treści i podstawach kampanii płatnych, z naciskiem na analizę i optymalizację pod algorytmy. Top 3 umiejętności techniczne: Social Media Management, Meta Ads oraz Adobe Photoshop. Jej wyróżnikiem jest uruchomienie i samodzielne prowadzenie własnej marki online (strona WWW, profile społecznościowe i newsletter), co potwierdza proaktywność i end-to-end podejście do marketingu. Obecny poziom kariery: junior.	\N	[{"company": "Własna działalność gospodarcza", "endDate": null, "position": "Przedsiębiorca", "startDate": "2023-12", "description": "Prowadzenie własnej marki: usługi konsultacyjne, wspólne zakupy oraz przegląd szafy. Zarządzanie stroną internetową, prowadzenie profili w mediach społecznościowych i wysyłka newsletterów. Tworzenie angażujących treści wizualnych i tekstowych oraz optymalizacja publikacji pod algorytmy social media w celu zwiększenia zasięgu i zaangażowania. Budowanie relacji z klientami oraz rozwijanie kompetencji w marketingu online end-to-end."}, {"company": "GI BPO Finance", "endDate": "2025-05", "position": "Młodszy Specjalista e-commerce", "startDate": "2022-12", "description": "Obsługa wniosków kredytów ratalnych oraz telefoniczne wsparcie klientów. Bezpośrednia komunikacja z klientem, rozwiązywanie problemów i odpowiadanie na zapytania, co rozwijało umiejętności komunikacyjne i interpersonalne. Doświadczenie w pracy zespołowej i procesowej, przydatne w projektach marketingowych wymagających koordynacji i terminowości."}]	[{"field": "Mikrobiznes", "degree": null, "institution": "Uniwersytet WSB Merito", "graduationYear": null}]	\N	Wrocław, Polska	2025-10-14 17:13:32.245178	2025-10-14 17:13:32.245178	3	["Social Media Management", "Meta Ads", "Adobe Photoshop", "Canva", "Adobe Illustrator", "Figma", "Content Marketing", "Copywriting (podstawy)", "Storytelling (podstawy)", "Email Marketing", "Analiza danych marketingowych", "Optymalizacja treści pod algorytmy social media", "Obsługa komputera", "Znajomość narzędzi cyfrowych"]	["Komunikacja", "Praca w zespole", "Organizacja pracy własnej", "Obsługa klienta", "Myślenie analityczne", "Rozwiązywanie problemów", "Kreatywność", "Elastyczność i chęć nauki", "Umiejętności interpersonalne"]	\N	\N	\N
\.


--
-- Data for Name: cvs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cvs (id, team_id, candidate_id, file_name, file_url, file_size, mime_type, parsed_text, email_subject, email_from, email_date, gmail_message_id, status, ai_validation_score, ai_validation_reason, uploaded_at, processed_at) FROM stdin;
\.


--
-- Data for Name: features; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.features (id, code, name, description) FROM stdin;
\.


--
-- Data for Name: gmail_connections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gmail_connections (id, user_id, team_id, email, refresh_token, access_token, token_expiry, last_sync_at, is_active, created_at, updated_at) FROM stdin;
1	1	1	mateusz.lukowski3@gmail.com	0d52630a5b6d72fbe8f34eae3fce91b16ec550661361f7074848e8d9e7523aaf3a19586491f70498ab647c1b8a1c166c27ad89ab5705e8c3ea0108ad52d3166c:55334c85c8470d5cfb096e1b78fce471:6aadb4df4e70cff6553e1433151b7eb1:ee682a59a19200908227eb50763986d2ab1f9a890b91b18019025197a67e82292c5f5832cde21e815963788b43e7148a3b9fe7fd191bad9c152d09ae92cdd3d4df1940c96af1e1c8d9915a046c6220d73ff5f8ee71e2a52a9115a183f454ff6187bea57ef64691	6bdf23bd99aac67606101916b4ae479338a3a65c756982fc9006cc44b4801ccc408523f9ec3cd44361d00eb96114e5264688dcd8b666925e93477edfd03bc6d7:5f6d0740cd4e68ac92f4ac5a9a2f0f24:4bd0ea184c50ea1de5742633a8f95d96:fb3eff15cc12efe403017e942dc653845bb8ff07324f1529498e6d7865d18d78a5ec5df66a1a2e3c9fbe5c3e73ae3daf941d8c3ef319d01da64adbee7ce85c8e9773600874630ef4f716b0206b54c59229ace41ff2d80c9fac7e6f634b6aa18f336bfcf31161056672777e27891ef494a50ec380c8696c41b3d301677ce9222986750e8995df14a4b0f5d7600f87760e2a588a5bdcdbc22681ac3a0c186800eb875916feb591e0e05bd7af1d65f130a4478729c993471e2f0003aa13b0d0d97f737293a64f61ad05f85d19860b09866062243a27285e09203be02c966b35703954426d140745b53093ee374c7034d187b5841ca74aa7c66ed9830edc7b	2025-10-14 15:21:31.023	2025-10-14 15:12:22.755	t	2025-10-14 14:21:32.289931	2025-10-14 14:21:32.289931
\.


--
-- Data for Name: invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invitations (id, team_id, email, role, invited_by, invited_at, status) FROM stdin;
\.


--
-- Data for Name: job_positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_positions (id, team_id, created_by, title, description, requirements, responsibilities, location, employment_type, salary_range, status, created_at, updated_at) FROM stdin;
1	1	1	AI Developer	Informacje o ofercie pracy\nNaszą misją jest nowoczesne kształcenie. Umożliwiamy zdobywanie wiedzy i poszerzanie kwalifikacji zawodowych poprzez prowadzenie studiów pierwszego stopnia oraz studiów podyplomowych, prowadzonych również online. Jesteśmy przekonani, że ciągła edukacja i umiejętność dostosowania się do zmian jest warunkiem odniesienia sukcesu w życiu, także zawodowym. Dlatego, jako firma nie możemy przejść obojętnie obok obszaru sztucznej inteligencji!\n\n\nJeśli jesteś zafascynowany AI i chcesz uczestniczyć w tworzeniu przyszłości, dołącz do nas. Oferujemy dynamiczne środowisko pracy, gdzie będziesz mógł rozwijać swoje umiejętności i zdobywać nowe doświadczenia. Zadbamy również o to, abyś miał dostęp do najnowszych narzędzi i technologii.\n\n\nTwój zakres obowiązków:\n\nprojektowanie / implementacja / wdrażanie / utrzymywanie narzędzi do automatyzacji pracy wewnętrznych działów biznesowych w oparciu o różne techniki oraz podejścia,\nprojektowanie / implementacja / wdrażanie / utrzymywanie narzędzi optymalizujących pracę w działach biznesowych,\nintegracja wdrażanych narzędzi z istniejącymi systemami zarówno in-hause dev jak i rozwiązaniami firm trzecich,\ntworzenie, rozwój i wsparcie wytwarzanych systemów edukacyjno-szkoleniowych,\nzapewnienie wysokiej jakości dostarczanych rozwiązań,\nwspółpraca z innymi obszarami działu IT oraz firmy.	Nasze wymagania:\n\nIdealnie gdybyś miała/miał praktyczne doświadczenie w większości niżej wskazanych obszarach, jednak nie jest to wymóg konieczny. \n\nJeżeli czujesz się silna/silny z części niżej wskazanych zagadnień to śmiało aplikuj!\ndoświadczenie w pracy na podobnym stanowisku a z naszej strony gwarantujemy znalezienie ciekawych projektów zarówno dla seniora jak i mida,\npraktyczna znajomość języka Python,\npraktyczna znajomość RESTful API wraz z dokumentacją OpenAPI,\npraktyczna znajomość framework'ów React i FastAPI,\npraktyczna znajomość OpenAI API,\npraktyczna znajomość silnika bazy danych MySQL lub pokrewnych systemów baz danych SQL,\npraktyczna znajomość Docker'a na poziomie korzystania z gotowych kontenerów i/lub tworzenia obrazów,\npraktyczna znajomość narzędzi klasy DevSecOps (CI/CD) np. GitLab,\npraktyczna znajomość Elasticsearch'a,\npraktyczna znajomość rozwiązań przeznaczonych do kolejkowania np. RabbitMQ, Redis,\npraktyczne doświadczenie w projektowaniu, tworzeniu oraz utrzymywaniu mikrousług,\npraktyczna umiejętność analizy kody oraz wykonywania code review,\npraktyczna znajomość zagadnień związanych z mapowaniem obiektowo-relacyjnym (ORM).\n\n\nMile widziane:\n\numiejętność korzystania z bibliotek AI/ML pozwalających na wykorzystanie gotowych modeli,\npraktyczna znajomość techniki RAG (Retrieval Augmented Generation) dla Generative AI,\numiejętność analizy danych z wykorzystaniem narzędzi np. pandas, NumPy, etc.,\numiejętność wizualizacji danych z wykorzystaniem narzędzi np. Matplotlib, seaborn, etc.,\nznajomość narzędzi służących do automatyzacji procesów np. Beautiful Soup, Selenium, etc.,\nPython - umiejętność zarządzania pakietami (pip),\nznajomość systemu kontroli wersji Git,\npraktyczna znajomość języka PHP,\npraktyczna umiejętność tworzenia paczek za pomocą Composera,\npraktyczna znajomość framework'ów Laravel i Symfony,\nznajomość Kibany oraz Logstash'a będącymi uzupełnieniem Elasticsearch'a.		Remote	full-time	20 000 - 25 000 PLN	active	2025-10-14 10:43:01.372331	2025-10-14 14:53:03.804
2	1	1	Social media manager	Poszukujemy kreatywnej i zorientowanej na wyniki osoby na stanowisko Social Media Managera, która będzie odpowiedzialna za budowanie i zarządzanie obecnością naszej marki w mediach społecznościowych. Będziesz tworzyć angażujące treści, rozwijać strategię komunikacji oraz budować społeczność wokół naszej marki.Główne obowiązki:\n\nTworzenie i realizacja strategii social media zgodnej z celami biznesowymi firmy\nPlanowanie, tworzenie i publikowanie contentu na różnych platformach (Facebook, Instagram, LinkedIn, TikTok, Twitter/X)\nZarządzanie kalendarzem publikacji i dbanie o regularność komunikacji\nMonitorowanie i moderowanie komentarzy oraz wiadomości, budowanie relacji ze społecznością\nAnaliza wyników kampanii i raportowanie kluczowych wskaźników (engagement, reach, conversions)\nWspółpraca z działem graficznym, marketingu i sprzedaży\nŚledzenie trendów w social media i wdrażanie najlepszych praktyk\nZarządzanie budżetem reklamowym na platformach społecznościowych\nObsługa sytuacji kryzysowych w mediach społecznościowych	Social Media Manager\nOpis stanowiska\nPoszukujemy kreatywnej i zorientowanej na wyniki osoby na stanowisko Social Media Managera, która będzie odpowiedzialna za budowanie i zarządzanie obecnością naszej marki w mediach społecznościowych. Będziesz tworzyć angażujące treści, rozwijać strategię komunikacji oraz budować społeczność wokół naszej marki.\nGłówne obowiązki:\n\nTworzenie i realizacja strategii social media zgodnej z celami biznesowymi firmy\nPlanowanie, tworzenie i publikowanie contentu na różnych platformach (Facebook, Instagram, LinkedIn, TikTok, Twitter/X)\nZarządzanie kalendarzem publikacji i dbanie o regularność komunikacji\nMonitorowanie i moderowanie komentarzy oraz wiadomości, budowanie relacji ze społecznością\nAnaliza wyników kampanii i raportowanie kluczowych wskaźników (engagement, reach, conversions)\nWspółpraca z działem graficznym, marketingu i sprzedaży\nŚledzenie trendów w social media i wdrażanie najlepszych praktyk\nZarządzanie budżetem reklamowym na platformach społecznościowych\nObsługa sytuacji kryzysowych w mediach społecznościowych\n\nWymagania\nWymagania niezbędne:\n\nMinimum 2 lata doświadczenia w zarządzaniu social media dla marek komercyjnych\nDoskonała znajomość platform społecznościowych (Facebook, Instagram, LinkedIn, TikTok)\nUmiejętność tworzenia angażującego contentu tekstowego i wizualnego\nZnajomość narzędzi do zarządzania social media (np. Meta Business Suite, Hootsuite, Buffer)\nUmiejętność analizy danych i wyciągania wniosków (Google Analytics, native analytics)\nKreatywność i wyczucie estetyki\nDoskonała komunikacja pisemna w języku polskim\nSamodzielność i proaktywność w działaniu\n\nMile widziane:\n\nWykształcenie wyższe z zakresu marketingu, PR, dziennikarstwa lub pokrewnych\nDoświadczenie w prowadzeniu płatnych kampanii reklamowych (Meta Ads, LinkedIn Ads)\nZnajomość podstaw grafiki i umiejętność pracy w Canva/Adobe Creative Suite\nDoświadczenie z narzędziami do tworzenia video (CapCut, Premiere Pro)\nZnajomość języka angielskiego na poziomie komunikatywnym\nPortfel zrealizowanych kampanii social media	\N	remote	full-time	7000 - 15000 PLN	active	2025-10-14 17:34:15.728596	2025-10-14 17:34:15.728596
3	1	1	Przedstawiciel handlowy	Poszukujemy zmotywowanej i komunikatywnej osoby na stanowisko Przedstawiciela Handlowego, która będzie odpowiedzialna za pozyskiwanie nowych klientów, budowanie długotrwałych relacji biznesowych oraz realizację ambitnych celów sprzedażowych. Będziesz reprezentować naszą firmę w terenie, prezentować ofertę i aktywnie rozwijać portfel klientów.Główne obowiązki:\n\nAktywne pozyskiwanie nowych klientów B2B/B2C w wyznaczonym regionie\nProwadzenie negocjacji handlowych i finalizowanie transakcji\nPrezentacja produktów/usług oraz doradztwo w zakresie oferty firmy\nBudowanie i utrzymywanie długotrwałych relacji z klientami\nRealizacja wyznaczonych planów sprzedażowych i celów handlowych\nMonitorowanie rynku i działań konkurencji\nPrzygotowywanie ofert handlowych i umów współpracy\nRegularne wizyty u klientów oraz uczestnictwo w spotkaniach handlowych\nRaportowanie wyników sprzedaży i prowadzenie dokumentacji w systemie CRM\nReprezentowanie firmy na targach i wydarzeniach branżowych	Wymagania\nWymagania niezbędne:\n\nMinimum 1 rok doświadczenia w sprzedaży (preferowane w sprzedaży bezpośredniej)\nDoskonałe umiejętności komunikacyjne i negocjacyjne\nNastawienie na osiąganie celów i wysoka motywacja do pracy\nPrawo jazdy kategorii B (jazda własnym samochodem)\nUmiejętność budowania relacji i przekonywania do produktu/usługi\nOdporność na stres i umiejętność radzenia sobie z odmową\nSamodzielność, systematyczność i zorganizowanie\nObsługa komputera i podstawowa znajomość MS Office\n\nMile widziane:\n\nWykształcenie wyższe lub średnie o profilu ekonomicznym, handlowym\nDoświadczenie w branży [tutaj wpisz konkretną branżę]\nZnajomość systemów CRM (Salesforce, HubSpot, Comarch)\nPosiadanie własnej bazy kontaktów biznesowych\nZnajomość technik sprzedaży i negocjacji\nZnajomość języka angielskiego\nDoświadczenie w sprzedaży B2B\nUmiejętność pracy pod presją czasu	\N	Wrocław	full-time	6000 - 10000 PLN	active	2025-10-14 17:44:08.181373	2025-10-14 17:44:08.181373
\.


--
-- Data for Name: plan_features; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_features (plan_id, feature_id, included, limit_monthly) FROM stdin;
\.


--
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plans (id, code, name, stripe_product_id, stripe_price_id, created_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, team_id, name, slug, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_members (id, user_id, team_id, role, joined_at) FROM stdin;
1	1	1	owner	2025-10-14 10:41:56.887969
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name, created_at, updated_at, stripe_customer_id, stripe_subscription_id, stripe_product_id, plan_name, subscription_status) FROM stdin;
1	user-user_341APZIoFAi72Q4Hcfx1GqoojhK@clerk.local's Team	2025-10-14 10:41:56.879702	2025-10-14 10:41:56.879702	\N	\N	\N	\N	\N
\.


--
-- Data for Name: usage_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usage_events (id, team_id, project_id, event_key, quantity, properties, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, created_at, updated_at, deleted_at) FROM stdin;
1	\N	user-user_341APZIoFAi72Q4Hcfx1GqoojhK@clerk.local	clerk	owner	2025-10-14 10:41:56.851174	2025-10-14 10:41:56.851174	\N
\.


--
-- Data for Name: webhook_deliveries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.webhook_deliveries (id, endpoint_id, event, status, response_status, payload, delivered_at) FROM stdin;
\.


--
-- Data for Name: webhook_endpoints; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.webhook_endpoints (id, team_id, url, secret, active, created_at) FROM stdin;
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 3, true);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, false);


--
-- Name: api_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_keys_id_seq', 1, false);


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_id_seq', 1, false);


--
-- Name: candidate_matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidate_matches_id_seq', 8, true);


--
-- Name: candidates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidates_id_seq', 2, true);


--
-- Name: cvs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cvs_id_seq', 77, true);


--
-- Name: features_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.features_id_seq', 1, false);


--
-- Name: gmail_connections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gmail_connections_id_seq', 1, true);


--
-- Name: invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invitations_id_seq', 1, false);


--
-- Name: job_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_positions_id_seq', 3, true);


--
-- Name: plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plans_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 1, false);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_members_id_seq', 1, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 1, true);


--
-- Name: usage_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usage_events_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.webhook_deliveries_id_seq', 1, false);


--
-- Name: webhook_endpoints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.webhook_endpoints_id_seq', 1, false);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: candidate_matches candidate_matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_matches
    ADD CONSTRAINT candidate_matches_pkey PRIMARY KEY (id);


--
-- Name: candidates candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_pkey PRIMARY KEY (id);


--
-- Name: cvs cvs_gmail_message_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cvs
    ADD CONSTRAINT cvs_gmail_message_id_unique UNIQUE (gmail_message_id);


--
-- Name: cvs cvs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cvs
    ADD CONSTRAINT cvs_pkey PRIMARY KEY (id);


--
-- Name: features features_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_code_unique UNIQUE (code);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: gmail_connections gmail_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gmail_connections
    ADD CONSTRAINT gmail_connections_pkey PRIMARY KEY (id);


--
-- Name: invitations invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_pkey PRIMARY KEY (id);


--
-- Name: job_positions job_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions
    ADD CONSTRAINT job_positions_pkey PRIMARY KEY (id);


--
-- Name: plan_features plan_features_plan_id_feature_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT plan_features_plan_id_feature_id_pk PRIMARY KEY (plan_id, feature_id);


--
-- Name: plans plans_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_code_unique UNIQUE (code);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_slug_unique UNIQUE (slug);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: teams teams_stripe_customer_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_stripe_customer_id_unique UNIQUE (stripe_customer_id);


--
-- Name: teams teams_stripe_subscription_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_stripe_subscription_id_unique UNIQUE (stripe_subscription_id);


--
-- Name: usage_events usage_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_events
    ADD CONSTRAINT usage_events_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webhook_deliveries webhook_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_pkey PRIMARY KEY (id);


--
-- Name: webhook_endpoints webhook_endpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_endpoints
    ADD CONSTRAINT webhook_endpoints_pkey PRIMARY KEY (id);


--
-- Name: applications_cv_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX applications_cv_id_idx ON public.applications USING btree (cv_id);


--
-- Name: applications_job_position_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX applications_job_position_id_idx ON public.applications USING btree (job_position_id);


--
-- Name: applications_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX applications_status_idx ON public.applications USING btree (status);


--
-- Name: candidate_matches_application_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX candidate_matches_application_id_idx ON public.candidate_matches USING btree (application_id);


--
-- Name: candidate_matches_match_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX candidate_matches_match_type_idx ON public.candidate_matches USING btree (match_type);


--
-- Name: activity_logs activity_logs_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: activity_logs activity_logs_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: api_keys api_keys_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: applications applications_cv_id_cvs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_cv_id_cvs_id_fk FOREIGN KEY (cv_id) REFERENCES public.cvs(id);


--
-- Name: applications applications_job_position_id_job_positions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_job_position_id_job_positions_id_fk FOREIGN KEY (job_position_id) REFERENCES public.job_positions(id);


--
-- Name: candidate_matches candidate_matches_application_id_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_matches
    ADD CONSTRAINT candidate_matches_application_id_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.applications(id);


--
-- Name: candidate_matches candidate_matches_candidate_id_candidates_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_matches
    ADD CONSTRAINT candidate_matches_candidate_id_candidates_id_fk FOREIGN KEY (candidate_id) REFERENCES public.candidates(id);


--
-- Name: candidate_matches candidate_matches_cv_id_cvs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_matches
    ADD CONSTRAINT candidate_matches_cv_id_cvs_id_fk FOREIGN KEY (cv_id) REFERENCES public.cvs(id);


--
-- Name: candidate_matches candidate_matches_job_position_id_job_positions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_matches
    ADD CONSTRAINT candidate_matches_job_position_id_job_positions_id_fk FOREIGN KEY (job_position_id) REFERENCES public.job_positions(id);


--
-- Name: candidates candidates_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: cvs cvs_candidate_id_candidates_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cvs
    ADD CONSTRAINT cvs_candidate_id_candidates_id_fk FOREIGN KEY (candidate_id) REFERENCES public.candidates(id);


--
-- Name: cvs cvs_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cvs
    ADD CONSTRAINT cvs_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: gmail_connections gmail_connections_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gmail_connections
    ADD CONSTRAINT gmail_connections_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: gmail_connections gmail_connections_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gmail_connections
    ADD CONSTRAINT gmail_connections_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invitations invitations_invited_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_invited_by_users_id_fk FOREIGN KEY (invited_by) REFERENCES public.users(id);


--
-- Name: invitations invitations_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: job_positions job_positions_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions
    ADD CONSTRAINT job_positions_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: job_positions job_positions_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions
    ADD CONSTRAINT job_positions_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: plan_features plan_features_feature_id_features_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT plan_features_feature_id_features_id_fk FOREIGN KEY (feature_id) REFERENCES public.features(id);


--
-- Name: plan_features plan_features_plan_id_plans_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT plan_features_plan_id_plans_id_fk FOREIGN KEY (plan_id) REFERENCES public.plans(id);


--
-- Name: projects projects_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: team_members team_members_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: team_members team_members_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: usage_events usage_events_project_id_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_events
    ADD CONSTRAINT usage_events_project_id_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: usage_events usage_events_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_events
    ADD CONSTRAINT usage_events_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: webhook_deliveries webhook_deliveries_endpoint_id_webhook_endpoints_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_endpoint_id_webhook_endpoints_id_fk FOREIGN KEY (endpoint_id) REFERENCES public.webhook_endpoints(id);


--
-- Name: webhook_endpoints webhook_endpoints_team_id_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_endpoints
    ADD CONSTRAINT webhook_endpoints_team_id_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- PostgreSQL database dump complete
--

