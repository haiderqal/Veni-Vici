import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [cat, setCat] = useState(null);
  const [banList, setBanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCat = async () => {
    try {
      setLoading(true);
      setError("");
      let validCat = null;
      do {
        const response = await fetch(
          "https://api.thecatapi.com/v1/images/search?has_breeds=1",
          {
            headers: {
              "x-api-key":
                "live_oUAaaVZmnFrxt7Lf1xoFVGdIwh27J3DN0VKYFgKGxjKwdH7Dp5SaG57KgBSjgWqq",
            },
          }
        );
        const data = await response.json();
        if (data[0]?.breeds.length > 0) {
          const breedData = data[0].breeds[0];
          validCat = {
            image: data[0].url,
            breed: breedData.name,
            origin: breedData.origin,
            weight: breedData.weight.metric, // ✅ Weight added
          };
        }
      } while (validCat && banList.includes(validCat.breed));

      setCat(validCat);
    } catch (error) {
      setError("Failed to fetch cat 😿");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCat();
  }, []);

  const handleBan = (breed) => {
    setBanList((prev) =>
      prev.includes(breed)
        ? prev.filter((item) => item !== breed)
        : [...prev, breed]
    );
  };

  return (
    <div className="app-container">
      <h1>🐱 Veni Vici: Cat Edition</h1>

      {loading && <p>Loading new cat...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {cat && (
        <div className="cat-card">
          <img src={cat.image} alt={cat.breed} />
          <p onClick={() => handleBan(cat.breed)}>Breed: {cat.breed}</p>
          <p>Origin: {cat.origin}</p>
          <p>Weight: {cat.weight} kg</p> {/* ✅ Display weight */}
        </div>
      )}

      <button onClick={fetchCat}>Discover New Cat</button>

      <div className="ban-list">
        {banList.length > 0 ? (
          <>
            <h2>🚫 Ban List</h2>
            {banList.map((breed) => (
              <span key={breed} onClick={() => handleBan(breed)}>
                {breed} ❌
              </span>
            ))}
          </>
        ) : (
          <p>No banned breeds yet</p>
        )}
      </div>
    </div>
  );
}

export default App;
