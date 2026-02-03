import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "../services/Axios";

export default function RandomPokemon() {
    const getRandomId = () => Math.floor(Math.random() * 1025) + 1;
    const [pokemonId, setPokemonId] = useState(getRandomId());
    const [pokeData, setPokeData] = useState(null);

    const handleRefresh = () => {
        setPokemonId(getRandomId());
    };

    useEffect(() => {
        Axios.get(`/pokemon/${pokemonId}`)
                    .then(res => res.data ? setPokeData(res.data) : setError(true))
                    .catch(() => setError(true));
    }, [pokemonId]);

    return (
        <div className="random-container">
            <h2>Random Poukimon</h2>
            <Link to={`/pokemon/${pokemonId}`}>
                <img
                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
                    src={`https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${pokemonId}/regular.png`}
                    alt={`Pokémon numéro ${pokemonId}`}
                />
            </Link>
            <br />
            <label htmlFor="poukimon-name">{pokeData ? pokeData.name.fr : "Loading..."}</label>
            <br />
            <button onClick={handleRefresh}>Change Poukimon</button>
        </div>
    );
}