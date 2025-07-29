# Vidify

A web application that creates music videos from Spotify playlists using YouTube videos.

## Features

- Connect your Spotify account to access your playlists
- Automatically find and play music videos for songs in your playlists
- Fullscreen video player with keyboard controls
- Responsive design that works on desktop, tablet, and mobile devices
- Shuffle and sort playlist functionality
- Alternative video ID submission for custom videos

## Responsive Design

The frontend has been optimized for all screen sizes:

### Desktop (1200px+)

- Full layout with side-by-side video player and song list
- Large touch targets and comfortable spacing
- Full feature set with all controls visible

### Tablet (768px - 1199px)

- Responsive grid layouts that adapt to screen width
- Optimized touch targets for touch devices
- Maintained functionality with adjusted spacing

### Mobile (320px - 767px)

- Single-column layout for optimal mobile viewing
- Larger touch targets (44px minimum) for better usability
- Simplified controls and improved form layouts
- Optimized video player sizing for mobile screens

### Small Mobile (320px and below)

- Ultra-compact layout for very small screens
- Reduced font sizes and spacing while maintaining usability
- Landscape orientation support for better video viewing

## Key Responsive Features

- **Flexible Grid System**: Playlists adapt from 4 columns on desktop to 1 column on mobile
- **Responsive Typography**: Font sizes scale with viewport width using `clamp()`
- **Mobile-First Design**: Built with mobile constraints in mind
- **Touch-Friendly**: All interactive elements meet minimum 44px touch target guidelines
- **Flexible Video Player**: YouTube iframe adapts to screen size while maintaining aspect ratio
- **Accessibility**: Proper focus states and keyboard navigation support

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_BACKEND_URL=http://localhost:3000
```

## Technologies Used

- **Frontend**: React, Vite, CSS3 with responsive design
- **Backend**: Node.js, Express
- **APIs**: Spotify API, YouTube Data API
