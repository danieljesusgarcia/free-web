# Youthness Website

A vibrant, modern website for youth-focused products and services featuring blog posts and newsletter functionality.

## Features

- 🎨 **Modern Design**: Vibrant gradients, glassmorphism effects, smooth animations
- 📝 **Blog System**: Three detailed blog posts with full content
- 💌 **Newsletter**: Server-side subscription management with API
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🚀 **Production-Ready**: Backend API with proper data persistence

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

The server will automatically serve all static files and provide API endpoints for the newsletter functionality.

## Project Structure

```
free-web/
├── server.js              # Express backend server
├── package.json           # Node.js dependencies
├── subscribers.json       # Newsletter subscriptions (auto-generated)
├── index.html             # Main landing page
├── blog-friendship.html   # Blog post: Friendship
├── blog-creativity.html   # Blog post: Creativity
├── blog-urban.html        # Blog post: Urban Exploration
├── styles.css             # Main stylesheet
├── script.js              # Frontend JavaScript (API integration)
└── [images]               # Product and blog images
```

## API Endpoints

### POST /api/subscribe
Subscribe to the newsletter.

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

### GET /api/subscribers/count
Get the total number of subscribers (for admin purposes).

**Response:**
```json
{
  "count": 42
}
```

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Storage**: JSON file (development) - easily replaceable with a database
- **Styling**: Custom CSS with design system, glassmorphism, gradients

## Newsletter Functionality

The newsletter system uses a REST API for subscriptions:

1. User enters email and clicks "Subscribe"
2. Frontend sends POST request to `/api/subscribe`
3. Backend validates email and checks for duplicates
4. If valid, saves to `subscribers.json`
5. Returns success/error response
6. Frontend displays appropriate message

## Production Deployment

For production deployment:

1. **Replace JSON storage** with a database (MongoDB, PostgreSQL, etc.)
2. **Add environment variables** for configuration
3. **Set up email service** (SendGrid, Mailchimp) to actually send newsletters
4. **Add authentication** if you need admin features
5. **Deploy to hosting platform**:
   - Vercel (recommended for static + API)
   - Netlify Functions
   - Heroku
   - DigitalOcean
   - AWS

## Development vs Production

**Current (Development):**
- JSON file storage
- No email sending
- Simple validation
- Local server only

**Production Ready:**
- Database storage
- Email service integration
- Advanced validation & security
- HTTPS, rate limiting, etc.

## License

MIT

## Author

Created with ✨ by Antigravity
