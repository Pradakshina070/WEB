import { useState } from "react";
const hotels = [
  {id: 1,
    name: "Grand Palace",
    location: "Chennai",
    price: 2500,
    stars: 5,
    amenities: ["WiFi", "Pool"],
    rooms: ["Single", "Double", "Deluxe"],
  },{id: 2,
    name: "Royal Residency",
    location: "Coimbatore",
    price: 1800,
    stars: 4,
    amenities: ["WiFi", "Parking"],
    rooms: ["Single", "Double"],
  },{ id:3,
    name: "Green Valley",
    location: "Ooty",
    price: 3000,
    stars: 5,
    amenities: ["WiFi", "Pool", "Parking"],
    rooms: ["Deluxe", "Suite"],
  },
];
function Hotel({ hotel, selectRoom }) {
  return (
    <div className="card">
      <h2>🏨 {hotel.name}</h2>
      <p>📍 {hotel.location}</p>
      <p>⭐ {hotel.stars} Star</p>
      <p>💰 ₹{hotel.price} / night</p>
      <p><b>Amenities:</b> {hotel.amenities.join(", ")}</p>
      <h4>Select Room</h4>
      {hotel.rooms.length > 0 ? (hotel.rooms.map((room) => (
          <button key={room} onClick={() => selectRoom(hotel, room)}>{room}</button>
        ))
      ) : (<p>No rooms available for selected dates</p>)}
    </div>
  );
}function App() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [price, setPrice] = useState(5000);
  const [stars, setStars] = useState("All");
  const [amenity, setAmenity] = useState("All");
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(null);
  const filteredHotels = hotels.filter((hotel) => {
    const locationOK =hotel.location .toLowerCase().includes(location.toLowerCase());
    const priceOK = hotel.price <= price;
    const starOK =stars === "All" || hotel.stars >= Number(stars);
    const amenityOK =amenity === "All" ||hotel.amenities.includes(amenity);
    return locationOK && priceOK && starOK && amenityOK;
  });
  const selectRoom = (hotel, room) => {
    setSelected({ hotel: hotel,room: room,
    });
  };return (<>
      <style>{`
        body {
          margin: 0;
          font-family: Arial;
          background: #f4f6f8;
        }header {
          background: #1976d2;
          color: white;
          padding: 20px;
          text-align: center;
        }.logo {
          color: #ffeb3b;
        }.container {
          width: 90%;
          max-width: 1000px;
          margin: 30px auto;
        }.search {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 25px;
        }input,
        select {
          padding: 10px;
          margin: 5px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }button {
          padding: 10px 15px;
          margin: 5px;
          border: none;
          border-radius: 5px;
          background: #1976d2;
          color: white;
          cursor: pointer;
        }button:hover {
          background: #125aa0;
        }.cards {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }.card {
          background: white;
          padding: 20px;
          width: 270px;
          border-radius: 10px;
          box-shadow: 0 2px 8px #ccc;
        }.selected {
          background: #e8f5e9;
          padding: 20px;
          margin-top: 25px;
          border-radius: 10px;
        }.message {
          background: white;
          padding: 25px;
          text-align: center;
          border-radius: 10px;
        }footer {
          margin-top: 50px;
          padding: 20px;
          background: #222;
          color: white;
          text-align: center;
        }@media(max-width: 600px) {
          .cards {
            flex-direction: column;
          }.card {
            width: auto;
          }input,select {
            width: 90%;
          }
        }
      `}</style>
      <header>
        <h1 className="logo">🏨 StayEasy</h1>
        <p>Hotel Search and Room Selection</p>
      </header>
      <div className="container">
        <div className="search">
          <h2>Search Hotels</h2>
          <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value) }/>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}/>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value) }/>
          <button onClick={() => setSearched(true)}> Search</button><hr />
          <h3>Filters</h3>
          <select value={price} onChange={(e) =>setPrice(Number(e.target.value))
            }>
            <option value="5000">Any Price</option>
            <option value="1500">Below ₹1500</option>
            <option value="2000">Below ₹2000</option>
            <option value="2500">Below ₹2500</option>
            <option value="3000">Below ₹3000</option>
          </select>
          <select value ={stars} onChange={(e) =>setStars(e.target.value) }>
            <option value="All">All Stars</option>
            <option value="5">5 Star</option>
            <option value="4">4 Star & Above</option>
            <option value="3">3 Star & Above</option>
          </select>
          <select value={amenity} onChange={(e) => setAmenity(e.target.value)}>
            <option value="All">All Amenities</option>
            <option value="WiFi">WiFi</option>
            <option value="Pool">Pool</option>
            <option value="Parking">Parking</option>
          </select>
        </div>
        {!searched ? (
          <div className="message">
            <h3>Search for hotels</h3>
            <p>Enter location and travel dates,then click Search.</p>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="message">
            <h3>No hotels available</h3>
            <p>Try another location or filter.</p>
          </div>) : (
          <div className="cards">
            {filteredHotels.map((hotel) => (<Hotel key={hotel.id} hotel={hotel} selectRoom={selectRoom}/>
            ))}</div>
        )}
        {selected && (
          <div className="selected">
            <h2>Selected Room</h2>
            <p> <b>Hotel:</b>{" "} {selected.hotel.name }</p>
            <p><b>Location:</b>{" "}{selected.hotel.location}</p>
            <p><b>Room:</b>{" "}{selected.room}</p>
           <p><b>Price:</b>{" "}₹{selected.hotel.price} / night</p>
            <button onClick={() => alert("Room Selected Successfully!")}>Confirm Room</button>
          </div>
        )}
      </div>
      <footer>© 2026 StayEasy Hotel Booking</footer>
    </>
  );
}
export default App;