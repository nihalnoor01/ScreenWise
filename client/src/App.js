import React, { useState } from "react"
import axios from "axios"
import "./App.css"

function App() {
  const [mood, setMood] = useState("")
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post(
      process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/recommend' 
        : '/recommend',
      { mood }
    );
    setRecommendedMovies(response.data.movies);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    alert("Failed to get recommendations. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const openMovieDetails = (movieId) => {
    window.open(`https://www.themoviedb.org/movie/${movieId}`, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="app">
      <header className="header">
        <h1>ScreenWise</h1>
      </header>
      <main className="main">
        <form onSubmit={handleSubmit} className="mood-form">
          <select value={mood} onChange={(e) => setMood(e.target.value)} required className="mood-select">
            <option value="">Select your mood</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="romantic">Romantic</option>
            <option value="motivated">Motivated</option>
            <option value="scared">Scared</option>
          </select>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Loading..." : "Get Recommendations"}
          </button>
        </form>

        {recommendedMovies.length > 0 && (
          <div className="movie-grid">
            {recommendedMovies.map((movie) => (
              <div key={movie.id} className="movie-card" onClick={() => openMovieDetails(movie.id)}>
                <div className="movie-image-container">
                  <img src={movie.poster || "/placeholder.svg"} alt={movie.title} className="movie-image" />
                  <div className="movie-overlay">
                    <div className="play-button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="play-icon"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p className="movie-overview">{movie.overview}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App

