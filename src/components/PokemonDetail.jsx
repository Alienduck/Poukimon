import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Axios from "../services/Axios";
import "../PokemonDetail.css";

export default function PokemonDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(false);
    const [spriteIndex, setSpriteIndex] = useState(0);

    useEffect(() => {
        setPokemon(null);
        setError(false);
        setSpriteIndex(0); // Reset sprite view when ID changes
        Axios.get(`/pokemon/${id}`)
            .then(res => res.data ? setPokemon(res.data) : setError(true))
            .catch(() => setError(true));
    }, [id]);

    // Compute available sprites with their metadata
    const validSprites = useMemo(() => {
        if (!pokemon?.sprites) return [];
        const list = [
            { src: pokemon.sprites.regular, isShiny: false, isGmax: false },
            { src: pokemon.sprites.shiny, isShiny: true, isGmax: false },
            { src: pokemon.sprites.gmax?.regular, isShiny: false, isGmax: true },
            { src: pokemon.sprites.gmax?.shiny, isShiny: true, isGmax: true }
        ];
        return list.filter(item => item.src); // Only keep existing images
    }, [pokemon]);

    if (error) return (
        <div className="error-msg">
            <h2>Pokémon not found</h2>
            <button onClick={() => navigate('/list')}>← Back to List</button>
        </div>
    );
    
    if (!pokemon) return <div className="loader">Loading...</div>;

    const currentSprite = validSprites[spriteIndex] || validSprites[0];

    const handlePrev = () => {
        setSpriteIndex(prev => (prev === 0 ? validSprites.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSpriteIndex(prev => (prev === validSprites.length - 1 ? 0 : prev + 1));
    };

    const getStatPct = (v) => Math.min((v / 255) * 100, 100);
    
    const typeColors = {
        Normal: "#A8A878", Feu: "#F08030", Eau: "#6890F0", 
        Électrik: "#F8D030", Plante: "#78C850", Glace: "#98D8D8",
        Combat: "#C03028", Poison: "#A040A0", Sol: "#E0C068",
        Vol: "#A890F0", Psy: "#F85888", Insecte: "#A8B820",
        Roche: "#B8A038", Spectre: "#705898", Dragon: "#7038F8",
        Ténèbres: "#705848", Acier: "#B8B8D0", Fée: "#EE99AC"
    };

    const primaryType = pokemon.types?.[0]?.name;
    const primaryColor = typeColors[primaryType] || "#3b4cca";

    const statLabels = {
        hp: "HP", atk: "Attack", def: "Defense",
        spe_atk: "Sp. Atk", spe_def: "Sp. Def", vit: "Speed"
    };

    return (
        <div className="pokemon-detail-page" style={{ '--primary-color': primaryColor }}>
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

            <div className="detail-hero">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <div className="pokemon-header">
                        <span className="pokemon-number">#{String(pokemon.pokedex_id).padStart(3, '0')}</span>
                        
                        {/* Title Container with badges */}
                        <div className="title-container">
                            <h1 className="pokemon-title">
                                {pokemon.name?.fr}
                                {currentSprite?.isShiny && <span className="shiny-star" title="Shiny">★</span>}
                            </h1>
                            {currentSprite?.isGmax && <span className="gmax-badge">G-MAX</span>}
                        </div>

                        <div className="type-badges">
                            {pokemon.types?.map((t, i) => (
                                <Link to={`/list?type=${t.name}`} key={i} className="type-badge" style={{ background: typeColors[t.name] }}>
                                    <img src={t.image} alt={t.name} />
                                    <span>{t.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="pokemon-display-container">
                        {validSprites.length > 1 && (
                            <button className="nav-arrow left" onClick={handlePrev}>❮</button>
                        )}
                        
                        <div className="pokemon-image-container">
                            <div className="image-glow"></div>
                            <img
                                style={ { maxWidth: '100%', height: 'auto', maxHeight: '300px', minHeight: '200px' } }
                                src={currentSprite?.src} 
                                alt={pokemon.name?.fr} 
                                className="pokemon-image-main"
                                key={currentSprite?.src} 
                            />
                        </div>

                        {validSprites.length > 1 && (
                            <button className="nav-arrow right" onClick={handleNext}>❯</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="detail-content">
                <div className="stats-card">
                    <h2 className="section-title">Base Stats</h2>
                    <div className="stats-grid">
                        {pokemon.stats && Object.entries(pokemon.stats).map(([key, value], index) => (
                            <div key={key} className="stat-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="stat-header">
                                    <span className="stat-label">{statLabels[key] || key}</span>
                                    <span className="stat-value">{value}</span>
                                </div>
                                <div className="stat-bar-container">
                                    <div 
                                        className="stat-bar-fill" 
                                        style={{ 
                                            width: `${getStatPct(value)}%`,
                                            animationDelay: `${index * 0.1 + 0.2}s`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="total-stats">
                        <span>Total</span>
                        <span className="total-value">
                            {pokemon.stats && Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}
                        </span>
                    </div>
                </div>

                {(pokemon.evolution?.pre?.length > 0 || pokemon.evolution?.next?.length > 0) && (
                    <div className="evolution-card">
                        <h2 className="section-title">Evolution Chain</h2>
                        <div className="evolution-chain">
                            {pokemon.evolution?.pre?.map((e, i) => (
                                <Link key={i} to={`/pokemon/${e.pokedex_id}`} className="evolution-item previous">
                                    <div className="evo-label">Previous</div>
                                    <div className="evo-name">{e.name}</div>
                                    <div className="evo-arrow">→</div>
                                </Link>
                            ))}
                            
                            <div className="evolution-item current">
                                <div className="evo-label">Current</div>
                                <div className="evo-name">{pokemon.name?.fr}</div>
                            </div>

                            {pokemon.evolution?.next?.map((e, i) => (
                                <Link key={i} to={`/pokemon/${e.pokedex_id}`} className="evolution-item next">
                                    <div className="evo-arrow">→</div>
                                    <div className="evo-label">Next</div>
                                    <div className="evo-name">{e.name}</div>
                                    {e.condition && <div className="evo-condition">{e.condition}</div>}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}