import { useState } from "react";

export default function RandomPokemon() {
    const getRandomId = () => Math.floor(Math.random() * 1025) + 1;
    const [pokemonId, setPokemonId] = useState(getRandomId());

    const handleRefresh = () => {
        setPokemonId(getRandomId());
    };

    return (
        <div className="random-container">
            <h2>Random Poukimon</h2>
            <img
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
                src={`https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${pokemonId}/regular.png`}
                alt={`Pokémon numéro ${pokemonId}`}
            />
            <br />
            <button onClick={handleRefresh}>Change Poukimon</button>
        </div>
    );
}