import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {BrowserRouter,Routes,Route,Link, useNavigate,useParams}
from "react-router-dom";
import "./App.css";
const restaurantData = [
  {
    id: 1,
    name: "Spice Garden",
    location: "Coimbatore",
    cuisine: "Indian",
    rating: 4.5,
    tables: [
      { id: 1, seats: 2 },
      { id: 2, seats: 4 },
      { id: 3, seats: 6 }
    ]
  },
  {
    id: 2,
    name: "Italiano Cafe",
    location: "Chennai",
    cuisine: "Italian",
    rating: 4.3,
    tables: [
      { id: 4, seats: 2 },
      { id: 5, seats: 4 },
      { id: 6, seats: 8 }
    ]
  },
  {
    id: 3,
    name: "Dragon House",
    location: "Coimbatore",
    cuisine: "Chinese",
    rating: 4.6,
    tables: [
      { id: 7, seats: 2 },
      { id: 8, seats: 4 },
      { id: 9, seats: 6 }
    ]
  }
];
/
function Header() {
  return (
    <header>
      <h2>🍴 FoodBook</h2>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/restaurants">Restaurants</Link>
      </nav>
    </header>
  );
}
/* ---------- HOME ---------- */
function Home() {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  useEffect(() => {
    searchRef.current.focus();
  }, []);
  const searchRestaurant = () => {
    navigate("/restaurants?search=" + search);
  };
  return (
    <div className="page home">
      <h1>Find Your Perfect Restaurant</h1>
      <p>Search restaurants by location or cuisine</p>
      <div className="searchBox">
        <input ref={searchRef} type="text" placeholder="Enter location or cuisine" value={search}
          onChange={(e) => setSearch(e.target.value)}/>
        <button onClick={searchRestaurant}>Search</button>
      </div>
    </div>
  );
}
/* ---------- SEARCH BAR ---------- */
function SearchBar({ search, setSearch }) {
  return (
    <input className="search" type="text" placeholder="Search location or cuisine" value={search}
      onChange={(e) => setSearch(e.target.value)}/>
  );
}
/* ---------- FILTER PANEL ---------- */
function FilterPanel({ cuisine, setCuisine }) {
  return (
    <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
      <option value="">All Cuisines</option>
      <option value="Indian">Indian</option>
      <option value="Italian">Italian</option>
      <option value="Chinese">Chinese</option>
    </select>
  );
}
/* ---------- RESTAURANT CARD ---------- */
function RestaurantCard({ restaurant, selectRestaurant }) {
  return (
    <div className="card">
      <h2>{restaurant.name}</h2>

      <p>📍 {restaurant.location}</p>
      <p>🍴 {restaurant.cuisine}</p>
      <p>⭐ {restaurant.rating}</p>

      <button onClick={() => selectRestaurant(restaurant.id)}>
        View Details
      </button>
    </div>
  );
}
/* ---------- RESTAURANT LIST ---------- */
function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const navigate = useNavigate();
  /* useEffect - load restaurant data */
  useEffect(() => {
    setRestaurants(restaurantData);
  }, []);
  /* useMemo - filter restaurants */
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const text =
        restaurant.name +
        restaurant.location +
        restaurant.cuisine;
      const matchesSearch = text
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCuisine =
        cuisine === "" || restaurant.cuisine === cuisine;
      return matchesSearch && matchesCuisine;
    });
  }, [restaurants, search, cuisine]);
  /* useCallback */
  const selectRestaurant = useCallback(
    (id) => {
      navigate("/restaurant/" + id);
    },
    [navigate]
  );
  return (
    <div className="page">
      <h1>Restaurants</h1>
      <div className="filters">
        <SearchBar search={search} setSearch={setSearch}/>
        <FilterPanel cuisine={cuisine} setCuisine={setCuisine}/>
      </div>
      <div className="restaurantList">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              selectRestaurant={selectRestaurant}
            />
          ))
        ) : (
          <p>No restaurants found.</p>
        )}

      </div>
    </div>
  );
}
/* ---------- RESTAURANT DETAIL ---------- */
function RestaurantDetail() {
  const { id } = useParams();
  const restaurant = restaurantData.find(
    (r) => r.id === Number(id)
  );
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const selectRestaurant = useCallback(() => {
    navigate("/restaurant/" + id + "/table");
  }, [navigate, id]);
  if (!restaurant) {
    return <h2>Restaurant not found</h2>;
  }
  return (
    <div className="page">
      <h1>{restaurant.name}</h1>
      <p>📍 Location: {restaurant.location}</p>
      <p>🍴 Cuisine: {restaurant.cuisine}</p>
      <p>⭐ Rating: {restaurant.rating}</p>
      <h3>Select Date</h3>
      <input type="date" value={date}
        onChange={(e) => setDate(e.target.value)}/>
      <h3>Select Time</h3>
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}>
        <option value="">Select Time</option>
        <option>12:00 PM</option>
        <option>1:00 PM</option>
        <option>7:00 PM</option>
        <option>8:00 PM</option>
        <option>9:00 PM</option>
      </select>
      <h3>Number of Guests</h3>
      <input type="number" min="1" value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}/>
      <br /><br />
      <button onClick={selectRestaurant}>Select Table </button>
    </div>
  );
}
/* ---------- TABLE SELECTION ---------- */
function TableSelection() {
  const { id } = useParams();
  const restaurant = restaurantData.find(
    (r) => r.id === Number(id)
  );
  const navigate = useNavigate();
  const [guests, setGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState(null);
  /* useMemo - available tables */
  const availableTables = useMemo(() => {
    return restaurant.tables.filter(
      (table) => table.seats >= guests
    );
  }, [restaurant, guests]);
  /* useCallback */
  const selectTable = useCallback((table) => {
    setSelectedTable(table);
  }, []);
  const continueBooking = () => {
    if (!selectedTable) {
      alert("Please select a table");
      return;
    }
    navigate("/summary", {
      state: {
        restaurant,
        guests,
        selectedTable
      }
    });
  };
  return (
    <div className="page">
      <h1>Select Table</h1>
      <h3>Guests</h3>
      <input  type="number" min="1" value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}/>
      <div className="tables">
        {availableTables.map((table) => (
          <button
            key={table.id}
            className={
              selectedTable?.id === table.id
                ? "selectedTable"
                : "table"
            }
            onClick={() => selectTable(table)}>Table {table.id}
            <br /> {table.seats} Seats</button>
        ))}
      </div>
      <button onClick={continueBooking}>Continue</button>
    </div>
  );
}
/* ---------- RESERVATION SUMMARY ---------- */
function ReservationSummary() {
  const navigate = useNavigate();
  const location = window.history.state?.usr;
  const [request, setRequest] = useState("");
  const [diet, setDiet] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  if (!location) {
    return <h2>No reservation data</h2>;
  }
  const {restaurant,guests,selectedTable} = location;
  const confirmReservation = useCallback(() => {
    if (!name || !phone) {
      alert("Enter customer details");
      return;
    }
    navigate("/confirmation", {
      state: {restaurant,guests,selectedTable,name,phone,request,diet
      }
    });
  }, [
    navigate,
    restaurant,
    guests,
    selectedTable,
    name,
    phone,
    request,
    diet
  ]);
  return (
    <div className="page">
      <h1>Reservation Summary</h1>
      <h3>{restaurant.name}</h3>
      <p>Guests: {guests}</p>
      <p>Table: {selectedTable.id}</p>
      <p>Capacity: {selectedTable.seats} </p>
      <h3>Customer Details</h3>
      <input  placeholder="Your Name" value={name}
        onChange={(e) => setName(e.target.value)}/>
      <input placeholder="Phone Number" value={phone}
        onChange={(e) => setPhone(e.target.value)}/>
      <h3>Dietary Preference</h3>
      <select value={diet}
        onChange={(e) => setDiet(e.target.value)}>
        <option value="">None</option>
        <option>Vegetarian</option>
        <option>Vegan</option>
        <option>No Onion</option>
        <option>No Nuts</option>
      </select>
      <h3>Special Request</h3>
      <textarea placeholder="Any special request?"  value={request}
        onChange={(e) => setRequest(e.target.value)}/>
      <br />
      <button onClick={confirmReservation}>Confirm Reservation</button>
    </div>
  );
}
/* ---------- CONFIRMATION ---------- */
function Confirmation() {
  const location = window.history.state?.usr;
  if (!location) {
    return <h2>No booking found</h2>;
  }
  return (
    <div className="page confirmation">
      <h1>✅ Reservation Confirmed!</h1>
      <h2>{location.restaurant.name}</h2>
      <p>Customer: {location.name}</p>
      <p>Phone: {location.phone}</p>
      <p>Guests: {location.guests}</p>
      <p>Table: {location.selectedTable.id}</p>
      <p>Dietary Preference: {location.diet || "None"}</p>
      <p> Special Request: {location.request || "None"}</p>
      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}
/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer>
      <p>© 2026 FoodBook Restaurant Reservation</p>
    </footer>
  );
}
/* ---------- APP ---------- */
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Home />}/>
        <Route
          path="/restaurants"/>
        <Route
          path="/restaurant/:id"
          element={<RestaurantDetail />}/>
        <Route
          path="/restaurant/:id/table"
          element={<TableSelection />}/>
        <Route
          path="/summary"
          element={<ReservationSummary />} />
        <Route
          path="/confirmation"
          element={<Confirmation />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
export default App;