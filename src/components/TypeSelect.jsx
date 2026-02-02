import { useState, useRef, useEffect } from "react";

export default function TypeSelect({ value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = options.find(o => o.name === value);

    return (
        <div className="type-select" ref={ref}>
            <div className="type-select-display" onClick={() => setOpen(!open)}>
                {selected ? (
                    <>
                        <img src={selected.image} alt={selected.name} />
                        <span>{selected.name}</span>
                    </>
                ) : (
                    <span>All types</span>
                )}
            </div>

            {open && (
                <div className="type-select-options">
                    <div className="option" onClick={() => { onChange("all"); setOpen(false); }}>
                        All types
                    </div>

                    {options.map(t => (
                        <div
                            key={t.name}
                            className="option"
                            onClick={() => { onChange(t.name); setOpen(false); }}
                        >
                            <img src={t.image} alt={t.name} />
                            <span>{t.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}