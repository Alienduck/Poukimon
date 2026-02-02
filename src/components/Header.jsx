import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="main-header">
            <div className="logo">🔴 Poukimon</div>
            <nav>
                <NavLink to="/">Main</NavLink>
                <NavLink to="/list">List</NavLink>
                <NavLink to="/random">Random</NavLink>
                <NavLink to="/guess">Game</NavLink>
                <NavLink to="/favorites">My Team</NavLink>
            </nav>
        </header>
    );
}