import { useState, useEffect } from "react";
import Axios from "../services/Axios";
import "../GuessPokemon.css";

export default function GuessPokemon() {
    const getRandomId = () => Math.floor(Math.random() * 1025) + 1;
    const [pokemonId, setPokemonId] = useState(getRandomId());
    const [pokemonData, setPokemonData] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [isGuessed, setIsGuessed] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        Axios.get(`/pokemon/${pokemonId}`)
            .then((response) => {
                setPokemonData(response.data);
                setIsGuessed(false);
                setUserInput("");
                setMessage("");
            })
            .catch((error) => console.error("Erreur lors de la récupération :", error));
    }, [pokemonId]);

    const handleGuess = () => {
        if (!pokemonData) return;

        const guess = userInput.toLowerCase().trim();
        const names = [
            pokemonData.name.fr.toLowerCase(),
            pokemonData.name.en.toLowerCase(),
            pokemonData.name.jp.toLowerCase()
        ];

        if (names.includes(guess)) {
            setIsGuessed(true);
            setMessage(`Success ! Great, it was ${pokemonData.name.fr} !`);
        } else {
            setMessage("Well, it's not that easy... Retry !");
        }
    };

    const handleRefresh = () => {
        setPokemonId(getRandomId());
    };

    return (
        <div className="game-container">
            <h2>What is that Poukimon ?</h2>
            {pokemonData && (
                <div className="pokemon-card-display">
                    <img
                        src={pokemonData.sprites.regular}
                        alt="Mystery"
                        className={isGuessed ? "revealed" : "hidden"}
                    />
                    {!isGuessed && (
                        <div className="input-group">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                                placeholder="Name..."
                            />
                            <button onClick={handleGuess}>Guess</button>
                        </div>
                    )}
                    {message && <p className="status-message">{message}</p>}
                    {isGuessed && (<div className="pokemon-info">
                        <h3>{pokemonData.name.fr} ({pokemonData.name.en})</h3>
                    </div>)}
                </div>
            )}
            <div className="buttons-container">
                {!isGuessed && <button onClick={() => setIsGuessed(true)} className="reveal-btn">Reveal Poukimon</button>}
                <button className="refresh-btn" onClick={handleRefresh}>Change Poukimon</button>
            </div>
        </div>
    );
}