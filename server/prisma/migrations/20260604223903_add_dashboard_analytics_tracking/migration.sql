-- AlterTable
ALTER TABLE "DashboardAnalytics" ADD COLUMN     "browser" VARCHAR(100),
ADD COLUMN     "country" VARCHAR(100),
ADD COLUMN     "device_type" VARCHAR(50),
ADD COLUMN     "ip_address" VARCHAR(100),
ADD COLUMN     "os" VARCHAR(100),
ADD COLUMN     "path" VARCHAR(500),
ADD COLUMN     "project_id" INTEGER,
ADD COLUMN     "project_slug" VARCHAR(255),
ADD COLUMN     "referrer" VARCHAR(500),
ADD COLUMN     "session_id" VARCHAR(255),
ADD COLUMN     "source" VARCHAR(100),
ADD COLUMN     "user_agent" VARCHAR(500),
ADD COLUMN     "visitor_id" VARCHAR(255);

-- CreateTable
CREATE TABLE "VisitorSession" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "visitor_id" VARCHAR(255) NOT NULL,
    "session_id" VARCHAR(255),
    "source" VARCHAR(100),
    "country" VARCHAR(100),
    "device_type" VARCHAR(50),
    "browser" VARCHAR(100),
    "os" VARCHAR(100),
    "first_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VisitorSession_user_id_country_idx" ON "VisitorSession"("user_id", "country");

-- CreateIndex
CREATE INDEX "VisitorSession_user_id_last_seen_idx" ON "VisitorSession"("user_id", "last_seen");

-- CreateIndex
CREATE UNIQUE INDEX "VisitorSession_user_id_visitor_id_key" ON "VisitorSession"("user_id", "visitor_id");

-- CreateIndex
CREATE INDEX "DashboardAnalytics_user_id_created_at_idx" ON "DashboardAnalytics"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "DashboardAnalytics_user_id_type_idx" ON "DashboardAnalytics"("user_id", "type");

-- CreateIndex
CREATE INDEX "DashboardAnalytics_user_id_country_idx" ON "DashboardAnalytics"("user_id", "country");

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
