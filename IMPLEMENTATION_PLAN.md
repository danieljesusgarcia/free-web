# Development Server Setup - Implementation Plan

## Problem Statement

The current website uses `localStorage` for newsletter subscriptions, which is:
- **Client-side only**: Data doesn't persist across browsers/devices
- **Not production-ready**: Real applications need server-side storage
- **File protocol limitations**: Running as `file://` instead of `http://`

## Proposed Solution

Set up a proper development environment with:
1. **Node.js/Express server** to serve static files
2. **REST API** for newsletter subscriptions
3. **JSON file storage** (simple database alternative for development)
4. **CORS support** for API requests

## Implementation Details

### 1. Backend Server Setup

#### [NEW] package.json
Initialize npm project with dependencies:
- `express`: Web server framework
- `cors`: Enable cross-origin requests
- `body-parser`: Parse JSON request bodies

#### [NEW] server.js
Express server that:
- Serves static files from current directory
- Provides `/api/subscribe` POST endpoint
- Stores subscriptions in `subscribers.json`
- Returns appropriate success/error responses
- Runs on `http://localhost:3000`

#### [NEW] subscribers.json
JSON file to store newsletter subscriptions:
```json
{
  "subscribers": []
}
```

### 2. Frontend Updates

#### [MODIFY] script.js
Replace localStorage logic with API calls:
- Use `fetch()` to POST to `/api/subscribe`
- Handle server responses (success, duplicate, error)
- Keep the same visual feedback (success/error messages)
- Remove all localStorage references

### 3. Development Workflow

#### [NEW] .gitignore
Ignore:
- `node_modules/`
- `subscribers.json` (contains user data)

#### [NEW] README.md
Document:
- How to install dependencies (`npm install`)
- How to start the server (`npm start`)
- API endpoints available
- Development vs production notes

## API Specification

### POST /api/subscribe
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Successfully subscribed!",
  "email": "user@example.com"
}
```

**Duplicate Response (409):**
```json
{
  "success": false,
  "message": "Email already subscribed",
  "email": "user@example.com"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Benefits

✅ **Proper development environment**: Run on `http://localhost:3000`  
✅ **Server-side storage**: Data persists properly  
✅ **Production-like**: Mimics real application architecture  
✅ **Easy to extend**: Can add database later (MongoDB, PostgreSQL, etc.)  
✅ **API-ready**: Frontend uses standard HTTP requests  

## Migration Path to Production

When ready for production, you can:
1. Replace JSON file with a real database
2. Add authentication/authorization
3. Add email validation service
4. Deploy to a hosting platform (Vercel, Netlify, Heroku, etc.)
5. Add email sending functionality (SendGrid, Mailchimp, etc.)

## Testing Plan

1. Start the server: `npm start`
2. Open browser to `http://localhost:3000`
3. Test newsletter subscription with new email
4. Verify success message appears
5. Try same email again - verify duplicate message
6. Check `subscribers.json` file contains the data
7. Restart server - verify data persists
