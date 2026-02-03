import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NuqsAdapter } from 'nuqs/adapters/react'
import './Layout.css'
import Home from './components/Home'
import Pokelist from './components/Pokelist'
import RandomPokemon from './components/RandomPokemon'
import GuessPokemon from './components/GuessPokemon'
import Header from './components/Header'
import Footer from './components/Footer'
import PokemonDetail from './components/PokemonDetail'
import Favorites from './components/Favorites'
import { ThemeProvider } from './components/Themecontext'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <NuqsAdapter>
          <div className="app-container">
            <Header />
            <main className="app-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pokemon/:id" element={<PokemonDetail />} />
                <Route path="/list" element={<Pokelist />} />
                <Route path="/random" element={<RandomPokemon />} />
                <Route path="/guess" element={<GuessPokemon />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NuqsAdapter>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App