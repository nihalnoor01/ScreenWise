require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// TMDB Configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const moodToGenre = {
  happy: 35,    // Comedy
  sad: 18,      // Drama
  romantic: 10749, // Romance
  motivated: 99, // Documentary
  scared: 27     // Horror
};

// API Endpoint
app.post("/recommend", async (req, res) => {
  try {
    const { mood } = req.body;
    const genreId = moodToGenre[mood];
    
    if (!genreId) {
      return res.status(400).json({ error: "Invalid mood" });
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=1&per_page=50`
    );
    
    const movies = response.data.results.slice(0, 50).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      overview: movie.overview
    }));
    
    res.json({ movies });
  } catch (error) {
    console.error("TMDB API Error:", error.message);
    res.status(500).json({ 
      error: "Failed to fetch movies",
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});