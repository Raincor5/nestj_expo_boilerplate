# A/B Testing Implementation - Files Summary

## 📁 New Files Created

### Backend - Database
```
backend/src/database/migrations/002-setup-abtest.sql
```
Creates 4 new tables: ab_tests, ab_test_groups, ab_test_assignments, ab_test_metrics

### Backend - Entities
```
backend/src/abtest/entities/ab-test.entity.ts
backend/src/abtest/entities/ab-test-group.entity.ts
backend/src/abtest/entities/ab-test-assignment.entity.ts
backend/src/abtest/entities/ab-test-metric.entity.ts
```

### Backend - Module & Service
```
backend/src/abtest/abtest.module.ts
backend/src/abtest/abtest.service.ts
backend/src/abtest/abtest.controller.ts
backend/src/abtest/dto/create-metric.dto.ts
```

### Frontend - Services & Hooks
```
frontend/src/services/abtestService.ts
frontend/src/hooks/useABTestMetrics.ts
```

### Frontend - Variant Screens
```
frontend/src/screens/HomeScreen_VariantA.tsx
frontend/src/screens/HomeScreen_VariantB.tsx
```

### Documentation
```
ABTEST_IMPLEMENTATION.md
ABTEST_CHECKLIST.md
FILES_SUMMARY.md (this file)
```

---

## ✏️ Files Modified

### Backend

#### `backend/src/app.module.ts`
- Added import for ABTestModule
- Added ABTestModule to imports array

#### `backend/src/auth/auth.module.ts`
- Added import for ABTestModule
- Added ABTestModule to imports array

#### `backend/src/auth/auth.service.ts`
- Added ABTestService injection
- Updated `register()` to auto-assign user to test and include testGroup in response
- Updated `login()` to auto-assign user to test and include testGroup in response

#### `backend/src/auth/dto/auth-response.dto.ts`
- Added optional `testGroup` property with nested fields:
  - testId, testName, groupId, groupName, assignedAt

### Frontend

#### `frontend/src/config/constants.ts`
- Added `TEST_GROUP` key to `STORAGE_KEYS`

#### `frontend/src/utils/storage.ts`
- Added `TestGroup` interface
- Added `setTestGroup()` method
- Added `getTestGroup()` method
- Updated `clearTokens()` to also clear test group

#### `frontend/src/context/AuthContext.tsx`
- Added `TestGroup` interface
- Added `testGroup` state
- Added test group storage/retrieval logic
- Export `testGroup` from useAuth hook
- Auto-fetch and store test group on login/register

#### `frontend/src/screens/HomeScreen.tsx`
- Complete refactor to support A/B testing
- Added useABTestMetrics hook
- Conditional rendering based on testGroup.groupName
- Screen view event tracking
- Imports VariantA and VariantB components
- Pass tracking callback to variant components

---

## 📊 Database Schema

### New Tables

#### ab_tests
```sql
id (UUID, PK)
name (VARCHAR, UNIQUE)
description (TEXT)
active (BOOLEAN)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### ab_test_groups
```sql
id (UUID, PK)
test_id (UUID, FK → ab_tests)
group_name (VARCHAR)
description (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
UNIQUE(test_id, group_name)
```

#### ab_test_assignments
```sql
id (UUID, PK)
user_id (UUID, FK → users)
test_id (UUID, FK → ab_tests)
group_id (UUID, FK → ab_test_groups)
assigned_at (TIMESTAMP)
updated_at (TIMESTAMP)
UNIQUE(user_id, test_id)
```

#### ab_test_metrics
```sql
id (UUID, PK)
user_id (UUID, FK → users)
test_id (UUID, FK → ab_tests)
group_id (UUID, FK → ab_test_groups)
metric_name (VARCHAR)
metric_value (VARCHAR)
recorded_at (TIMESTAMP)
```

### Indexes
- idx_ab_test_groups_test_id
- idx_ab_test_assignments_user_id
- idx_ab_test_assignments_test_id
- idx_ab_test_assignments_group_id
- idx_ab_test_metrics_user_id
- idx_ab_test_metrics_test_id
- idx_ab_test_metrics_group_id

### Default Data
Inserted on migration:
- Test: `home_ui_test`
- Group 1: `variant_a` (control)
- Group 2: `variant_b` (treatment)

---

## 🔗 API Endpoints

All endpoints require JWT authentication (`@UseGuards(JwtAuthGuard)`)

### Public (from Auth)
- `POST /auth/register` - Returns testGroup in response
- `POST /auth/login` - Returns testGroup in response

### A/B Test Endpoints
- `POST /abtest/assign/:testName` - Assign user to test
- `GET /abtest/group/:testName` - Get user's group assignment
- `POST /abtest/metrics/:testName` - Record event
- `GET /abtest/metrics/:testName` - Get user's metrics
- `GET /abtest/results/:testName` - Get aggregated results

---

## 🎯 Component Architecture

```
Frontend Flow:
1. User registers/logs in
2. Auth service receives testGroup in response
3. AuthContext stores testGroup in state and storage
4. HomeScreen accesses testGroup from useAuth()
5. HomeScreen conditionally renders VariantA or VariantB
6. Variants call onTrackEvent callback for interactions
7. useABTestMetrics hook batches and sends metrics
8. Metrics are persisted in backend database

Backend Flow:
1. User registers/logs in
2. AuthService auto-assigns to test via ABTestService
3. testGroup included in auth response
4. User can track events via /abtest/metrics endpoint
5. Metrics are aggregated on /abtest/results endpoint
```

---

## 🔄 Data Flow

### Login/Register
```
Frontend: User credentials
    ↓
Backend: AuthService.login/register()
    ↓
Backend: ABTestService.assignUserToTest()
    ↓
Database: Create ABTestAssignment (random 50/50 to variant)
    ↓
Backend: Return testGroup in AuthResponseDto
    ↓
Frontend: Store in AuthContext and SecureStore
    ↓
Frontend: Use for conditional rendering
```

### Event Tracking
```
Frontend: User interaction (e.g., button click)
    ↓
Frontend: trackEvent('event_name') queued
    ↓
Frontend: Batched and sent after 5s debounce
    ↓
Backend: ABTestService.recordMetric()
    ↓
Database: ABTestMetric created
    ↓
Frontend: Can query /abtest/metrics or /abtest/results
```

---

## 📦 Dependencies

### Backend (No new dependencies)
- Existing: @nestjs/common, @nestjs/typeorm, typeorm, pg, bcrypt, class-validator, etc.

### Frontend (No new dependencies)
- Existing: react-native, expo, axios, expo-secure-store, etc.

---

## 🧪 Testing Recommendations

1. **Database Setup**
   ```bash
   npm run migration:run
   ```

2. **Test Registration**
   - Register two users
   - Verify each gets assigned to different variants
   - Check database: `SELECT * FROM ab_test_assignments;`

3. **Test Event Tracking**
   - Login, interact with UI
   - Check metrics: `GET /abtest/metrics/home_ui_test`
   - Verify events recorded

4. **Test Aggregation**
   - Get results: `GET /abtest/results/home_ui_test`
   - See metrics grouped by variant

5. **Test Persistence**
   - Logout and login again
   - Verify user stays in same variant

---

## 🚀 Deployment Considerations

1. **Run migration before deploying** new backend version
2. **Backward compatible**: Existing data untouched
3. **No breaking changes**: testGroup is optional in AuthResponseDto
4. **Database indexes**: Included for performance
5. **Stateless service**: No session affinity needed

---

## 📝 Configuration

### Frontend
- Test name: "home_ui_test" (hardcoded, can be moved to constants)
- Debounce interval: 5000ms (configurable in useABTestMetrics)
- Storage key: "test_group" (from constants)

### Backend
- Random distribution: 50/50 (configurable in ABTestService.assignUserToTest)
- Test name: "home_ui_test" (can create multiple tests)

---

## 🐛 Error Handling

### Frontend
- Try-catch in abtestService for API failures
- Graceful degradation if test group not available
- Metrics failures don't crash app (logged to console)

### Backend
- 404 if test not found or inactive
- 400 if test has no groups
- 401 if user not authenticated
- Unique constraints prevent duplicate assignments

---

## 📚 Key Concepts

1. **Variant**: UI variant/group (e.g., "variant_a", "variant_b")
2. **Assignment**: User → Variant mapping, 1:1 per test
3. **Metric**: Event record with name, optional value, and timestamp
4. **Debouncing**: Wait 5s after last event before sending batch
5. **Immediate**: Send event immediately without waiting
6. **Aggregation**: Grouping metrics by variant for analysis

---

## ✨ Features Implemented

- ✅ Automatic user assignment to random variant
- ✅ Persistent assignments (users stay in same variant)
- ✅ Real-time event tracking
- ✅ Batch sending with debouncing
- ✅ Immediate mode for critical events
- ✅ Aggregated metrics by variant
- ✅ Clean variant component separation
- ✅ Full TypeScript type safety
- ✅ JWT protected endpoints
- ✅ Migration-based setup
- ✅ Comprehensive documentation

---

Generated: January 21, 2026  
Status: ✅ Implementation Complete
