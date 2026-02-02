export const storage = {
  getFavs: () => JSON.parse(localStorage.getItem("favs") || "[]"),
  setFavs: (favs) => localStorage.setItem("favs", JSON.stringify(favs)),
  
  setCookie: (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  },
  getCookie: (name) => {
    return document.cookie.split("; ").reduce((r, v) => {
      const parts = v.split("=");
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, "");
  }
};