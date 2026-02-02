import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Axios from "../services/Axios";
import { storage } from "../services/Storage";
import "../Favorites.css";

export default function Favorites() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState(storage.getFavs());

    useEffect(() => {
        Axios.get("/pokemon").then(res => {
            setPokemons(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const toggleFavorite = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        const newFavs = favorites.filter(favId => favId !== id);
        setFavorites(newFavs);
        storage.setFavs(newFavs);
    };

    const favPokemons = useMemo(() => 
        pokemons.filter(p => favorites.includes(p.pokedex_id)), 
    [pokemons, favorites]);

    if (loading) return <div className="loader">Loading your team...</div>;

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <div className="header-content">
                    <h1 className="page-title">
                        <span className="title-icon">⭐</span>
                        My Dream Team
                    </h1>
                    <div className="team-count">
                        <span className="count-number">{favPokemons.length}</span>
                        <span className="count-label">Pokémon</span>
                    </div>
                </div>
                <div className="header-decoration"></div>
            </div>

            {favPokemons.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">✨</div>
                    <h2>Your team is waiting!</h2>
                    <p>Add your favorite Pokémon to build your dream team.</p>
                    <Link to="/list" className="cta-button">
                        Explore Pokédex
                    </Link>
                </div>
            ) : (
                <div className="team-grid">
                    {favPokemons.map((p, index) => (
                        <div 
                            key={p.pokedex_id} 
                            className="team-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <button 
                                className="remove-btn" 
                                onClick={(e) => toggleFavorite(e, p.pokedex_id)}
                                title="Remove from team"
                            >
                                <span className="remove-icon">×</span>
                            </button>

                            <Link to={`/pokemon/${p.pokedex_id}`} className="card-link">
                                <div className="card-badge">
                                    #{String(p.pokedex_id).padStart(3, '0')}
                                </div>

                                <div className="card-image-container">
                                    <div className="image-bg"></div>
                                    <img 
                                        src={p.sprites?.regular} 
                                        alt={p.name?.fr} 
                                        className="card-image"
                                        loading="lazy" 
                                    />
                                </div>

                                <div className="card-info">
                                    <h3 className="card-name">{p.name?.fr}</h3>
                                    
                                    {p.types && p.types.length > 0 && (
                                        <div className="card-types">
                                            {p.types.map((t, i) => (
                                                <img 
                                                    key={i}
                                                    src={t.image} 
                                                    alt={t.name}
                                                    className="type-icon"
                                                    title={t.name}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}