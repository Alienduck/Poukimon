import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Axios from "../services/Axios";
import { storage } from "../services/Storage";

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

    if (loading) return <div className="loader">Chargement de vos favoris...</div>;

    return (
        <div className="list-page" style={{ width: "100%", textAlign: "center", padding: "20px" }}>
            <h2>My Team (⭐ {favPokemons.length})</h2>
            {favPokemons.length === 0 ? (
                <p>No favorites yet. Go to the <Link to="/list">list</Link> to add some!</p>
            ) : (
                <ul className="pokemon-grid">
                    {favPokemons.map((p) => (
                        <li key={p.pokedex_id} style={{ position: "relative" }}>
                            <button 
                                className="fav-btn" 
                                onClick={(e) => toggleFavorite(e, p.pokedex_id)}
                                style={{ position: "absolute", top: "10px", left: "10px", color: "#ffcb05", backgroundColor: "transparent" }}
                            >★</button>
                            <Link to={`/pokemon/${p.pokedex_id}`} className="pokemon-card-link">
                                <span className="pokemon-id">#{p.pokedex_id}</span>
                                <img src={p.sprites?.regular} alt={p.name?.fr} loading="lazy" />
                                <span className="pokemon-name">{p.name?.fr}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}