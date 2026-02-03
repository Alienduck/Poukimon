import { useState, useEffect, useMemo } from "react";
import { useQueryState, parseAsBoolean, parseAsInteger } from 'nuqs';
import { Link } from "react-router-dom";
import Axios from "../services/Axios";
import TypeSelect from "./TypeSelect";
import GenerationSelect from "./GenerationSelect";
import { storage } from "../services/Storage";

export default function Pokelist() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [favorites, setFavorites] = useState(storage.getFavs());
    
    const [nameQuery, setNameQuery] = useQueryState('name', { defaultValue: '', clearOnDefault: true });
    const [typeQuery, setTypeQuery] = useQueryState('type', { defaultValue: 'all', clearOnDefault: true });
    const [genQuery, setGenQuery] = useQueryState('gen', parseAsInteger.withDefault(0));
    const [favsOnly, setFavsOnly] = useQueryState('favs', parseAsBoolean.withDefault(false));

    useEffect(() => {
        Axios.get("/pokemon")
            .then(res => {
                setPokemons(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const toggleFavorite = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        
        const newFavs = favorites.includes(id) 
            ? favorites.filter(favId => favId !== id) 
            : [...favorites, id];
            
        setFavorites(newFavs);
        storage.setFavs(newFavs);
    };

    const availableTypes = useMemo(() => {
        const typeMap = new Map();
        pokemons.forEach(p => {
            p.types?.forEach(t => {
                if (!typeMap.has(t.name)) {
                    typeMap.set(t.name, t.image);
                }
            });
        });
        return Array.from(typeMap.entries()).map(([name, image]) => ({ name, image }));
    }, [pokemons]);

    const filteredPokemons = useMemo(() => {
        return pokemons.filter(p => {
            const matchName = p.name?.fr?.toLowerCase().includes(nameQuery.toLowerCase());
            const matchType = typeQuery === 'all' || p.types?.some(t => t.name === typeQuery);
            const matchGen = genQuery === 0 || p.generation === genQuery;
            const matchFav = !favsOnly || favorites.includes(p.pokedex_id);
            
            return matchName && matchType && matchGen && matchFav;
        });
    }, [pokemons, nameQuery, typeQuery, genQuery, favsOnly, favorites]);

    if (loading) return <div className="loader">Loading Poukidex...</div>;

    return (
        <div className="list-page" style={{ width: "100%", alignItems: "center", margin: "auto", textAlign: "center", gap: "20px", padding: "20px" }}>
            <div className="filter-container" style={{ margin: "auto", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}>
                <input
                    type="text"
                    placeholder="Enter name..."
                    value={nameQuery}
                    onChange={e => setNameQuery(e.target.value)}
                    style={{ width: "100%", textAlign: "center" }}
                />
                
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                    <TypeSelect
                        value={typeQuery}
                        onChange={setTypeQuery}
                        options={availableTypes}
                    />
                    
                    <GenerationSelect 
                        value={genQuery}
                        onChange={setGenQuery}
                    />

                    <button 
                        onClick={() => setFavsOnly(!favsOnly)}
                        style={{ 
                            backgroundColor: favsOnly ? "#ffcb05" : "#3b4cca",
                            minWidth: "120px",
                            height: "42px"
                        }}
                    >
                        {favsOnly ? "⭐ Favorites" : "☆ Show Favorites"}
                    </button>
                </div>
                
                <small>{filteredPokemons.length} result(s)</small>
            </div>

            <ul className="pokemon-grid">
                {filteredPokemons.map((p) => (
                    <li key={p.pokedex_id} style={{ position: "relative" }}>
                        <button 
                            className="fav-btn" 
                            onClick={(e) => toggleFavorite(e, p.pokedex_id)}
                            style={{ 
                                position: "absolute", top: "10px", left: "10px", 
                                background: "none", border: "none", fontSize: "1.5rem",
                                cursor: "pointer", color: favorites.includes(p.pokedex_id) ? "#ffcb05" : "#ccc"
                            }}
                        >
                            {favorites.includes(p.pokedex_id) ? "★" : "☆"}
                        </button>

                        <Link to={`/pokemon/${p.pokedex_id}`} className="pokemon-card-link">
                            <span className="pokemon-id">#{p.pokedex_id}</span>
                            <img src={p.sprites?.regular} alt={p.name?.fr} loading="lazy" />
                            <span className="pokemon-name">{p.name?.fr}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}