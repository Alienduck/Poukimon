import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Axios from "../services/Axios";

export default function PokemonDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        setPokemon(null);
        setError(false);
        Axios.get(`/pokemon/${id}`)
            .then(res => res.data ? setPokemon(res.data) : setError(true))
            .catch(() => setError(true));
    }, [id]);

    if (error) return <div className="error-msg">Pokémon introuvable. <button onClick={() => navigate('/list')}>Retour</button></div>;
    if (!pokemon) return <div className="loader">Chargement...</div>;

    const getStatPct = (v) => Math.min((v / 255) * 100, 100);
    const getTypeCol = (t) => {
        const colors = { Normal: "#A8A878", Feu: "#F08030", Eau: "#6890F0", Électrik: "#F8D030", Plante: "#78C850", Glace: "#98D8D8", Combat: "#C03028", Poison: "#A040A0", Sol: "#E0C068", Vol: "#A890F0", Psy: "#F85888", Bug: "#A8B820", Roche: "#B8A038", Fantôme: "#705898", Dragon: "#7038F8", Sombre: "#705848", Metal: "#B8B8D0", Fée: "#EE99AC" };
        return colors[t] || "#777";
    };

    return (
        <div className="pokemon-detail-page">
            <button className="back-button" onClick={() => navigate(-1)}>← Retour</button>
            <div className="detail-container">
                <div className="header-section">
                    <span className="pokemon-id">#{pokemon.pokedex_id}</span>
                    <h1 className="pokemon-name">{pokemon.name?.fr}</h1>
                    <div className="type-badges">
                        {pokemon.types?.map((t, i) => (
                            <div key={i} className="type-badge-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '5px' }}>
                                <img src={t.image} alt={t.name} style={{ width: '30px' }} />
                                <span>{t.name}</span>
                                <br />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="content-grid">
                    <div className="image-section">
                        <img src={pokemon.sprites?.regular} alt={pokemon.name?.fr} className="main-sprite" />
                    </div>

                    <div className="info-section">
                        <div className="info-card">
                            <h2>Statistiques</h2>
                            {pokemon.stats && Object.entries(pokemon.stats).map(([k, v]) => (
                                <div key={k + v} className="stat-row">
                                    <span className="stat-name">{k.toUpperCase()}</span>
                                    <span className="stat-value">{v}</span>
                                    <div className="stat-bar"><div className="stat-fill" style={{ width: `${getStatPct(v)}%` }}></div></div>
                                </div>
                            ))}
                        </div>

                        <div className="info-card">
                            <h2>Évolutions</h2>
                            <div className="evolution-list">
                                {pokemon.evolution?.pre?.map((e, i) => (
                                    <><Link key={i} to={`/pokemon/${e.pokedex_id}`} className="evo-item">
                                        Prév: {e.name}
                                    </Link>
                                        <br />
                                    </>
                                ))}
                                {pokemon.evolution?.next?.map((e, i) => (
                                    <><Link key={i} to={`/pokemon/${e.pokedex_id}`} className="evo-item">
                                        Suiv: {e.name} ({e.condition})
                                    </Link>
                                        <br />
                                    </>
                                ))}
                                {!pokemon.evolution?.pre && !pokemon.evolution?.next && <p>Pas d'évolution</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}