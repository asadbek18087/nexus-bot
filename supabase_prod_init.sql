-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Core)
create table if not exists "users" (
  "id" uuid primary key default uuid_generate_v4(),
  "telegram_id" bigint unique not null,
  "username" text,
  "full_name" text,
  "phone" text,
  "email" text,
  "language" text default 'uz',
  "joined_at" timestamp with time zone default now(),
  "coins" integer default 0,
  "xp" integer default 100,
  "level" integer default 1,
  "energy" integer default 100,
  "is_premium" boolean default false,
  "subscription_type" integer default 0,
  "subscription_end" timestamp with time zone,
  "total_downloads" integer default 0,
  "daily_downloads" integer default 0,
  "daily_ai_usage" integer default 0,
  "ai_limit" integer default 3,
  "last_active" timestamp with time zone default now(),
  "streak_count" integer default 0
);

create index if not exists "users_telegram_id_idx" on "users" ("telegram_id");

-- 2. Media Content
create table if not exists "movies" (
  "id" uuid primary key default uuid_generate_v4(),
  "code" text unique,
  "file_id" text,
  "caption" text,
  "title" text,
  "genre" text,
  "quality" text default '720p',
  "year" integer,
  "description" text,
  "rating" double precision default 0,
  "views" integer default 0,
  "downloads" integer default 0,
  "is_active" boolean default true,
  "upload_date" timestamp with time zone default now()
);

create table if not exists "books" (
  "id" uuid primary key default uuid_generate_v4(),
  "code" text unique,
  "file_id" text,
  "title" text,
  "author" text,
  "genre" text,
  "file_type" text default 'pdf',
  "description" text,
  "rating" double precision default 0,
  "views" integer default 0,
  "downloads" integer default 0,
  "is_active" boolean default true,
  "upload_date" timestamp with time zone default now()
);

create table if not exists "podcasts" (
  "id" uuid primary key default uuid_generate_v4(),
  "title" text not null,
  "description" text,
  "file_id" text,
  "content_type" text default 'audio',
  "category" text default 'General',
  "language" text default 'uz',
  "duration" integer,
  "host" text,
  "is_active" boolean default true,
  "views" integer default 0,
  "downloads" integer default 0,
  "created_at" timestamp with time zone default now()
);

-- 3. Store & Inventory
create table if not exists "products" (
  "id" uuid primary key default uuid_generate_v4(),
  "type" text not null,
  "title" text not null,
  "price_coins" integer not null,
  "file_id" text,
  "category" text,
  "author" text,
  "description" text,
  "rating" double precision default 0,
  "image" text
);

create table if not exists "inventory_items" (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "product_id" uuid not null references "products"("id") on delete cascade,
  "file_id" text,
  "status" text default 'PENDING',
  "purchased_at" timestamp with time zone default now(),
  "delivered_at" timestamp with time zone
);

-- 4. Education (Academy)
create table if not exists "courses" (
  "id" uuid primary key default uuid_generate_v4(),
  "title" text not null,
  "description" text,
  "author" text not null,
  "level" text not null,
  "duration" text not null,
  "price_coins" integer default 0,
  "image" text
);

create table if not exists "modules" (
  "id" uuid primary key default uuid_generate_v4(),
  "course_id" uuid not null references "courses"("id") on delete cascade,
  "title" text not null,
  "order" integer not null
);

create table if not exists "lessons" (
  "id" uuid primary key default uuid_generate_v4(),
  "module_id" uuid not null references "modules"("id") on delete cascade,
  "title" text not null,
  "content" text,
  "video_url" text,
  "duration" text,
  "order" integer not null
);

create table if not exists "user_courses" (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "course_id" uuid not null references "courses"("id") on delete cascade,
  "progress" integer default 0,
  "completed" boolean default false,
  "enrolled_at" timestamp with time zone default now(),
  "last_access" timestamp with time zone default now(),
  unique("user_id", "course_id")
);

-- 5. Mining System
create table if not exists "mining_farms" (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid unique not null references "users"("id") on delete cascade,
  "level" integer default 1,
  "xp_per_hour" integer default 10,
  "last_collected" timestamp with time zone default now(),
  "total_collected" integer default 0
);

-- 6. Quizzes
create table if not exists "quizzes" (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "title" text not null,
  "topic" text,
  "category" text default 'General',
  "difficulty" text default 'medium',
  "questions" text not null,
  "score" integer default 0,
  "created_at" timestamp with time zone default now()
);

create table if not exists "quiz_attempts" (
  "id" uuid primary key default uuid_generate_v4(),
  "quiz_id" uuid not null references "quizzes"("id") on delete cascade,
  "user_id" text,
  "score" integer not null,
  "total_questions" integer not null,
  "created_at" timestamp with time zone default now()
);

-- 7. Payments & Economy
create table if not exists "payments" (
  "id" uuid primary key default uuid_generate_v4(),
  "payment_id" text unique not null,
  "user_id" uuid not null references "users"("id") on delete cascade,
  "amount" integer not null,
  "currency" text default 'UZS',
  "status" text default 'pending',
  "provider" text,
  "payment_method" text,
  "description" text,
  "created_at" timestamp with time zone default now()
);

create table if not exists "promo_codes" (
  "id" uuid primary key default uuid_generate_v4(),
  "code" text unique not null,
  "discount_percent" integer default 0,
  "max_uses" integer default 1,
  "used_count" integer default 0,
  "is_active" boolean default true
);

create table if not exists "referrals" (
  "id" uuid primary key default uuid_generate_v4(),
  "referrer_id" uuid not null references "users"("id") on delete cascade,
  "referred_id" uuid unique not null references "users"("id") on delete cascade,
  "xp_gained" integer default 0,
  "created_at" timestamp with time zone default now()
);

-- 8. Support & System
create table if not exists "support_tickets" (
  "id" uuid primary key default uuid_generate_v4(),
  "ticket_id" text unique not null,
  "user_id" uuid not null references "users"("id") on delete cascade,
  "category" text not null,
  "message" text not null,
  "status" text default 'open',
  "created_at" timestamp with time zone default now()
);

create table if not exists "activity_history" (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "action" text not null,
  "details" text,
  "created_at" timestamp with time zone default now()
);

create table if not exists "favorites" (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "item_type" text not null,
  "item_id" text not null,
  "created_at" timestamp with time zone default now(),
  unique("user_id", "item_type", "item_id")
);

create table if not exists "reviews" (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "item_type" text not null,
  "item_id" text not null,
  "rating" integer not null,
  "comment" text,
  "created_at" timestamp with time zone default now()
);

create table if not exists "user_achievements" (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "achievement_id" text not null,
  "earned_at" timestamp with time zone default now(),
  unique("user_id", "achievement_id")
);

create table if not exists "ai_chats" (
  "id" uuid primary key default uuid_generate_v4(),
  "user_id" uuid not null references "users"("id") on delete cascade,
  "message" text,
  "response" text,
  "created_at" timestamp with time zone default now()
);
