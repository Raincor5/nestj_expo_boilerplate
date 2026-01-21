# A/B Testing Implementation Guide

## Overview

This document describes the A/B testing system implemented in the NestJS + Expo authentication boilerplate. The system allows you to test different UI variants with users and track their interactions.

## Architecture

### Backend Components

#### 1. Database Schema
Located in: `backend/src/database/migrations/002-setup-abtest.sql`

Tables:
- **ab_tests**: Defines tests (e.g., "home_ui_test")
- **ab_test_groups**: Defines variants for each test (e.g., "variant_a", "variant_b")
- **ab_test_assignments**: Tracks which user is assigned to which group
- **ab_test_metrics**: Records user interactions and events

#### 2. TypeORM Entities
- `ABTest`: Main test entity
- `ABTestGroup`: Variant/group definitions
- `ABTestAssignment`: User-to-group mappings
- `ABTestMetric`: Event tracking data

Located in: `backend/src/abtest/entities/`

#### 3. ABTest Service
File: `backend/src/abtest/abtest.service.ts`

Key methods:
- `assignUserToTest(userId, testName)`: Assigns user to a random group (50/50 by default)
- `getUserTestAssignment(userId, testName)`: Retrieves user's assignment
- `recordMetric(userId, testName, metricData)`: Stores an event
- `getTestMetrics(testName)`: Aggregates metrics by variant

#### 4. ABTest Controller
File: `backend/src/abtest/abtest.controller.ts`

Endpoints:
- `POST /abtest/assign/:testName` - Assign user to test
- `GET /abtest/group/:testName` - Get user's group assignment
- `POST /abtest/metrics/:testName` - Record a metric
- `GET /abtest/metrics/:testName` - Get user's metrics
- `GET /abtest/results/:testName` - Get aggregated test results

### Frontend Components

#### 1. Storage Layer
File: `frontend/src/utils/storage.ts`

New methods:
- `setTestGroup(testGroup)`: Persists test group assignment
- `getTestGroup()`: Retrieves stored test group
- Updated `clearTokens()`: Now also clears test group

#### 2. Auth Context
File: `frontend/src/context/AuthContext.tsx`

New state:
- `testGroup`: Stores current test group assignment
- Automatically fetches and stores test group on login/register

#### 3. Variant Screens
- `frontend/src/screens/HomeScreen_VariantA.tsx`: Control variant (original style)
- `frontend/src/screens/HomeScreen_VariantB.tsx`: Treatment variant (dark theme with cards)

#### 4. Metrics Service
File: `frontend/src/services/abtestService.ts`

Methods:
- `getTestGroup(testName)`: Fetch current assignment
- `recordMetric(testName, metricData)`: Send single metric
- `recordMetrics(testName, metrics)`: Batch send metrics
- `getUserMetrics(testName)`: Fetch user's metrics

#### 5. Metrics Hook
File: `frontend/src/hooks/useABTestMetrics.ts`

Features:
- `trackEvent(eventName, eventValue)`: Queue event (debounced)
- `trackEventImmediate(eventName, eventValue)`: Send immediately
- `flushMetrics()`: Force send queued events
- Auto-batching and debouncing (5s by default)

#### 6. Home Screen Integration
File: `frontend/src/screens/HomeScreen.tsx`

Features:
- Conditionally renders Variant A or B based on `testGroup.groupName`
- Tracks "screen_viewed" on mount
- Tracks button clicks and other interactions
- Ensures metrics are flushed before logout

## Usage

### Setting Up the Database

Run the migration:
```bash
npm run migration:run
```

This creates:
1. Four new tables
2. A default test named "home_ui_test"
3. Two groups: "variant_a" and "variant_b"

### Backend Usage

The auth service automatically assigns users to a test group on login/register:

```typescript
// User receives testGroup in auth response
{
  accessToken: "...",
  refreshToken: "...",
  user: { id: "...", email: "..." },
  testGroup: {
    testId: "...",
    testName: "home_ui_test",
    groupId: "...",
    groupName: "variant_a" | "variant_b",
    assignedAt: "2024-01-21T10:00:00Z"
  }
}
```

### Frontend Usage

#### Basic tracking
```tsx
import { useABTestMetrics } from '../hooks/useABTestMetrics';

function MyComponent() {
  const { trackEvent, trackEventImmediate } = useABTestMetrics('home_ui_test');

  const handleClick = () => {
    trackEvent('button_clicked');  // Queued and sent with debounce
  };

  const handlePurchase = async () => {
    await trackEventImmediate('purchase_completed', 'premium');  // Sent immediately
  };

  return <></>;
}
```

#### Accessing test group
```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { testGroup } = useAuth();
  
  if (testGroup.groupName === 'variant_b') {
    return <VariantB />;
  }
  return <VariantA />;
}
```

### Creating New Tests

1. Add to database migration:
```sql
INSERT INTO ab_tests (name, description, active)
VALUES ('my_new_test', 'Test description', true);

INSERT INTO ab_test_groups (test_id, group_name, description)
SELECT id, 'variant_a', 'Control'
FROM ab_tests WHERE name = 'my_new_test';

INSERT INTO ab_test_groups (test_id, group_name, description)
SELECT id, 'variant_b', 'Treatment'
FROM ab_tests WHERE name = 'my_new_test';
```

2. Use in frontend:
```tsx
const { trackEvent } = useABTestMetrics('my_new_test');
```

## Metrics

### Available Metrics (home_ui_test)

| Event | Variant | Notes |
|-------|---------|-------|
| screen_viewed | A, B | Fired on screen mount |
| view_details_clicked | A | Only in Variant A |
| copy_userid_clicked | B | Only in Variant B |
| share_profile_clicked | B | Only in Variant B |

### Querying Metrics

#### Get user's metrics
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/abtest/metrics/home_ui_test
```

#### Get aggregated results
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/abtest/results/home_ui_test
```

Response:
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
      "copy_userid_clicked": [...]
    }
  }
}
```

## Design Decisions

1. **Random 50/50 Distribution**: Users are randomly assigned to one of two groups equally
2. **Persistent Assignment**: Once assigned, user stays in the same variant for consistency
3. **Debounced Batching**: Frontend batches metrics to reduce network load
4. **Immediate Mode**: Important metrics can be sent immediately via `trackEventImmediate()`
5. **Separate Variant Components**: Cleaner code organization than inline conditionals

## Future Enhancements

1. **Weighted Distribution**: Allow 70/30 or custom distributions
2. **Multi-variate Testing**: Test more than 2 variants
3. **Experiment Timeline**: Schedule tests with start/end dates
4. **Statistical Analysis**: Built-in significance testing
5. **Rollout Strategy**: Gradually increase traffic to winning variant
6. **Admin Dashboard**: Visualize results and manage tests
7. **Feature Flags**: Tie tests to feature flag system

## Troubleshooting

### Users not getting test group
- Check that AB test tables exist: `SELECT * FROM ab_tests;`
- Verify migration ran successfully
- Check auth service is using ABTestService

### Metrics not being recorded
- Verify JWT token is valid
- Check network tab for failed requests
- Ensure `trackEvent()` or `trackEventImmediate()` is called
- Check that metrics hook is properly initialized

### Wrong variant showing
- Clear app cache/storage
- Verify `testGroup.groupName` value in console
- Check HomeScreen conditional logic

## Key Files

```
Backend:
- backend/src/database/migrations/002-setup-abtest.sql
- backend/src/abtest/ (module, service, controller, entities, DTOs)
- backend/src/auth/auth.service.ts (integration)

Frontend:
- frontend/src/config/constants.ts (storage keys)
- frontend/src/utils/storage.ts (persistence)
- frontend/src/context/AuthContext.tsx (state management)
- frontend/src/services/abtestService.ts (API calls)
- frontend/src/hooks/useABTestMetrics.ts (tracking)
- frontend/src/screens/HomeScreen.tsx (conditional rendering)
- frontend/src/screens/HomeScreen_VariantA.tsx (control)
- frontend/src/screens/HomeScreen_VariantB.tsx (treatment)
```
