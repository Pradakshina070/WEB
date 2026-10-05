import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [tables, setTables] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );

        const data = res.data.map((r, i) => ({
          id: r.id,
          name: r.name,
          location: i % 2 ? "Coimbatore" : "Chennai",
          cuisine: i % 2 ? "Indian" : "Chinese"
        }));

        setRestaurants(data);
        setTables(["Table 1", "Table 2", "Table 3"]);
        setSlots(["7:00 PM", "8:00 PM", "9:00 PM"]);
      } catch {
        setError("Failed to fetch restaurant data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) &&
      (!location || r.location === location) &&
      (!cuisine || r.cuisine === cuisine)
  );

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>{error}</h3>;

  return (
    <div>
      <h2>Restaurant Table Reservation</h2>

      <input
        placeholder="Search restaurant"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setLocation(e.target.value)}>
        <option value="">All Locations</option>
        <option>Coimbatore</option>
        <option>Chennai</option>
      </select>

      <select onChange={(e) => setCuisine(e.target.value)}>
        <option value="">All Cuisines</option>
        <option>Indian</option>
        <option>Chinese</option>
      </select>

      {filtered.map((r) => (
        <div key={r.id}>
          <h3>{r.name}</h3>
          <p>{r.location} | {r.cuisine}</p>
        </div>
      ))}

      <h3>Available Tables</h3>
      {tables.map((t) => <p key={t}>{t}</p>)}

      <h3>Available Time Slots</h3>
      {slots.map((s) => <p key={s}>{s}</p>)}
    </div>
  );
}

export default App;