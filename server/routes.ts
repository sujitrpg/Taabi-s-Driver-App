import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDriverSchema, 
  insertTripSchema, 
  insertCommunityPostSchema, 
  insertNearbyPlaceSchema, 
  insertRouteSchema,
  insertFatigueCheckInSchema,
  insertRoadAlertSchema,
  insertVideoCompletionSchema,
  insertChecklistCompletionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============ AUTHENTICATION ============
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      // Find existing driver or return signup needed
      let driver = await storage.getDriverByPhoneNumber(phoneNumber);
      
      // For demo purposes, we'll auto-create if not exists
      if (!driver) {
        driver = await storage.createDriver({
          phoneNumber,
          name: "New Driver",
          level: "Rookie",
          totalPoints: 0,
          currentStreak: 0,
          totalTrips: 0,
          avatarUrl: null,
        });
      }

      // In real implementation, send OTP here
      res.json({ success: true, driverId: driver.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
      
      // In real implementation, verify OTP here
      const driver = await storage.getDriverByPhoneNumber(phoneNumber);
      
      if (!driver) {
        return res.status(404).json({ error: "Driver not found" });
      }

      res.json({ success: true, driver });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ DRIVERS ============
  app.get("/api/driver/:id", async (req, res) => {
    try {
      const driver = await storage.getDriver(req.params.id);
      if (!driver) {
        return res.status(404).json({ error: "Driver not found" });
      }
      res.json(driver);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/driver/:id/rank", async (req, res) => {
    try {
      const allDrivers = await storage.getAllDrivers();
      const sorted = allDrivers.sort((a, b) => b.totalPoints - a.totalPoints);
      const rank = sorted.findIndex((d) => d.id === req.params.id) + 1;
      
      res.json({ rank, totalDrivers: allDrivers.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ TRIPS ============
  app.post("/api/trips", async (req, res) => {
    try {
      const validatedData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(validatedData);
      res.json(trip);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    try {
      const trip = await storage.getTrip(req.params.id);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      res.json(trip);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/trips/:id/complete", async (req, res) => {
    try {
      const { fuelEfficiency, harshBraking, routeAdherence, idleTime } = req.body;
      
      // Calculate grade based on metrics
      const avgScore = (fuelEfficiency + (100 - harshBraking) + routeAdherence) / 3;
      let grade: "A" | "B" | "C" = "C";
      if (avgScore >= 85) grade = "A";
      else if (avgScore >= 70) grade = "B";

      // Calculate points earned
      let pointsEarned = 0;
      const badgesEarned: string[] = [];

      // On-time delivery bonus (assuming on-time if route adherence > 90%)
      if (routeAdherence >= 90) {
        pointsEarned += 50;
        badgesEarned.push("On-Time Hero");
      }

      // Good driving score
      if (avgScore >= 85) {
        pointsEarned += 20;
      }

      // Zero harsh braking
      if (harshBraking === 0) {
        pointsEarned += 20;
        badgesEarned.push("Safety Star");
      }

      // Fuel efficiency bonus
      if (fuelEfficiency >= 90) {
        pointsEarned += 15;
        badgesEarned.push("Eco Driver");
      }

      const trip = await storage.updateTrip(req.params.id, {
        endTime: new Date(),
        status: "completed",
        fuelEfficiency,
        harshBraking,
        routeAdherence,
        idleTime,
        grade,
        pointsEarned,
        badgesEarned,
      });

      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }

      // Update driver points and stats
      const driver = await storage.getDriver(trip.driverId);
      if (driver) {
        await storage.updateDriver(driver.id, {
          totalPoints: driver.totalPoints + pointsEarned,
          totalTrips: driver.totalTrips + 1,
          currentStreak: driver.currentStreak + 1,
        });

        // Award badges
        const allBadges = await storage.getAllBadges();
        for (const badgeName of badgesEarned) {
          const badge = allBadges.find((b) => b.name === badgeName);
          if (badge) {
            await storage.awardBadge({
              driverId: driver.id,
              badgeId: badge.id,
              tripId: trip.id,
            });
          }
        }

        // Create scorecard
        await storage.createScorecard({
          driverId: driver.id,
          tripId: trip.id,
          period: "daily",
          date: new Date(),
          fuelScore: fuelEfficiency,
          safetyScore: 100 - harshBraking,
          timeScore: routeAdherence,
          efficiencyScore: avgScore,
          overallGrade: grade,
          aiTips: grade === "A" 
            ? ["Excellent performance! Keep it up!"]
            : ["Consider reducing harsh braking", "Maintain steady speed for better fuel efficiency"],
        });
      }

      res.json(trip);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/trips/driver/:driverId", async (req, res) => {
    try {
      const trips = await storage.getTripsByDriver(req.params.driverId);
      res.json(trips);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ SCORECARDS ============
  app.get("/api/scorecards/:driverId", async (req, res) => {
    try {
      const scorecards = await storage.getScorecardsByDriver(req.params.driverId);
      res.json(scorecards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/scorecards/:driverId/latest", async (req, res) => {
    try {
      const scorecard = await storage.getLatestScorecardByDriver(req.params.driverId);
      if (!scorecard) {
        return res.status(404).json({ error: "No scorecard found" });
      }
      res.json(scorecard);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ LEADERBOARD ============
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const period = req.query.period as string || "weekly";
      const allDrivers = await storage.getAllDrivers();
      
      // Sort by total points (in real app, would filter by period)
      const sorted = allDrivers
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 50);
      
      res.json(sorted);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ BADGES ============
  app.get("/api/badges", async (req, res) => {
    try {
      const badges = await storage.getAllBadges();
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/driver-badges/:driverId", async (req, res) => {
    try {
      const driverBadges = await storage.getDriverBadges(req.params.driverId);
      res.json(driverBadges);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ REWARDS ============
  app.get("/api/vouchers", async (req, res) => {
    try {
      const vouchers = await storage.getAllVouchers();
      res.json(vouchers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/rewards/redeem", async (req, res) => {
    try {
      const { driverId, voucherId } = req.body;
      
      const driver = await storage.getDriver(driverId);
      const voucher = await storage.getVoucher(voucherId);
      
      if (!driver) {
        return res.status(404).json({ error: "Driver not found" });
      }
      
      if (!voucher) {
        return res.status(404).json({ error: "Voucher not found" });
      }

      if (driver.totalPoints < voucher.pointCost) {
        return res.status(400).json({ error: "Insufficient points" });
      }

      // Generate QR code (simple string for demo)
      const qrCode = `TAABI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      const redemption = await storage.redeemVoucher({
        driverId,
        voucherId,
        qrCode,
      });

      // Deduct points
      await storage.updateDriver(driverId, {
        totalPoints: driver.totalPoints - voucher.pointCost,
      });

      res.json(redemption);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/redemptions/:driverId", async (req, res) => {
    try {
      const redemptions = await storage.getRedemptionsByDriver(req.params.driverId);
      res.json(redemptions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ NEARBY PLACES ============
  app.get("/api/nearby-places", async (req, res) => {
    try {
      const category = req.query.category as string;
      
      let places;
      if (category) {
        places = await storage.getNearbyPlacesByCategory(category);
      } else {
        places = await storage.getAllNearbyPlaces();
      }
      
      res.json(places);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/nearby-places", async (req, res) => {
    try {
      const validatedData = insertNearbyPlaceSchema.parse(req.body);
      const place = await storage.createNearbyPlace(validatedData);
      
      // Award contributor badge points
      const driver = await storage.getDriver(validatedData.verifiedBy!);
      if (driver) {
        await storage.updateDriver(driver.id, {
          totalPoints: driver.totalPoints + 10,
        });
      }
      
      res.json(place);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============ COMMUNITY ============
  app.get("/api/community/posts", async (req, res) => {
    try {
      const posts = await storage.getAllCommunityPosts();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/community/posts", async (req, res) => {
    try {
      const validatedData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(validatedData);
      
      // Award points for community contribution
      const driver = await storage.getDriver(validatedData.driverId);
      if (driver) {
        await storage.updateDriver(driver.id, {
          totalPoints: driver.totalPoints + 10,
        });
      }
      
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/community/posts/:id/like", async (req, res) => {
    try {
      await storage.updateCommunityPostLikes(req.params.id, 1);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ WELLNESS ============
  app.get("/api/wellness-tips", async (req, res) => {
    try {
      const tips = await storage.getAllWellnessTips();
      res.json(tips);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ ROUTES ============
  app.post("/api/routes", async (req, res) => {
    try {
      const validatedData = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(validatedData);
      res.json(route);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/routes/:id", async (req, res) => {
    try {
      const route = await storage.getRoute(req.params.id);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      res.json(route);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/routes/driver/:driverId", async (req, res) => {
    try {
      const routes = await storage.getRoutesByDriver(req.params.driverId);
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ SUPPORT RESOURCES ============
  app.get("/api/support-resources", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const resources = category 
        ? await storage.getSupportResourcesByCategory(category)
        : await storage.getAllSupportResources();
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ FATIGUE CHECK-INS ============
  app.post("/api/fatigue-checkins", async (req, res) => {
    try {
      const validatedData = insertFatigueCheckInSchema.parse(req.body);
      const checkIn = await storage.createFatigueCheckIn(validatedData);
      
      // If driver is sleepy, we could recommend nearby parking/dhaba
      if (checkIn.feelingSleepy) {
        const nearbyParking = await storage.getNearbyPlacesByCategory("parking");
        const nearbyDhabas = await storage.getNearbyPlacesByCategory("dhaba");
        const recommendations = [...nearbyParking.slice(0, 2), ...nearbyDhabas.slice(0, 2)];
        
        res.json({ 
          checkIn, 
          recommendations,
          warning: "Please take a break soon. Safety first!" 
        });
      } else {
        res.json({ checkIn });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/fatigue-checkins/driver/:driverId", async (req, res) => {
    try {
      const checkIns = await storage.getFatigueCheckInsByDriver(req.params.driverId);
      res.json(checkIns);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/fatigue-checkins/driver/:driverId/latest", async (req, res) => {
    try {
      const checkIn = await storage.getLatestFatigueCheckIn(req.params.driverId);
      res.json(checkIn || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ ROAD ALERTS ============
  app.get("/api/road-alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveRoadAlerts();
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/road-alerts", async (req, res) => {
    try {
      const validatedData = insertRoadAlertSchema.parse(req.body);
      const alert = await storage.createRoadAlert(validatedData);
      res.json(alert);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============ LEARNING VIDEOS ============
  app.get("/api/learning-videos", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const videos = category 
        ? await storage.getLearningVideosByCategory(category)
        : await storage.getAllLearningVideos();
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/learning-videos/:id/complete", async (req, res) => {
    try {
      const { driverId } = req.body;
      const video = await storage.getLearningVideo(req.params.id);
      
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      // Record completion
      const completion = await storage.completeVideo({
        driverId,
        videoId: req.params.id,
        pointsEarned: video.pointsReward,
      });

      // Award points to driver
      const driver = await storage.getDriver(driverId);
      if (driver) {
        await storage.updateDriver(driver.id, {
          totalPoints: driver.totalPoints + video.pointsReward,
        });
      }

      res.json({ completion, pointsEarned: video.pointsReward });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/learning-videos/driver/:driverId/completed", async (req, res) => {
    try {
      const completions = await storage.getCompletedVideos(req.params.driverId);
      res.json(completions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ CHECKLISTS ============
  app.get("/api/checklist-templates", async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      if (type) {
        const template = await storage.getChecklistTemplateByType(type);
        res.json(template || null);
      } else {
        const templates = await storage.getAllChecklistTemplates();
        res.json(templates);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/checklist-completions", async (req, res) => {
    try {
      const validatedData = insertChecklistCompletionSchema.parse(req.body);
      const completion = await storage.completeChecklist(validatedData);
      
      // Award bonus points for 100% completion
      if (completion.allItemsCompleted) {
        const driver = await storage.getDriver(completion.driverId);
        if (driver) {
          await storage.updateDriver(driver.id, {
            totalPoints: driver.totalPoints + 20, // Bonus for complete checklist
          });
        }
      }
      
      res.json(completion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/checklist-completions/driver/:driverId", async (req, res) => {
    try {
      const completions = await storage.getChecklistCompletionsByDriver(req.params.driverId);
      res.json(completions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/checklist-completions/trip/:tripId", async (req, res) => {
    try {
      const completions = await storage.getChecklistCompletionsByTrip(req.params.tripId);
      res.json(completions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
