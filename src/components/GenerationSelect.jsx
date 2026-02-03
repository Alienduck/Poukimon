import { useState, useRef, useEffect } from "react";

export default function GenerationSelect({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const generations = Array.from({ length: 9 }, (_, i) => i + 1);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="type-select" ref={ref} style={{ minWidth: "160px" }}>
            <div className="type-select-display" onClick={() => setOpen(!open)}>
                <span>
                    {value === 0 ? "All Gens" : `Gen ${value}`}
                </span>
                <span style={{ fontSize: "0.8em", marginLeft: "auto" }}>▼</span>
            </div>

            {open && (
                <div className="type-select-options">
                    <div 
                        className="option" 
                        onClick={() => { onChange(0); setOpen(false); }}
                        style={{ justifyContent: "center" }}
                    >
                        All Generations
                    </div>

                    {generations.map(gen => (
                        <div
                            key={gen}
                            className="option"
                            onClick={() => { onChange(gen); setOpen(false); }}
                            style={{ justifyContent: "center" }}
                        >
                            <span>Generation {gen}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}