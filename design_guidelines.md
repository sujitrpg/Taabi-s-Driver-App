# Taabi Drive+ Design Guidelines

## Design Approach
**Reference-Based Mobile App Design** drawing from best-in-class mobile experiences:
- **Gamification**: Duolingo's reward system + Strava's performance tracking
- **Navigation**: Uber/Google Maps interaction patterns
- **Community**: Instagram's feed + Discord's chat patterns
- **Dashboard**: Linear's clean data visualization + Notion's card system

This approach balances professional utility with engaging gamification for truck drivers who need both efficiency and motivation.

---

## Core Design Principles

### 1. Driver-First Mobile Experience
- Large touch targets (minimum 48px) for road-accessible interaction
- High contrast for sunlight readability
- Bottom-navigation for thumb-friendly access
- Swipe gestures for quick actions (reject trip, mark complete)

### 2. Visual Hierarchy
**Color System** (User-Specified):
- Primary: Taabi Blue (#0072CE) - CTAs, active states, branding
- Success/Rewards: Lime Green - points, achievements, positive metrics
- Neutrals: White backgrounds, Light Grey for cards/dividers
- Status Colors: Red (warnings), Orange (caution), Green (optimal)

**Typography Hierarchy**:
- Display: Bold, 28-32px for dashboard headers and scores
- Heading: Semibold, 20-24px for section titles
- Body: Regular, 16px for content, metrics
- Caption: Medium, 14px for labels, metadata
- Use system fonts: SF Pro (iOS) / Roboto (Android) for native feel

### 3. Spacing & Layout System
**Tailwind Units**: Consistent use of 2, 4, 6, 8, 12, 16, 20 units
- Card padding: `p-4` (16px)
- Section spacing: `mb-6` or `mb-8` between major sections
- Screen margins: `px-4` (16px horizontal padding)
- Vertical rhythm: `space-y-4` for related elements, `space-y-8` for sections

**Layout Patterns**:
- Dashboard grid: 2-column for metrics cards
- Full-width cards for scorecards and trip summaries
- Horizontal scrolling for badges/achievements
- Stacked single-column for forms and detailed views

---

## Component Library

### Navigation
**Bottom Tab Bar** (Primary Navigation):
- 4-5 tabs: Home | Route | Nearby | Community | Profile
- Icons with labels, active state with Taabi Blue fill
- Fixed position with subtle elevation shadow
- 64px height with safe area padding

**Top Header**:
- Transparent over maps, solid white on content screens
- Left: Back/Menu | Center: Screen title | Right: Points badge/notifications
- Sticky header for scrollable content

### Cards & Containers
**Standard Card**:
- White background, rounded-2xl (16px radius)
- Soft shadow: `shadow-md` for elevation
- Padding: `p-4` internally
- Border: Subtle 1px grey on relevant cards

**Scorecard Card** (Featured):
- Larger rounded-3xl (24px radius)
- Gradient background overlay (subtle blue tint)
- Bold letter grade (A/B/C) in 72px display font
- Color-coded border: Green (A), Orange (B), Red (C)
- Mini metrics grid below grade (4 columns: fuel, safety, time, efficiency)

**Achievement Badge**:
- Circular 80px containers
- Icon + label stacked vertically
- Locked state: Grey with lock icon overlay
- Unlocked: Full color with subtle glow animation
- Horizontal scrollable row with snap-to-point

### Progress Indicators
**Animated Progress Rings**:
- 120px diameter circular progress
- Stroke width: 8px
- Percentage in center (48px bold)
- Color-coded by performance (Green 80%+, Orange 60-79%, Red <60%)
- Smooth animation on load (1.5s ease-out)

**Linear Progress Bars**:
- Height: 8px, rounded-full
- Background: Light grey
- Fill: Lime green for rewards, Taabi blue for achievements
- Points counter overlay for redemption progress

### Buttons & CTAs
**Primary Button**:
- Full Taabi Blue background, white text
- Height: 48px minimum
- Rounded-xl (12px radius)
- Semibold 16px text
- Tap: Scale 0.98 + slight opacity reduction

**Secondary Button**:
- Taabi Blue border (2px), Taabi Blue text
- Same sizing as primary
- Tap: Light blue background fill

**Floating Action Button** (FAB):
- 56px circular, Taabi Blue
- Bottom-right positioned with 16px margin
- Elevation shadow-lg
- Use for: Start Route, SOS, Add Dhaba

### Map Components
**Map View**:
- Full-screen with controls overlaid
- Cluster markers for nearby drivers/stops
- Route polyline: Taabi Blue, 4px width
- Current location: Pulsing blue dot
- Destination pins: Custom truck icon

**Info Cards Over Map**:
- Bottom sheet design (rounded top corners only)
- Draggable to expand/collapse
- Blur background for buttons: `backdrop-blur-md bg-white/80`
- Quick actions: Call, Navigate, Save

### Data Visualization
**Leaderboard**:
- Card-based list items
- Rank badge (circular, gold/silver/bronze for top 3)
- Driver photo (40px circular avatar)
- Name + score in row layout
- Current driver highlighted with Taabi Blue background

**Performance Graphs**:
- 7-day line chart (fuel efficiency, safety score)
- Points as filled circles on line
- X-axis: Day labels (Mon-Sun)
- Y-axis: Metric value with unit
- Touch: Show tooltip with exact value
- Chart height: 200px

### Input Fields
**Form Inputs**:
- Height: 48px
- Border: 1px light grey, rounded-lg
- Focus: Taabi Blue border (2px)
- Label: Above input, 14px medium weight
- Helper text: Below, 12px grey

**Search Bar**:
- Prominent at top of Nearby/Community screens
- Magnifying glass icon prefix
- Rounded-full (fully rounded)
- Light grey background with no border
- Height: 40px

### Gamification Elements
**Points Wallet Widget**:
- Prominent card on home screen
- Large points total (32px bold) with coin icon
- "Redeem" CTA button inline
- Last earned: Small text showing recent points activity

**Confetti Animation**:
- Trigger: Badge unlock, milestone completion
- Duration: 2s
- Particle colors: Taabi Blue, Lime Green, White
- Full-screen overlay, non-blocking

**Weekly Challenge Cards**:
- Horizontal scrollable row
- Card size: 160px × 200px
- Icon + challenge name + progress bar + reward
- Active challenge: Lime green accent border

### Notifications & Alerts
**Toast Notifications**:
- Bottom positioned (above tab bar)
- 60px height, rounded-lg
- Auto-dismiss after 4s
- Icon + message + dismiss X
- Types: Success (green), Warning (orange), Info (blue)

**Alert Modals**:
- Centered overlay with backdrop blur
- Max-width: 90% screen, rounded-2xl
- Padding: `p-6`
- Title (20px semibold) + message + action buttons
- SOS alert: Red theme with emergency styling

### Community Features
**Forum Post Card**:
- Driver avatar (48px) + name + timestamp
- Post text with "Read more" expansion
- Photo grid (if images attached, 2-column)
- Like/Comment counters with icons
- Divider between posts

**Driver Profile Mini**:
- Circular avatar 64px
- Name + current level badge
- Stats row: Trips | Points | Rank
- Call/Chat buttons inline

---

## Screen Layouts

### Home Dashboard
1. Top: Points wallet widget (full-width)
2. Scorecard summary card (latest trip grade)
3. Quick action grid (2×2): Start Route | Nearby | Rewards | Community
4. Performance rings (2-column: Fuel | Safety)
5. Recent badges (horizontal scroll)
6. Leaderboard preview (top 3)

### Route Planning
1. Map view (70% screen height)
2. Bottom sheet with:
   - Origin/Destination inputs (stacked)
   - Add waypoint button
   - Optimize route toggle
   - ETA + distance display
   - Start navigation button (primary, full-width)

### Nearby Essentials
1. Map with filter chips at top (Dhabas, Fuel, Parking, Mechanics)
2. List view toggle in top-right
3. Bottom sheet: Selected place info card
4. Filter modal: Veg/Non-veg, Open now, Hygiene rating (radio buttons)

### Trip Summary (Post-Trip)
1. Hero: Large grade display with celebration animation
2. Points earned card with breakdown
3. Metrics grid (4 metrics in 2×2)
4. Performance graph (7-day trend)
5. New badges earned (if any, with animation)
6. Share achievement button

---

## Animation Guidelines
**Purposeful Motion Only**:
- Page transitions: 300ms slide (left/right for navigation)
- Card reveals: Stagger by 100ms when loading lists
- Progress rings: Animate fill on mount (1.5s)
- Badge unlock: Scale + bounce (500ms)
- Confetti: On major achievements only
- Pull-to-refresh: Subtle elastic bounce

**Performance**:
- Use `transform` and `opacity` for 60fps
- Avoid animating layout properties
- Reduce motion for accessibility (respect system settings)

---

## Images

**Dashboard Hero Card**: Background image of truck on highway at golden hour, subtle overlay to ensure text readability (blurred button backgrounds where CTAs overlay).

**Community Posts**: User-submitted photos of verified dhabas, parking spots, and trip moments displayed in 2-column grid within post cards.

**Achievement Badges**: Icon-based graphics (no photos) using Lucide icons with Taabi brand colors.

**Empty States**: Friendly illustrations for empty leaderboard, no nearby drivers, or first-time screens.

---

## Accessibility
- Minimum touch targets: 48×48px
- Color contrast: WCAG AA minimum (4.5:1 for text)
- Voice-over labels for all interactive elements
- Haptic feedback for important actions (SOS, trip complete)
- Support dynamic type scaling
- Alternative text for all images

This design system ensures Taabi Drive+ is professional, engaging, and optimized for truck drivers' unique mobile usage patterns while maintaining strong gamification and community features.