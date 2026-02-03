import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Axios from '../services/Axios';
import '../Home.css';

export default function Home() {
  const [stats, setStats] = useState({ total: 0, types: 0 });
  const [featuredPokemon, setFeaturedPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get('/pokemon')
      .then(res => {
        const data = res.data;
        const typeSet = new Set();
        data.forEach(p => p.types?.forEach(t => typeSet.add(t.name)));
        
        setStats({ total: data.length, types: typeSet.size });
        
        // Get 6 random featured Pokemon
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setFeaturedPokemon(shuffled.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const features = [
    {
      icon: '📋',
      title: 'Complete Pokédex',
      description: 'Browse the entire collection of Pokémon with advanced filtering',
      link: '/list',
      color: '#667eea'
    },
    {
      icon: '🎲',
      title: 'Random Discovery',
      description: 'Discover random Pokémon and explore new favorites',
      link: '/random',
      color: '#f093fb'
    },
    {
      icon: '🎮',
      title: 'Guessing Game',
      description: 'Test your knowledge with our fun Pokémon guessing game',
      link: '/guess',
      color: '#4facfe'
    },
    {
      icon: '⭐',
      title: 'My Dream Team',
      description: 'Build and manage your personal collection of favorites',
      link: '/favorites',
      color: '#43e97b'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Welcome to</div>
          <h1 className="hero-title">
            <span className="title-icon">🔴</span>
            Poukimon Universe
          </h1>
          <p className="hero-subtitle">
            Explore, collect, and discover your favorite Pokémon in this comprehensive interactive experience
          </p>
          
          <div className="hero-stats">
            <div className="stat-box">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Pokémon</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <div className="stat-number">{stats.types}</div>
              <div className="stat-label">Types</div>
            </div>
          </div>

          <div className="hero-cta">
            <Link to="/list" className="cta-primary">
              Explore Pokédex
            </Link>
            <Link to="/random" className="cta-secondary">
              Random Pokémon
            </Link>
          </div>
        </div>
        
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">Features & Tools</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.link} 
              className="feature-card"
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      {!loading && featuredPokemon.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">Featured Pokémon</h2>
            <Link to="/list" className="view-all-link">
              View All →
            </Link>
          </div>
          
          <div className="featured-grid">
            {featuredPokemon.map((pokemon, index) => (
              <Link 
                key={pokemon.pokedex_id}
                to={`/pokemon/${pokemon.pokedex_id}`}
                className="featured-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="featured-badge">
                  #{String(pokemon.pokedex_id).padStart(3, '0')}
                </div>
                <div className="featured-image-container">
                  <img 
                    src={pokemon.sprites?.regular} 
                    alt={pokemon.name?.fr}
                    className="featured-image"
                  />
                </div>
                <div className="featured-name">{pokemon.name?.fr}</div>
                <div className="featured-types">
                  {pokemon.types?.map((type, i) => (
                    <img 
                      key={i}
                      src={type.image} 
                      alt={type.name}
                      className="type-icon-small"
                      title={type.name}
                    />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="quick-actions-section">
        <div className="quick-actions-card">
          <h3 className="quick-title">Ready to Start Your Journey?</h3>
          <p className="quick-description">
            Build your dream team, test your knowledge, or simply explore the vast world of Pokémon
          </p>
          <div className="quick-buttons">
            <Link to="/favorites" className="quick-btn primary">
              <span className="btn-icon">⭐</span>
              My Team
            </Link>
            <Link to="/guess" className="quick-btn secondary">
              <span className="btn-icon">🎮</span>
              Play Game
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}