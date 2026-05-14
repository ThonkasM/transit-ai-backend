-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CITIZEN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "createdById" TEXT,
    CONSTRAINT "users_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "oauth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bus_lines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#FF0000',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "adminId" TEXT NOT NULL,
    CONSTRAINT "bus_lines_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "terminals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "busLineId" TEXT,
    CONSTRAINT "terminals_busLineId_fkey" FOREIGN KEY ("busLineId") REFERENCES "bus_lines" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "internos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "busLineId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "plateNumber" TEXT,
    "model" TEXT,
    "capacity" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "internos_busLineId_fkey" FOREIGN KEY ("busLineId") REFERENCES "bus_lines" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "busLineId" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "credentialStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "lastLoginAt" DATETIME,
    CONSTRAINT "drivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "drivers_busLineId_fkey" FOREIGN KEY ("busLineId") REFERENCES "bus_lines" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shifts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driverId" TEXT NOT NULL,
    "internoId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "daysOfWeek" JSONB NOT NULL DEFAULT [],
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "shifts_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shifts_internoId_fkey" FOREIGN KEY ("internoId") REFERENCES "internos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shifts_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "daily_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "internoId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "assignedById" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "daily_assignments_internoId_fkey" FOREIGN KEY ("internoId") REFERENCES "internos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "daily_assignments_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "daily_assignments_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "busLineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "importedFileUrl" TEXT,
    "importedAt" DATETIME,
    "waypoints" JSONB NOT NULL DEFAULT [],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "lastEditedById" TEXT,
    CONSTRAINT "routes_busLineId_fkey" FOREIGN KEY ("busLineId") REFERENCES "bus_lines" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "route_stops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "stopId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "estimatedMinutesFromStart" INTEGER,
    CONSTRAINT "route_stops_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "route_stops_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "stops" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "saved_journeys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "fromLat" REAL NOT NULL,
    "fromLng" REAL NOT NULL,
    "fromLabel" TEXT,
    "toLat" REAL NOT NULL,
    "toLng" REAL NOT NULL,
    "toLabel" TEXT,
    "lastResult" JSONB,
    "lastCalculatedAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "saved_journeys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "journey_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "fromLat" REAL NOT NULL,
    "fromLng" REAL NOT NULL,
    "toLat" REAL NOT NULL,
    "toLng" REAL NOT NULL,
    "criteria" TEXT NOT NULL DEFAULT 'FASTEST',
    "segments" JSONB NOT NULL,
    "totalMinutes" INTEGER NOT NULL,
    "totalTransfers" INTEGER NOT NULL,
    "totalWalkMeters" REAL NOT NULL,
    "aiScore" REAL,
    "aiRecommendation" TEXT,
    "computedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "journey_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "content" TEXT,
    "type" TEXT NOT NULL,
    "data" JSONB,
    "targetRole" TEXT,
    "targetUserId" TEXT,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    CONSTRAINT "notifications_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "notifications_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notification_receipts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" DATETIME,
    "pushSent" BOOLEAN NOT NULL DEFAULT false,
    "pushToken" TEXT,
    CONSTRAINT "notification_receipts_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "notification_receipts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driverId" TEXT NOT NULL,
    "internoId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "dailyAssignmentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "endReason" TEXT,
    "estimatedDurationMinutes" INTEGER,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    CONSTRAINT "trips_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trips_internoId_fkey" FOREIGN KEY ("internoId") REFERENCES "internos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trips_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trips_dailyAssignmentId_fkey" FOREIGN KEY ("dailyAssignmentId") REFERENCES "daily_assignments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "driver_locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "heading" REAL,
    "speed" REAL,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "driver_locations_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "route_deviations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "distanceM" REAL NOT NULL,
    "detectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    CONSTRAINT "route_deviations_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driverId" TEXT NOT NULL,
    "tripId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "requestStopTracking" BOOLEAN NOT NULL DEFAULT false,
    "trackingStopped" BOOLEAN NOT NULL DEFAULT false,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "reviewNotes" TEXT,
    "reportedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    CONSTRAINT "incidents_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "incidents_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "incidents_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "interno_transfers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromTripId" TEXT NOT NULL,
    "toTripId" TEXT,
    "stopId" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUGGESTED',
    "reason" TEXT,
    "decidedById" TEXT,
    "decidedAt" DATETIME,
    "suggestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "interno_transfers_fromTripId_fkey" FOREIGN KEY ("fromTripId") REFERENCES "trips" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "interno_transfers_toTripId_fkey" FOREIGN KEY ("toTripId") REFERENCES "trips" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "interno_transfers_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "stops" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "interno_transfers_decidedById_fkey" FOREIGN KEY ("decidedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "route_segments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "fromStopId" TEXT NOT NULL,
    "toStopId" TEXT NOT NULL,
    "distanceMeters" REAL NOT NULL,
    CONSTRAINT "route_segments_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "route_segments_fromStopId_fkey" FOREIGN KEY ("fromStopId") REFERENCES "stops" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "route_segments_toStopId_fkey" FOREIGN KEY ("toStopId") REFERENCES "stops" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "segment_travel_times" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "segmentId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "hourOfDay" INTEGER NOT NULL,
    "avgMinutes" REAL NOT NULL,
    "avgSpeedKmh" REAL NOT NULL,
    "sampleCount" INTEGER NOT NULL DEFAULT 0,
    "lastUpdatedAt" DATETIME NOT NULL,
    CONSTRAINT "segment_travel_times_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "route_segments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "traffic_conditions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "centerLat" REAL NOT NULL,
    "centerLng" REAL NOT NULL,
    "radiusM" REAL NOT NULL,
    "severity" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "affectedRouteId" TEXT,
    "description" TEXT,
    "detectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "preferredCriteria" TEXT NOT NULL DEFAULT 'FASTEST',
    "maxWalkMeters" INTEGER NOT NULL DEFAULT 500,
    "maxTransfers" INTEGER NOT NULL DEFAULT 2,
    "learnedPatterns" JSONB,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_predictions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "inputHash" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "prediction" JSONB NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "confidence" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "usage_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metricType" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "data" JSONB NOT NULL,
    "computedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "oauth_accounts_userId_idx" ON "oauth_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_providerAccountId_key" ON "oauth_accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "bus_lines_code_key" ON "bus_lines"("code");

-- CreateIndex
CREATE UNIQUE INDEX "bus_lines_adminId_key" ON "bus_lines"("adminId");

-- CreateIndex
CREATE INDEX "bus_lines_deletedAt_idx" ON "bus_lines"("deletedAt");

-- CreateIndex
CREATE INDEX "terminals_busLineId_idx" ON "terminals"("busLineId");

-- CreateIndex
CREATE INDEX "terminals_deletedAt_idx" ON "terminals"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "internos_plateNumber_key" ON "internos"("plateNumber");

-- CreateIndex
CREATE INDEX "internos_deletedAt_idx" ON "internos"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "internos_busLineId_number_key" ON "internos"("busLineId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_userId_key" ON "drivers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_licenseNumber_key" ON "drivers"("licenseNumber");

-- CreateIndex
CREATE INDEX "drivers_deletedAt_idx" ON "drivers"("deletedAt");

-- CreateIndex
CREATE INDEX "shifts_driverId_idx" ON "shifts"("driverId");

-- CreateIndex
CREATE INDEX "shifts_internoId_idx" ON "shifts"("internoId");

-- CreateIndex
CREATE INDEX "shifts_deletedAt_idx" ON "shifts"("deletedAt");

-- CreateIndex
CREATE INDEX "daily_assignments_date_idx" ON "daily_assignments"("date");

-- CreateIndex
CREATE INDEX "daily_assignments_routeId_idx" ON "daily_assignments"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_assignments_date_internoId_key" ON "daily_assignments"("date", "internoId");

-- CreateIndex
CREATE INDEX "routes_deletedAt_idx" ON "routes"("deletedAt");

-- CreateIndex
CREATE INDEX "stops_latitude_longitude_idx" ON "stops"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "stops_deletedAt_idx" ON "stops"("deletedAt");

-- CreateIndex
CREATE INDEX "route_stops_stopId_idx" ON "route_stops"("stopId");

-- CreateIndex
CREATE UNIQUE INDEX "route_stops_routeId_orderIndex_key" ON "route_stops"("routeId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "route_stops_routeId_stopId_key" ON "route_stops"("routeId", "stopId");

-- CreateIndex
CREATE INDEX "saved_journeys_userId_idx" ON "saved_journeys"("userId");

-- CreateIndex
CREATE INDEX "journey_plans_userId_computedAt_idx" ON "journey_plans"("userId", "computedAt");

-- CreateIndex
CREATE INDEX "journey_plans_fromLat_fromLng_toLat_toLng_idx" ON "journey_plans"("fromLat", "fromLng", "toLat", "toLng");

-- CreateIndex
CREATE INDEX "notifications_targetRole_idx" ON "notifications"("targetRole");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "notification_receipts_userId_readAt_idx" ON "notification_receipts"("userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "notification_receipts_notificationId_userId_key" ON "notification_receipts"("notificationId", "userId");

-- CreateIndex
CREATE INDEX "trips_routeId_status_idx" ON "trips"("routeId", "status");

-- CreateIndex
CREATE INDEX "trips_internoId_startedAt_idx" ON "trips"("internoId", "startedAt");

-- CreateIndex
CREATE INDEX "driver_locations_tripId_recordedAt_idx" ON "driver_locations"("tripId", "recordedAt" DESC);

-- CreateIndex
CREATE INDEX "driver_locations_latitude_longitude_idx" ON "driver_locations"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "route_deviations_tripId_idx" ON "route_deviations"("tripId");

-- CreateIndex
CREATE INDEX "incidents_driverId_idx" ON "incidents"("driverId");

-- CreateIndex
CREATE INDEX "incidents_status_idx" ON "incidents"("status");

-- CreateIndex
CREATE INDEX "incidents_reportedAt_idx" ON "incidents"("reportedAt");

-- CreateIndex
CREATE UNIQUE INDEX "interno_transfers_fromTripId_key" ON "interno_transfers"("fromTripId");

-- CreateIndex
CREATE UNIQUE INDEX "interno_transfers_toTripId_key" ON "interno_transfers"("toTripId");

-- CreateIndex
CREATE INDEX "interno_transfers_status_idx" ON "interno_transfers"("status");

-- CreateIndex
CREATE INDEX "interno_transfers_fromTripId_idx" ON "interno_transfers"("fromTripId");

-- CreateIndex
CREATE INDEX "route_segments_routeId_idx" ON "route_segments"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "route_segments_routeId_fromStopId_toStopId_key" ON "route_segments"("routeId", "fromStopId", "toStopId");

-- CreateIndex
CREATE INDEX "segment_travel_times_segmentId_idx" ON "segment_travel_times"("segmentId");

-- CreateIndex
CREATE UNIQUE INDEX "segment_travel_times_segmentId_dayOfWeek_hourOfDay_key" ON "segment_travel_times"("segmentId", "dayOfWeek", "hourOfDay");

-- CreateIndex
CREATE INDEX "traffic_conditions_centerLat_centerLng_idx" ON "traffic_conditions"("centerLat", "centerLng");

-- CreateIndex
CREATE INDEX "traffic_conditions_expiresAt_idx" ON "traffic_conditions"("expiresAt");

-- CreateIndex
CREATE INDEX "traffic_conditions_severity_idx" ON "traffic_conditions"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE INDEX "ai_predictions_type_expiresAt_idx" ON "ai_predictions"("type", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_predictions_type_inputHash_key" ON "ai_predictions"("type", "inputHash");

-- CreateIndex
CREATE INDEX "usage_metrics_metricType_periodStart_idx" ON "usage_metrics"("metricType", "periodStart");

-- CreateIndex
CREATE INDEX "usage_metrics_scope_periodStart_idx" ON "usage_metrics"("scope", "periodStart");

-- CreateIndex
CREATE INDEX "audit_logs_tableName_recordId_idx" ON "audit_logs"("tableName", "recordId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");
