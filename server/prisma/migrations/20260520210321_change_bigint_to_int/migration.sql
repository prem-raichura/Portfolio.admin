-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "institute_email" VARCHAR(255) NOT NULL,
    "recovery_email" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(500),
    "bio" TEXT,
    "users_links" JSONB,
    "skills" JSONB,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "headline" VARCHAR(255),
    "sub_headline" VARCHAR(255),
    "description" TEXT,
    "resume_url" VARCHAR(500),
    "profile_image" VARCHAR(500),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "API" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "api_key" VARCHAR(255) NOT NULL,
    "rate_limit" INTEGER NOT NULL DEFAULT 1000,
    "last_used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "API_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "authors_contributors" JSONB,
    "description" TEXT,
    "publisher" VARCHAR(255),
    "status" VARCHAR(255),
    "tags" JSONB,
    "links" JSONB,
    "thumbnail" VARCHAR(500),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "type" VARCHAR(255) NOT NULL,
    "date_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificates" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "link" VARCHAR(500),
    "title" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(500),
    "archive_status" VARCHAR(255),
    "issued_by" VARCHAR(255),
    "issue_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "links" JSONB,
    "company" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "location" VARCHAR(255),
    "mode" VARCHAR(255),

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255),
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_visit" INTEGER NOT NULL DEFAULT 0,
    "unique_visitor" INTEGER NOT NULL DEFAULT 0,
    "github_clicks" INTEGER NOT NULL DEFAULT 0,
    "live_demo_clicks" INTEGER NOT NULL DEFAULT 0,
    "resume_download" INTEGER NOT NULL DEFAULT 0,
    "project_clicks" INTEGER NOT NULL DEFAULT 0,
    "contact_submissions" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "api_key_id" INTEGER,
    "route" VARCHAR(255),
    "method" VARCHAR(10),
    "status_code" INTEGER,
    "request_data" JSONB,
    "response_data" JSONB,
    "ip_address" VARCHAR(100),
    "response_time" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_institute_email_key" ON "User"("institute_email");

-- CreateIndex
CREATE UNIQUE INDEX "Hero_user_id_key" ON "Hero"("user_id");

-- CreateIndex
CREATE INDEX "API_user_id_idx" ON "API"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_slug_key" ON "Projects"("slug");

-- CreateIndex
CREATE INDEX "Projects_user_id_idx" ON "Projects"("user_id");

-- CreateIndex
CREATE INDEX "Certificates_user_id_idx" ON "Certificates"("user_id");

-- CreateIndex
CREATE INDEX "Experience_user_id_idx" ON "Experience"("user_id");

-- CreateIndex
CREATE INDEX "Contact_user_id_idx" ON "Contact"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_user_id_key" ON "Dashboard"("user_id");

-- CreateIndex
CREATE INDEX "Logs_user_id_idx" ON "Logs"("user_id");

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "API" ADD CONSTRAINT "API_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
