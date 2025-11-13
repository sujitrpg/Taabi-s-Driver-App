import { randomUUID } from "crypto";
import type {
  Driver,
  InsertDriver,
  Trip,
  InsertTrip,
  Scorecard,
  InsertScorecard,
  Badge,
  InsertBadge,
  DriverBadge,
  InsertDriverBadge,
  Voucher,
  InsertVoucher,
  Redemption,
  InsertRedemption,
  NearbyPlace,
  InsertNearbyPlace,
  CommunityPost,
  InsertCommunityPost,
  WellnessTip,
  InsertWellnessTip,
  Route,
  InsertRoute,
} from "@shared/schema";

export interface IStorage {
  // Drivers
  getDriver(id: string): Promise<Driver | undefined>;
  getDriverByPhoneNumber(phoneNumber: string): Promise<Driver | undefined>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: string, updates: Partial<Driver>): Promise<Driver | undefined>;
  getAllDrivers(): Promise<Driver[]>;

  // Trips
  createTrip(trip: InsertTrip): Promise<Trip>;
  getTrip(id: string): Promise<Trip | undefined>;
  getTripsByDriver(driverId: string): Promise<Trip[]>;
  updateTrip(id: string, updates: Partial<Trip>): Promise<Trip | undefined>;

  // Scorecards
  createScorecard(scorecard: InsertScorecard): Promise<Scorecard>;
  getScorecardsByDriver(driverId: string): Promise<Scorecard[]>;
  getLatestScorecardByDriver(driverId: string): Promise<Scorecard | undefined>;

  // Badges
  getAllBadges(): Promise<Badge[]>;
  getBadge(id: string): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  getDriverBadges(driverId: string): Promise<(DriverBadge & { badge: Badge })[]>;
  awardBadge(driverBadge: InsertDriverBadge): Promise<DriverBadge>;

  // Vouchers & Redemptions
  getAllVouchers(): Promise<Voucher[]>;
  getVoucher(id: string): Promise<Voucher | undefined>;
  createVoucher(voucher: InsertVoucher): Promise<Voucher>;
  redeemVoucher(redemption: InsertRedemption): Promise<Redemption>;
  getRedemptionsByDriver(driverId: string): Promise<(Redemption & { voucher: Voucher })[]>;

  // Nearby Places
  getAllNearbyPlaces(): Promise<NearbyPlace[]>;
  getNearbyPlacesByCategory(category: string): Promise<NearbyPlace[]>;
  createNearbyPlace(place: InsertNearbyPlace): Promise<NearbyPlace>;

  // Community Posts
  getAllCommunityPosts(): Promise<(CommunityPost & { driver: Driver })[]>;
  getCommunityPost(id: string): Promise<CommunityPost | undefined>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  updateCommunityPostLikes(id: string, increment: number): Promise<void>;

  // Wellness Tips
  getAllWellnessTips(): Promise<WellnessTip[]>;
  createWellnessTip(tip: InsertWellnessTip): Promise<WellnessTip>;

  // Routes
  createRoute(route: InsertRoute): Promise<Route>;
  getRoute(id: string): Promise<Route | undefined>;
  getRoutesByDriver(driverId: string): Promise<Route[]>;
}

export class MemStorage implements IStorage {
  private drivers: Map<string, Driver>;
  private trips: Map<string, Trip>;
  private scorecards: Map<string, Scorecard>;
  private badges: Map<string, Badge>;
  private driverBadges: Map<string, DriverBadge>;
  private vouchers: Map<string, Voucher>;
  private redemptions: Map<string, Redemption>;
  private nearbyPlaces: Map<string, NearbyPlace>;
  private communityPosts: Map<string, CommunityPost>;
  private wellnessTips: Map<string, WellnessTip>;
  private routes: Map<string, Route>;

  constructor() {
    this.drivers = new Map();
    this.trips = new Map();
    this.scorecards = new Map();
    this.badges = new Map();
    this.driverBadges = new Map();
    this.vouchers = new Map();
    this.redemptions = new Map();
    this.nearbyPlaces = new Map();
    this.communityPosts = new Map();
    this.wellnessTips = new Map();
    this.routes = new Map();
    this.seedData();
  }

  // Drivers
  async getDriver(id: string): Promise<Driver | undefined> {
    return this.drivers.get(id);
  }

  async getDriverByPhoneNumber(phoneNumber: string): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find((d) => d.phoneNumber === phoneNumber);
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = randomUUID();
    const driver: Driver = {
      ...insertDriver,
      id,
      level: insertDriver.level || "Rookie",
      totalPoints: insertDriver.totalPoints || 0,
      currentStreak: insertDriver.currentStreak || 0,
      totalTrips: insertDriver.totalTrips || 0,
      createdAt: new Date(),
    };
    this.drivers.set(id, driver);
    return driver;
  }

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver | undefined> {
    const driver = this.drivers.get(id);
    if (!driver) return undefined;
    const updated = { ...driver, ...updates };
    this.drivers.set(id, updated);
    return updated;
  }

  async getAllDrivers(): Promise<Driver[]> {
    return Array.from(this.drivers.values());
  }

  // Trips
  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = randomUUID();
    const trip: Trip = {
      ...insertTrip,
      id,
      waypoints: insertTrip.waypoints || [],
      status: insertTrip.status || "active",
      fuelEfficiency: insertTrip.fuelEfficiency || null,
      harshBraking: insertTrip.harshBraking || 0,
      routeAdherence: insertTrip.routeAdherence || null,
      idleTime: insertTrip.idleTime || 0,
      grade: insertTrip.grade || null,
      pointsEarned: insertTrip.pointsEarned || 0,
      badgesEarned: insertTrip.badgesEarned || [],
      endTime: insertTrip.endTime || null,
    };
    this.trips.set(id, trip);
    return trip;
  }

  async getTrip(id: string): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async getTripsByDriver(driverId: string): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter((t) => t.driverId === driverId);
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    const updated = { ...trip, ...updates };
    this.trips.set(id, updated);
    return updated;
  }

  // Scorecards
  async createScorecard(insertScorecard: InsertScorecard): Promise<Scorecard> {
    const id = randomUUID();
    const scorecard: Scorecard = {
      ...insertScorecard,
      id,
      aiTips: insertScorecard.aiTips || [],
      tripId: insertScorecard.tripId || null,
    };
    this.scorecards.set(id, scorecard);
    return scorecard;
  }

  async getScorecardsByDriver(driverId: string): Promise<Scorecard[]> {
    return Array.from(this.scorecards.values()).filter((s) => s.driverId === driverId);
  }

  async getLatestScorecardByDriver(driverId: string): Promise<Scorecard | undefined> {
    const scorecards = await this.getScorecardsByDriver(driverId);
    return scorecards.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  }

  // Badges
  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async getBadge(id: string): Promise<Badge | undefined> {
    return this.badges.get(id);
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = randomUUID();
    const badge: Badge = { ...insertBadge, id };
    this.badges.set(id, badge);
    return badge;
  }

  async getDriverBadges(driverId: string): Promise<(DriverBadge & { badge: Badge })[]> {
    const driverBadgesList = Array.from(this.driverBadges.values()).filter(
      (db) => db.driverId === driverId
    );
    return driverBadgesList.map((db) => ({
      ...db,
      badge: this.badges.get(db.badgeId)!,
    }));
  }

  async awardBadge(insertDriverBadge: InsertDriverBadge): Promise<DriverBadge> {
    const id = randomUUID();
    const driverBadge: DriverBadge = {
      ...insertDriverBadge,
      id,
      tripId: insertDriverBadge.tripId || null,
      earnedAt: new Date(),
    };
    this.driverBadges.set(id, driverBadge);
    return driverBadge;
  }

  // Vouchers & Redemptions
  async getAllVouchers(): Promise<Voucher[]> {
    return Array.from(this.vouchers.values());
  }

  async getVoucher(id: string): Promise<Voucher | undefined> {
    return this.vouchers.get(id);
  }

  async createVoucher(insertVoucher: InsertVoucher): Promise<Voucher> {
    const id = randomUUID();
    const voucher: Voucher = {
      ...insertVoucher,
      id,
      imageUrl: insertVoucher.imageUrl || null,
    };
    this.vouchers.set(id, voucher);
    return voucher;
  }

  async redeemVoucher(insertRedemption: InsertRedemption): Promise<Redemption> {
    const id = randomUUID();
    const redemption: Redemption = {
      ...insertRedemption,
      id,
      redeemedAt: new Date(),
      usedAt: null,
      status: "active",
    };
    this.redemptions.set(id, redemption);
    return redemption;
  }

  async getRedemptionsByDriver(driverId: string): Promise<(Redemption & { voucher: Voucher })[]> {
    const redemptionsList = Array.from(this.redemptions.values()).filter(
      (r) => r.driverId === driverId
    );
    return redemptionsList.map((r) => ({
      ...r,
      voucher: this.vouchers.get(r.voucherId)!,
    }));
  }

  // Nearby Places
  async getAllNearbyPlaces(): Promise<NearbyPlace[]> {
    return Array.from(this.nearbyPlaces.values());
  }

  async getNearbyPlacesByCategory(category: string): Promise<NearbyPlace[]> {
    return Array.from(this.nearbyPlaces.values()).filter((p) => p.category === category);
  }

  async createNearbyPlace(insertPlace: InsertNearbyPlace): Promise<NearbyPlace> {
    const id = randomUUID();
    const place: NearbyPlace = {
      ...insertPlace,
      id,
      isVeg: insertPlace.isVeg || null,
      isNonVeg: insertPlace.isNonVeg || null,
      hasTruckParking: insertPlace.hasTruckParking || false,
      hygieneRating: insertPlace.hygieneRating || null,
      isOpen: insertPlace.isOpen !== undefined ? insertPlace.isOpen : true,
      discount: insertPlace.discount || null,
      imageUrl: insertPlace.imageUrl || null,
      verifiedBy: insertPlace.verifiedBy || null,
      createdAt: new Date(),
    };
    this.nearbyPlaces.set(id, place);
    return place;
  }

  // Community Posts
  async getAllCommunityPosts(): Promise<(CommunityPost & { driver: Driver })[]> {
    const posts = Array.from(this.communityPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return posts.map((p) => ({
      ...p,
      driver: this.drivers.get(p.driverId)!,
    }));
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    return this.communityPosts.get(id);
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const post: CommunityPost = {
      ...insertPost,
      id,
      images: insertPost.images || [],
      likes: insertPost.likes || 0,
      comments: insertPost.comments || 0,
      createdAt: new Date(),
    };
    this.communityPosts.set(id, post);
    return post;
  }

  async updateCommunityPostLikes(id: string, increment: number): Promise<void> {
    const post = this.communityPosts.get(id);
    if (post) {
      post.likes += increment;
      this.communityPosts.set(id, post);
    }
  }

  // Wellness Tips
  async getAllWellnessTips(): Promise<WellnessTip[]> {
    return Array.from(this.wellnessTips.values());
  }

  async createWellnessTip(insertTip: InsertWellnessTip): Promise<WellnessTip> {
    const id = randomUUID();
    const tip: WellnessTip = { ...insertTip, id };
    this.wellnessTips.set(id, tip);
    return tip;
  }

  // Routes
  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = randomUUID();
    const route: Route = {
      ...insertRoute,
      id,
      waypoints: insertRoute.waypoints || [],
      optimized: insertRoute.optimized || false,
      createdAt: new Date(),
    };
    this.routes.set(id, route);
    return route;
  }

  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async getRoutesByDriver(driverId: string): Promise<Route[]> {
    return Array.from(this.routes.values()).filter((r) => r.driverId === driverId);
  }

  private seedData() {
    // Seed default driver
    const defaultDriver: Driver = {
      id: "default-driver-1",
      phoneNumber: "+919876543210",
      name: "Deepak Yadav",
      avatarUrl: null,
      level: "Pro Driver",
      totalPoints: 2450,
      currentStreak: 12,
      totalTrips: 145,
      createdAt: new Date(),
    };
    this.drivers.set(defaultDriver.id, defaultDriver);

    // Seed other drivers for leaderboard
    const otherDrivers: Driver[] = [
      { id: "driver-2", phoneNumber: "+919876543211", name: "Sujit Soni", avatarUrl: null, level: "Fleet Legend", totalPoints: 3450, currentStreak: 25, totalTrips: 230, createdAt: new Date() },
      { id: "driver-3", phoneNumber: "+919876543212", name: "Shubham Agarwal", avatarUrl: null, level: "Pro Driver", totalPoints: 3200, currentStreak: 18, totalTrips: 210, createdAt: new Date() },
      { id: "driver-4", phoneNumber: "+919876543213", name: "Sumandeep Singh", avatarUrl: null, level: "Pro Driver", totalPoints: 2980, currentStreak: 15, totalTrips: 195, createdAt: new Date() },
      { id: "driver-5", phoneNumber: "+919876543214", name: "Saurabh Ginde", avatarUrl: null, level: "Pro Driver", totalPoints: 2750, currentStreak: 10, totalTrips: 175, createdAt: new Date() },
    ];
    otherDrivers.forEach((d) => this.drivers.set(d.id, d));

    // Seed badges
    const badgeData: InsertBadge[] = [
      { name: "Safety Star", description: "Zero harsh braking in a trip", iconName: "shield", pointValue: 20, criteria: "no_harsh_braking" },
      { name: "On-Time Hero", description: "Delivered on time", iconName: "clock", pointValue: 50, criteria: "on_time_delivery" },
      { name: "Eco Driver", description: "Excellent fuel efficiency", iconName: "leaf", pointValue: 20, criteria: "fuel_efficient" },
      { name: "Gold Driver", description: "7-day safe driving streak", iconName: "trophy", pointValue: 100, criteria: "7_day_streak" },
      { name: "Fleet Legend", description: "Top 10 weekly ranking", iconName: "crown", pointValue: 200, criteria: "top_10_weekly" },
      { name: "Contributor", description: "Active in community", iconName: "users", pointValue: 10, criteria: "community_contribution" },
    ];
    badgeData.forEach((b) => {
      const badge = { ...b, id: randomUUID() };
      this.badges.set(badge.id, badge);
    });

    // Seed vouchers
    const voucherData: InsertVoucher[] = [
      { name: "₹500 Fuel Voucher", description: "Valid at all HP pumps", pointCost: 500, category: "fuel", value: 500, imageUrl: null },
      { name: "₹300 Food Voucher", description: "Use at partner dhabas", pointCost: 300, category: "food", value: 300, imageUrl: null },
      { name: "₹200 Recharge", description: "Mobile recharge", pointCost: 200, category: "recharge", value: 200, imageUrl: null },
      { name: "₹1000 Fuel Voucher", description: "Valid at all HP pumps", pointCost: 1000, category: "fuel", value: 1000, imageUrl: null },
    ];
    voucherData.forEach((v) => {
      const voucher = { ...v, id: randomUUID() };
      this.vouchers.set(voucher.id, voucher);
    });

    // Seed nearby places
    const placeData: InsertNearbyPlace[] = [
      { name: "Highway Dhaba", category: "dhaba", latitude: 19.0760, longitude: 72.8777, address: "NH-48, Mumbai", isVeg: true, isNonVeg: true, hasTruckParking: true, hygieneRating: 5, isOpen: true, discount: 10, imageUrl: null, verifiedBy: null },
      { name: "HP Petrol Pump", category: "fuel", latitude: 19.0850, longitude: 72.8950, address: "Western Express Highway", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: 5, imageUrl: null, verifiedBy: null },
      { name: "Quick Fix Auto Repair", category: "mechanic", latitude: 19.0650, longitude: 72.8650, address: "Industrial Area, Mumbai", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
      { name: "Truck Parking Zone A", category: "parking", latitude: 19.0900, longitude: 72.9000, address: "Logistics Hub, Mumbai", isVeg: null, isNonVeg: null, hasTruckParking: true, hygieneRating: null, isOpen: true, discount: null, imageUrl: null, verifiedBy: null },
    ];
    placeData.forEach((p) => {
      const place = { ...p, id: randomUUID() };
      this.nearbyPlaces.set(place.id, place);
    });

    // Seed wellness tips
    const tipData: InsertWellnessTip[] = [
      { title: "Take Regular Breaks", content: "Stop every 2 hours for a 15-minute break.", category: "safety", iconName: "clock" },
      { title: "Stay Hydrated", content: "Keep a water bottle handy and sip regularly.", category: "hydration", iconName: "droplets" },
      { title: "Maintain Good Posture", content: "Adjust your seat to support your lower back.", category: "posture", iconName: "activity" },
    ];
    tipData.forEach((t) => {
      const tip = { ...t, id: randomUUID() };
      this.wellnessTips.set(tip.id, tip);
    });

    // Seed community posts
    const postData = [
      { driverId: "driver-2", content: "Just completed a 500km trip with zero harsh braking! Focus and patience pays off. Stay safe everyone!", images: [], category: "story", likes: 45, comments: 12 },
      { driverId: "driver-3", content: "Pro tip: Always check tire pressure before long hauls.", images: [], category: "tip", likes: 78, comments: 23 },
    ];
    postData.forEach((p) => {
      const post = { ...p, id: randomUUID(), createdAt: new Date() };
      this.communityPosts.set(post.id, post);
    });
  }
}

export const storage = new MemStorage();
