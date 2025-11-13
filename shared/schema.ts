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
