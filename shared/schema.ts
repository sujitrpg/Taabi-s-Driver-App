import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============ DRIVERS ============
export const drivers = pgTable("drivers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  level: text("level").notNull().default("Rookie"), // Rookie, Pro Driver, Fleet Legend
  totalPoints: integer("total_points").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  totalTrips: integer("total_trips").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  createdAt: true,
});

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

// ============ TRIPS ============
export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => drivers.id),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  waypoints: text("waypoints").array(),
  distance: real("distance").notNull(), // in km
  duration: integer("duration").notNull(), // in minutes
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: text("status").notNull().default("active"), // active, completed, cancelled
  fuelEfficiency: real("fuel_efficiency"), // percentage
  harshBraking: integer("harsh_braking").default(0), // count
  routeAdherence: real("route_adherence"), // percentage
  idleTime: integer("idle_time").default(0), // minutes
  grade: text("grade"), // A, B, C
  pointsEarned: integer("points_earned").default(0),
  badgesEarned: text("badges_earned").array().default(sql`ARRAY[]::text[]`),
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
});

export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

// ============ SCORECARDS ============
export const scorecards = pgTable("scorecards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => drivers.id),
  tripId: varchar("trip_id").references(() => trips.id),
  period: text("period").notNull(), // daily, weekly
  date: timestamp("date").notNull(),
  fuelScore: real("fuel_score").notNull(), // 0-100
  safetyScore: real("safety_score").notNull(), // 0-100
  timeScore: real("time_score").notNull(), // 0-100
  efficiencyScore: real("efficiency_score").notNull(), // 0-100
  overallGrade: text("overall_grade").notNull(), // A, B, C
  aiTips: text("ai_tips").array().default(sql`ARRAY[]::text[]`),
});

export const insertScorecardSchema = createInsertSchema(scorecards).omit({
  id: true,
});

export type InsertScorecard = z.infer<typeof insertScorecardSchema>;
export type Scorecard = typeof scorecards.$inferSelect;

// ============ REWARDS & BADGES ============
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(), // Lucide icon name
  pointValue: integer("point_value").notNull(),
  criteria: text("criteria").notNull(),
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
});

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

export const driverBadges = pgTable("driver_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => drivers.id),
  badgeId: varchar("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  tripId: varchar("trip_id").references(() => trips.id),
});

export const insertDriverBadgeSchema = createInsertSchema(driverBadges).omit({
  id: true,
  earnedAt: true,
});

export type InsertDriverBadge = z.infer<typeof insertDriverBadgeSchema>;
export type DriverBadge = typeof driverBadges.$inferSelect;

export const vouchers = pgTable("vouchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pointCost: integer("point_cost").notNull(),
  category: text("category").notNull(), // fuel, food, recharge
  value: real("value").notNull(), // monetary value
  imageUrl: text("image_url"),
});

export const insertVoucherSchema = createInsertSchema(vouchers).omit({
  id: true,
});

export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type Voucher = typeof vouchers.$inferSelect;

export const redemptions = pgTable("redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => drivers.id),
  voucherId: varchar("voucher_id").notNull().references(() => vouchers.id),
  qrCode: text("qr_code").notNull(),
  redeemedAt: timestamp("redeemed_at").notNull().defaultNow(),
  usedAt: timestamp("used_at"),
  status: text("status").notNull().default("active"), // active, used, expired
});

export const insertRedemptionSchema = createInsertSchema(redemptions).omit({
  id: true,
  redeemedAt: true,
});

export type InsertRedemption = z.infer<typeof insertRedemptionSchema>;
export type Redemption = typeof redemptions.$inferSelect;

// ============ NEARBY PLACES ============
export const nearbyPlaces = pgTable("nearby_places", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // dhaba, fuel, mechanic, parking
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  address: text("address").notNull(),
  isVeg: boolean("is_veg"),
  isNonVeg: boolean("is_non_veg"),
  hasTruckParking: boolean("has_truck_parking").default(false),
  hygieneRating: integer("hygiene_rating"), // 1-5
  isOpen: boolean("is_open").default(true),
  discount: integer("discount"), // percentage
  imageUrl: text("image_url"),
  verifiedBy: varchar("verified_by").references(() => drivers.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNearbyPlaceSchema = createInsertSchema(nearbyPlaces).omit({
  id: true,
  createdAt: true,
});

export type InsertNearbyPlace = z.infer<typeof insertNearbyPlaceSchema>;
export type NearbyPlace = typeof nearbyPlaces.$inferSelect;

// ============ COMMUNITY ============
export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => drivers.id),
  content: text("content").notNull(),
  images: text("images").array().default(sql`ARRAY[]::text[]`),
  category: text("category").notNull(), // story, tip, photo, question
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
});

export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;

// ============ WELLNESS TIPS ============
export const wellnessTips = pgTable("wellness_tips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // health, posture, hydration, safety
  iconName: text("icon_name").notNull(),
});

export const insertWellnessTipSchema = createInsertSchema(wellnessTips).omit({
  id: true,
});

export type InsertWellnessTip = z.infer<typeof insertWellnessTipSchema>;
export type WellnessTip = typeof wellnessTips.$inferSelect;

// ============ ROUTES ============
export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => drivers.id),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  waypoints: jsonb("waypoints").default([]), // array of {location, priority, timeWindow}
  distance: real("distance").notNull(),
  estimatedDuration: integer("estimated_duration").notNull(), // minutes
  optimized: boolean("optimized").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
});

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

// ============ SUPPORT RESOURCES (Insurance & Financial) ============
export const supportResources = pgTable("support_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // insurance, loan, emergency_fund, health_insurance, accidental_insurance
  contactNumber: text("contact_number"),
  website: text("website"),
  iconName: text("icon_name").notNull(),
  isVerified: boolean("is_verified").default(true),
});

export const insertSupportResourceSchema = createInsertSchema(supportResources).omit({
  id: true,
});

export type InsertSupportResource = z.infer<typeof insertSupportResourceSchema>;
export type SupportResource = typeof supportResources.$inferSelect;

// ============ FATIGUE CHECK-INS ============
export const fatigueCheckIns = pgTable("fatigue_check_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => drivers.id),
  tripId: varchar("trip_id").references(() => trips.id),
  checkInTime: timestamp("check_in_time").notNull().defaultNow(),
  feelingSleepy: boolean("feeling_sleepy").notNull(),
  tookBreak: boolean("took_break").notNull(),
  hadMeal: boolean("had_meal").notNull(),
  response: text("response"), // driver's text response
  actionTaken: text("action_taken"), // recommended rest stop, etc
});

export const insertFatigueCheckInSchema = createInsertSchema(fatigueCheckIns).omit({
  id: true,
  checkInTime: true,
});

export type InsertFatigueCheckIn = z.infer<typeof insertFatigueCheckInSchema>;
export type FatigueCheckIn = typeof fatigueCheckIns.$inferSelect;

// ============ ROAD ALERTS ============
export const roadAlerts = pgTable("road_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  alertType: text("alert_type").notNull(), // accident, weather, blocked_road, traffic_jam, protest, bad_highway
  severity: text("severity").notNull(), // low, medium, high
  location: text("location").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  reportedBy: varchar("reported_by").references(() => drivers.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertRoadAlertSchema = createInsertSchema(roadAlerts).omit({
  id: true,
  createdAt: true,
});

export type InsertRoadAlert = z.infer<typeof insertRoadAlertSchema>;
export type RoadAlert = typeof roadAlerts.$inferSelect;

// ============ LEARNING VIDEOS ============
export const learningVideos = pgTable("learning_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // tyres, braking, night_driving, emergency, maintenance
  duration: integer("duration").notNull(), // in seconds
  pointsReward: integer("points_reward").notNull().default(10),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  iconName: text("icon_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLearningVideoSchema = createInsertSchema(learningVideos).omit({
  id: true,
  createdAt: true,
});

export type InsertLearningVideo = z.infer<typeof insertLearningVideoSchema>;
export type LearningVideo = typeof learningVideos.$inferSelect;

// Track video completion
export const videoCompletions = pgTable("video_completions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => drivers.id),
  videoId: varchar("video_id").notNull().references(() => learningVideos.id),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  pointsEarned: integer("points_earned").notNull(),
});

export const insertVideoCompletionSchema = createInsertSchema(videoCompletions).omit({
  id: true,
  completedAt: true,
});

export type InsertVideoCompletion = z.infer<typeof insertVideoCompletionSchema>;
export type VideoCompletion = typeof videoCompletions.$inferSelect;

// ============ TRUCK CHECKLISTS ============
export const checklistTemplates = pgTable("checklist_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  checklistType: text("checklist_type").notNull(), // pre_trip, post_trip
  items: text("items").array().notNull(),
});

export const insertChecklistTemplateSchema = createInsertSchema(checklistTemplates).omit({
  id: true,
});

export type InsertChecklistTemplate = z.infer<typeof insertChecklistTemplateSchema>;
export type ChecklistTemplate = typeof checklistTemplates.$inferSelect;

export const checklistCompletions = pgTable("checklist_completions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => drivers.id),
  tripId: varchar("trip_id").references(() => trips.id),
  checklistType: text("checklist_type").notNull(), // pre_trip, post_trip
  completedItems: text("completed_items").array().notNull(),
  allItemsCompleted: boolean("all_items_completed").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  notes: text("notes"),
});

export const insertChecklistCompletionSchema = createInsertSchema(checklistCompletions).omit({
  id: true,
  completedAt: true,
});

export type InsertChecklistCompletion = z.infer<typeof insertChecklistCompletionSchema>;
export type ChecklistCompletion = typeof checklistCompletions.$inferSelect;
