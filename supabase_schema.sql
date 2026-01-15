-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User Table
create table if not exists "User" (
  "id" uuid primary key default uuid_generate_v4(),
  "telegramId" bigint unique not null,
  "username" text,
  "fullName" text,
  "phone" text,
  "email" text,
  "language" text default 'uz',
  "joinedAt" timestamp with time zone default now(),
  "coins" integer default 0,
  "xp" integer default 100,
  "level" integer default 1,
  "energy" integer default 100,
  "isPremium" boolean default false,
  "subscriptionType" integer default 0,
  "subscriptionEnd" timestamp with time zone,
  "totalDownloads" integer default 0,
  "dailyDownloads" integer default 0,
  "dailyAiUsage" integer default 0,
  "aiLimit" integer default 3,
  "lastActive" timestamp with time zone default now(),
  "streakCount" integer default 0
);

-- Create index on telegramId
create index if not exists "User_telegramId_idx" on "User" ("telegramId");

-- Movie Table
create table if not exists "Movie" (
  "id" uuid primary key default uuid_generate_v4(),
  "code" text unique,
  "fileId" text,
  "caption" text,
  "title" text,
  "genre" text,
  "quality" text default '720p',
  "year" integer,
  "description" text,
  "rating" double precision default 0,
  "views" integer default 0,
  "downloads" integer default 0,
  "isActive" boolean default true,
  "uploadDate" timestamp with time zone default now()
);

-- Book Table
create table if not exists "Book" (
  "id" uuid primary key default uuid_generate_v4(),
  "code" text unique,
  "fileId" text,
  "title" text,
  "author" text,
  "genre" text,
  "fileType" text default 'pdf',
  "description" text,
  "rating" double precision default 0,
  "views" integer default 0,
  "downloads" integer default 0,
  "isActive" boolean default true,
  "uploadDate" timestamp with time zone default now()
);

-- Podcast Table
create table if not exists "Podcast" (
  "id" uuid primary key default uuid_generate_v4(),
  "title" text not null,
  "description" text,
  "fileId" text,
  "contentType" text default 'audio',
  "category" text default 'General',
  "language" text default 'uz',
  "duration" integer,
  "host" text,
  "isActive" boolean default true,
  "views" integer default 0,
  "downloads" integer default 0,
  "createdAt" timestamp with time zone default now()
);

-- Product Table
create table if not exists "Product" (
  "id" uuid primary key default uuid_generate_v4(),
  "type" text not null,
  "title" text not null,
  "priceCoins" integer not null,
  "fileId" text,
  "category" text,
  "author" text,
  "description" text,
  "rating" double precision default 0,
  "image" text
);

-- InventoryItem Table
create table if not exists "InventoryItem" (
  "id" uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references "User"("id") on delete cascade,
  "productId" uuid not null references "Product"("id") on delete cascade,
  "fileId" text,
  "status" text default 'PENDING',
  "purchasedAt" timestamp with time zone default now(),
  "deliveredAt" timestamp with time zone
);

-- Course Table
create table if not exists "Course" (
  "id" uuid primary key default uuid_generate_v4(),
  "title" text not null,
  "description" text,
  "author" text not null,
  "level" text not null,
  "duration" text not null,
  "priceCoins" integer default 0,
  "image" text
);

-- Module Table
create table if not exists "Module" (
  "id" uuid primary key default uuid_generate_v4(),
  "courseId" uuid not null references "Course"("id") on delete cascade,
  "title" text not null,
  "order" integer not null
);

-- Lesson Table
create table if not exists "Lesson" (
  "id" uuid primary key default uuid_generate_v4(),
  "moduleId" uuid not null references "Module"("id") on delete cascade,
  "title" text not null,
  "content" text,
  "videoUrl" text,
  "duration" text,
  "order" integer not null
);

-- UserCourse Table
create table if not exists "UserCourse" (
  "id" uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references "User"("id") on delete cascade,
  "courseId" uuid not null references "Course"("id") on delete cascade,
  "progress" integer default 0,
  "completed" boolean default false,
  "enrolledAt" timestamp with time zone default now(),
  "lastAccess" timestamp with time zone default now(),
  unique("userId", "courseId")
);

-- MiningFarm Table
create table if not exists "MiningFarm" (
  "id" uuid primary key default uuid_generate_v4(),
  "userId" uuid unique not null references "User"("id") on delete cascade,
  "level" integer default 1,
  "xpPerHour" integer default 10,
  "lastCollected" timestamp with time zone default now(),
  "totalCollected" integer default 0
);

-- Quiz Table
create table if not exists "Quiz" (
  "id" uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references "User"("id") on delete cascade,
  "title" text not null,
  "topic" text,
  "category" text default 'General',
  "difficulty" text default 'medium',
  "questions" text not null,
  "score" integer default 0,
  "createdAt" timestamp with time zone default now()
);

-- QuizAttempt Table
create table if not exists "QuizAttempt" (
  "id" uuid primary key default uuid_generate_v4(),
  "quizId" uuid not null references "Quiz"("id") on delete cascade,
  "userId" text, 
  "score" integer not null,
  "totalQuestions" integer not null,
  "createdAt" timestamp with time zone default now()
);

-- Payment Table
create table if not exists "Payment" (
  "id" uuid primary key default uuid_generate_v4(),
  "paymentId" text unique not null,
  "userId" uuid not null references "User"("id") on delete cascade,
  "amount" integer not null,
  "currency" text default 'UZS',
  "status" text default 'pending',
  "provider" text,
  "createdAt" timestamp with time zone default now()
);

-- PromoCode Table
create table if not exists "PromoCode" (
  "id" uuid primary key default uuid_generate_v4(),
  "code" text unique not null,
  "discountPercent" integer default 0,
  "maxUses" integer default 1,
  "usedCount" integer default 0,
  "isActive" boolean default true
);

-- Referral Table
create table if not exists "Referral" (
  "id" uuid primary key default uuid_generate_v4(),
  "referrerId" uuid not null references "User"("id") on delete cascade,
  "referredId" uuid unique not null references "User"("id") on delete cascade,
  "xpGained" integer default 0,
  "createdAt" timestamp with time zone default now()
);

-- SupportTicket Table
create table if not exists "SupportTicket" (
  "id" uuid primary key default uuid_generate_v4(),
  "ticketId" text unique not null,
  "userId" uuid not null references "User"("id") on delete cascade,
  "category" text not null,
  "message" text not null,
  "status" text default 'open',
  "createdAt" timestamp with time zone default now()
);

-- ActivityHistory Table
create table if not exists "ActivityHistory" (
  "id" uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references "User"("id") on delete cascade,
  "action" text not null,
  "details" text,
  "createdAt" timestamp with time zone default now()
);

-- Favorite Table
create table if not exists "Favorite" (
  "id" uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references "User"("id") on delete cascade,
  "itemType" text not null,
  "itemId" text not null,
  "createdAt" timestamp with time zone default now(),
  unique("userId", "itemType", "itemId")
);

-- Review Table
create table if not exists "Review" (
  "id" uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references "User"("id") on delete cascade,
  "itemType" text not null,
  "itemId" text not null,
  "rating" integer not null,
  "comment" text,
  "createdAt" timestamp with time zone default now()
);

-- UserAchievement Table
create table if not exists "UserAchievement" (
  "id" uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references "User"("id") on delete cascade,
  "achievementId" text not null,
  "earnedAt" timestamp with time zone default now(),
  unique("userId", "achievementId")
);

-- AI Chat History Table
create table if not exists "AiChat" (
  "id" uuid primary key default uuid_generate_v4(),
  "userId" uuid not null references "User"("id") on delete cascade,
  "message" text,
  "response" text,
  "createdAt" timestamp with time zone default now()
);
