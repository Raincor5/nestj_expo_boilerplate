# A/B Testing Implementation Checklist

## ✅ Completed Implementation

### Backend (NestJS)

#### Database
- [x] Created migration `002-setup-abtest.sql` with:
  - [x] `ab_tests` table for test definitions
  - [x] `ab_test_groups` table for variants
  - [x] `ab_test_assignments` table for user assignments
  - [x] `ab_test_metrics` table for event tracking
  - [x] Default test "home_ui_test" with "variant_a" and "variant_b"
  - [x] Indexes for performance

#### Entities
- [x] `ABTest` entity with relations
- [x] `ABTestGroup` entity with relations
- [x] `ABTestAssignment` entity with unique constraint on (userId, testId)
- [x] `ABTestMetric` entity with indexes

#### Service
- [x] `ABTestService` with methods:
  - [x] `assignUserToTest()` - Random 50/50 distribution
  - [x] `getUserTestAssignment()` - Retrieve assignment
  - [x] `recordMetric()` - Store events
  - [x] `getUserMetrics()` - Fetch user events
  - [x] `getTestMetrics()` - Aggregate by variant

#### Module & Controller
- [x] `ABTestModule` with TypeORM setup
- [x] `ABTestController` with endpoints:
  - [x] `POST /abtest/assign/:testName`
  - [x] `GET /abtest/group/:testName`
  - [x] `POST /abtest/metrics/:testName`
  - [x] `GET /abtest/metrics/:testName`
  - [x] `GET /abtest/results/:testName`
- [x] JWT guard on all endpoints
- [x] App module imports ABTestModule

#### Auth Integration
- [x] Updated `AuthResponseDto` to include `testGroup`
- [x] Updated `AuthService` to auto-assign users on register/login
- [x] Auth module imports ABTestModule

### Frontend (Expo/React Native)

#### Configuration
- [x] Added `TEST_GROUP` to storage keys in `constants.ts`

#### Storage
- [x] Added `setTestGroup()` method
- [x] Added `getTestGroup()` method
- [x] Updated `clearTokens()` to clear test group

#### Context
- [x] Added `TestGroup` interface
- [x] Added `testGroup` state to AuthContext
- [x] Store/retrieve test group from storage on auth
- [x] Export `testGroup` from `useAuth()` hook

#### Variant Screens
- [x] `HomeScreen_VariantA.tsx` - Control variant
  - Clean light theme with basic info display
  - "View Details" button
  - Logout button
- [x] `HomeScreen_VariantB.tsx` - Treatment variant
  - Dark theme with card-based design
  - Avatar placeholder
  - "Copy ID" and "Share" action buttons
  - Modern styling

#### Services & Hooks
- [x] `abtestService.ts` with methods:
  - [x] `getTestGroup()`
  - [x] `recordMetric()`
  - [x] `recordMetrics()` (batch)
  - [x] `getUserMetrics()`
- [x] `useABTestMetrics` hook with:
  - [x] Event queueing with debouncing
  - [x] `trackEvent()` - Debounced batch
  - [x] `trackEventImmediate()` - Direct send
  - [x] `flushMetrics()` - Force send pending

#### Home Screen
- [x] Renders variant based on `testGroup.groupName`
- [x] Tracks "screen_viewed" on mount
- [x] Passes `onTrackEvent` callback to variants
- [x] Flushes metrics before logout
- [x] Displays loading state if test group not ready

### Documentation
- [x] Created comprehensive `ABTEST_IMPLEMENTATION.md` with:
  - Architecture overview
  - Backend and frontend components
  - Usage examples
  - Metrics reference
  - Design decisions
  - Future enhancements
  - Troubleshooting guide

## 🚀 Next Steps to Get Started

1. **Run database migration:**
   ```bash
   cd backend
   npm run migration:run
   ```

2. **Build backend:**
   ```bash
   npm run build
   ```

3. **Install frontend dependencies** (if needed):
   ```bash
   cd frontend
   npm install
   ```

4. **Start backend:**
   ```bash
   npm run start:dev
   ```

5. **Start frontend:**
   ```bash
   expo start --tunnel
   ```

6. **Test flow:**
   - Register new user
   - Verify testGroup in auth response
   - See variant A or B rendered
   - Check backend metrics with: `GET /abtest/metrics/home_ui_test`
   - Check aggregated results: `GET /abtest/results/home_ui_test`

## 📊 Testing Metrics

After some user interactions, query results:

```bash
# Get aggregated metrics
curl -H "Authorization: Bearer <your_token>" \
  http://localhost:3000/abtest/results/home_ui_test | jq
```

Expected response structure:
```json
{
  "testName": "home_ui_test",
  "testId": "...",
  "aggregated": {
    "variant_a": {
      "screen_viewed": [...],
      "view_details_clicked": [...]
    },
    "variant_b": {
      "screen_viewed": [...],
      "copy_userid_clicked": [...],
      "share_profile_clicked": [...]
    }
  }
}
```

## 🎯 Event Tracking

### Variant A Events
- `screen_viewed` - On screen mount
- `view_details_clicked` - When "View Details" button pressed

### Variant B Events
- `screen_viewed` - On screen mount
- `copy_userid_clicked` - When "Copy ID" button pressed
- `share_profile_clicked` - When "Share" button pressed

## 💡 Key Features

- ✅ Automatic 50/50 user distribution
- ✅ Persistent assignments (users see same variant)
- ✅ Real-time metrics collection
- ✅ Debounced batch sending (reduces network load)
- ✅ Immediate mode for critical metrics
- ✅ Aggregated results by variant
- ✅ Clean separation of variant code
- ✅ Type-safe throughout (TypeScript)
- ✅ Zero external dependencies for A/B framework

## 🔧 Customization Examples

### Change distribution to 70/30
Update `abtest.service.ts` `assignUserToTest()`:
```typescript
const randomGroupIndex = Math.random() < 0.7 ? 0 : 1;
```

### Add more event tracking
In variant components:
```typescript
const handleButtonClick = () => {
  onTrackEvent('custom_event_name', 'optional_value');
};
```

### Create new test
Add to migration or directly in database:
```sql
INSERT INTO ab_tests VALUES (gen_random_uuid(), 'new_test', 'desc', true, now(), now());
-- Then add groups...
```

---

**Implementation Date**: January 21, 2026  
**Status**: ✅ Complete and Ready for Testing
