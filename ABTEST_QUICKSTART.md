# A/B Testing - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Run Database Migration
```bash
cd backend
npm run migration:run
```

This creates the A/B testing tables and default test data.

### 2. Start Backend
```bash
npm run start:dev
```

### 3. Start Frontend
```bash
cd ../frontend
expo start --tunnel
```

### 4. Test It!

#### Register a new user:
```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "test1@example.com",
  "password": "password123"
}
```

You'll see in the response:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "email": "test1@example.com"
  },
  "testGroup": {
    "testId": "...",
    "testName": "home_ui_test",
    "groupId": "...",
    "groupName": "variant_a",  // or "variant_b"
    "assignedAt": "2024-01-21T10:00:00Z"
  }
}
```

#### Check metrics after user interaction:
```bash
GET http://localhost:3000/abtest/metrics/home_ui_test
Authorization: Bearer <access_token>
```

#### Get aggregated results:
```bash
GET http://localhost:3000/abtest/results/home_ui_test
Authorization: Bearer <access_token>
```

---

## 📊 What You'll See

### Frontend
- **Variant A**: Light theme with basic info display and "View Details" button
- **Variant B**: Dark theme with avatar, "Copy ID" and "Share" buttons

### Backend Metrics
```json
{
  "testName": "home_ui_test",
  "testId": "xxxxxx",
  "aggregated": {
    "variant_a": {
      "screen_viewed": [
        {
          "value": null,
          "recordedAt": "2024-01-21T10:05:30.123Z"
        },
        {
          "value": null,
          "recordedAt": "2024-01-21T10:06:45.456Z"
        }
      ],
      "view_details_clicked": [
        {
          "value": null,
          "recordedAt": "2024-01-21T10:06:00.789Z"
        }
      ]
    },
    "variant_b": {
      "screen_viewed": [...],
      "copy_userid_clicked": [...],
      "share_profile_clicked": [...]
    }
  }
}
```

---

## 🎯 Event Tracking Flow

1. User registers → Gets random variant assignment
2. Frontend loads → Tracks "screen_viewed"
3. User clicks button → Variant-specific event tracked
4. Events batched → Sent after 5 seconds
5. Backend stores → In ab_test_metrics table
6. Query results → See metrics grouped by variant

---

## 🔧 How to Modify

### Track Custom Events
In any component:
```tsx
const { trackEvent } = useABTestMetrics('home_ui_test');

const handleAction = () => {
  trackEvent('my_custom_event', 'optional_value');
};
```

### Change Test Distribution
In `backend/src/abtest/abtest.service.ts`, line ~70:
```typescript
// Change from 50/50 to 70/30
const randomGroupIndex = Math.random() < 0.7 ? 0 : 1;
```

### Create New Test
Add to database or migration:
```sql
INSERT INTO ab_tests (name, description, active)
VALUES ('my_test', 'My test description', true);

INSERT INTO ab_test_groups (test_id, group_name, description)
SELECT id, 'variant_a', 'Control' FROM ab_tests WHERE name = 'my_test';

INSERT INTO ab_test_groups (test_id, group_name, description)
SELECT id, 'variant_b', 'Treatment' FROM ab_tests WHERE name = 'my_test';
```

Then use:
```tsx
const { trackEvent } = useABTestMetrics('my_test');
```

---

## 📁 Key Files

| Location | Purpose |
|----------|---------|
| `backend/src/abtest/` | Service, controller, entities |
| `backend/src/database/migrations/002-setup-abtest.sql` | Schema & data |
| `frontend/src/services/abtestService.ts` | API client |
| `frontend/src/hooks/useABTestMetrics.ts` | Event tracking |
| `frontend/src/screens/HomeScreen*.tsx` | Variants |
| `ABTEST_IMPLEMENTATION.md` | Full documentation |

---

## ✅ Verification Checklist

- [ ] Backend migration ran successfully
- [ ] Backend starts without errors: `npm run start:dev`
- [ ] Frontend starts: `expo start --tunnel`
- [ ] Can register user and see testGroup in response
- [ ] App shows either Variant A or Variant B
- [ ] Button clicks are tracked
- [ ] Can query `/abtest/metrics/home_ui_test`
- [ ] Can query `/abtest/results/home_ui_test`
- [ ] Different users see different variants (due to random assignment)

---

## 🐛 Troubleshooting

### Migration fails
```
Error: relation "ab_tests" already exists
```
Solution: Table already created, this is fine. Migration is idempotent.

### "Test not found"
```
NotFoundException: Test "home_ui_test" not found or inactive
```
Solution: Run migration to create default test, or check DB:
```sql
SELECT * FROM ab_tests WHERE name = 'home_ui_test';
```

### Wrong variant showing
- Clear app cache
- Login again
- Check `testGroup.groupName` in console
- Verify HomeScreen conditional render logic

### Metrics not recording
- Verify token is valid
- Check network tab for 401/404
- Ensure `trackEvent()` called (check console)
- Verify backend running and metrics endpoint reachable

---

## 📈 Next Steps

1. **Add More Events**: Track additional user interactions
2. **Custom Variants**: Design more visual differences
3. **Statistical Analysis**: Implement significance testing
4. **Dashboard**: Build admin dashboard to view results
5. **Feature Flags**: Integrate with feature flag system
6. **Rollout**: Gradually shift 100% traffic to winning variant

---

## 📞 API Reference

All endpoints require JWT (`Authorization: Bearer <token>`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/abtest/assign/:testName` | Assign user (auto on login) |
| GET | `/abtest/group/:testName` | Get user's variant |
| POST | `/abtest/metrics/:testName` | Record event |
| GET | `/abtest/metrics/:testName` | User's events |
| GET | `/abtest/results/:testName` | Aggregated results |

---

**Ready to test!** 🎉

Proceed to run the migrations and start both services.
