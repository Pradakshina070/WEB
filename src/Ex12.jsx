import { useState } from "react";
const hotels = [
  {
    id: 1,
    name: "Grand Palace Hotel",
    location: "Coimbatore",
    price: 2500,
    rating: 5,
  },
  {
    id: 2,
    name: "Royal Residency",
    location: "Chennai",
    price: 1800,
    rating: 4,
  },
  {
    id: 3,
    name: "Green Valley Resort",
    location: "Ooty",
    price: 3000,
    rating: 5,
  },
];
function App() {
  const [page, setPage] = useState("home");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [room, setRoom] = useState("");
  const searchHotels = hotels.filter((hotel) =>
    hotel.location.toLowerCase().includes(location.toLowerCase())
  );
  const selectHotel = (hotel) => {
    setSelectedHotel(hotel);
    setPage("register");
  };
  const submitBooking = (e) => {
    e.preventDefault();
    alert("Booking Confirmed Successfully!");
    setPage("home");
  };
  return (<>
      <style>{`
         {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f4f6f8;
          color: black;
        }
        header {
          background: purple;
          color: white;
          padding: 18px 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        header h1 {
          margin: 0;
          color:white;
          font-size:50px;
        }
        nav button {
          background: transparent;
          border: none;
          color: white;
          font-size: 16px;
          margin-left: 25px;
          cursor: pointer;
        }
        nav button:hover {
          text-decoration: underline;
        }
        .home {
          text-align: center;
          padding: 80px 20px;
        }
        .home h2 {
          font-size: 40px;
          color: purple;
        }
        .home p {
          font-size: 18px;
        }
        .main-button {
          background: purple;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
        }

        .main-button:hover {
          background: #125aa0;
        }

        .home-cards {
          display: flex;
          justify-content: center;
          gap: 25px;
          margin-top: 60px;
        }
        .home-cards div {
          background: white;
          padding: 25px;
          width: 250px;
          border-radius: 10px;
          box-shadow: 0 2px 8px #ccc;
        }
        .content {
          width: 90%;
          max-width: 1100px;
          margin: 40px auto;
          min-height: 500px;
        }
        .content h2 {
          color: #1976d2;
        }
        .search-box {
          background: white;
          padding: 25px;
          border-radius: 10px;
          margin: 20px 0;
          box-shadow: 0 2px 8px #ddd;
        }
        .search-box input {
          width: 70%;
          padding: 13px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-right: 10px;
        }
        .hotel-list {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
        }
        .hotel-card {
          background: white;
          width: 300px;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px #ccc;
        }
        .hotel-image {
          height: 120px;
          background: #e3f2fd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 55px;
          border-radius: 8px;
        }
        .hotel-card h3 {
          margin-bottom: 8px;
        }
        .selected-hotel {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          max-width: 600px;
        }
        .register-form {
          background: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 600px;
          box-shadow: 0 2px 8px #ccc;
        }
        .register-form label {
          display: block;
          margin-top: 15px;
          font-weight: bold;
        }

        .register-form input,
        .register-form select {
          width: 100%;
          padding: 12px;
          margin-top: 7px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .register-form button {
          margin-top: 25px;
        }

        footer {
          background: #222;
          color: white;
          text-align: center;
          padding: 20px;
        }

        @media (max-width: 700px) {
          header {
            flex-direction: column;
            gap: 15px;
            padding: 18px;
          }

          nav button {
            margin: 5px;
          }

          .home h2 {
            font-size: 30px;
          }

          .home-cards {
            flex-direction: column;
            align-items: center;
          }

          .home-cards div {
            width: 90%;
          }

          .hotel-card {
            width: 100%;
          }

          .search-box input {
            width: 100%;
            margin-bottom: 10px;
          }
        }
      `}</style>
      {/* NAVIGATION */}
      <header>
        <h1>🏨 StayEasy</h1>
        <nav>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("about")}>About</button>
          <button onClick={() => setPage("search")}>Search</button>
        </nav>
      </header>
      {/* HOME PAGE */}
      {page === "home" && (
        <section className="home">
          <h2>Find Your Perfect Hotel</h2>
          <p>Book comfortable and affordable hotels easily.</p>
          <button  className="main-button" onClick={() => setPage("search")}>Search Hotels</button>
          <div className="home-cards">
            <div>
              <h3>🏨 Best Hotels</h3>
              <p>Choose from many comfortable hotels.</p>
            </div>
            <div>
              <h3>💰 Best Prices</h3>
              <p>Affordable rooms for everyone.</p>
            </div>
            <div>
              <h3>🔒 Easy Booking</h3>
              <p>Simple and secure reservation.</p>
            </div>
          </div>
        </section>
      )}
      {page === "about" && (
        <section className="content">
          <h2>About StayEasy</h2>
          <p>StayEasy is a hotel room booking application.
            Users can search hotels, select rooms and
            register for their stay.</p>
          <p>This application is developed using React
            functional components, useState and event handling </p>
        </section>
      )}
      {page === "search" && (
        <section className="content">
          <h2>Search Hotels</h2>
          <div className="search-box">
            <input type="text" placeholder="Enter location e.g. Chennai" value={location} onChange={(e) => setLocation(e.target.value)} />
            <button className="main-button">Search</button>
          </div>
          <div className="hotel-list">
            {searchHotels.length === 0 ? (
              <p>No hotels available.</p>
            ) : (
              searchHotels.map((hotel) => (
                <div className="hotel-card" key={hotel.id}>
                  <div className="hotel-image">
                    🏨
                  </div>

                  <h3>{hotel.name}</h3>

                  <p>📍 {hotel.location}</p>

                  <p>⭐ {hotel.rating} Star</p>

                  <h3>₹{hotel.price} / night</h3>

                  <button
                    className="main-button"
                    onClick={() => selectHotel(hotel)}
                  >
                    Select Hotel
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* REGISTRATION PAGE */}
      {page === "register" && selectedHotel && (
        <section className="content">
          <h2>Hotel Registration</h2>

          <div className="selected-hotel">
            <h3>{selectedHotel.name}</h3>
            <p>📍 {selectedHotel.location}</p>
            <p>⭐ {selectedHotel.rating} Star</p>
            <p>₹{selectedHotel.price} / night</p>
          </div>

          <form
            className="register-form"
            onSubmit={submitBooking}
          >
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Phone Number</label>

            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label>Check-in Date</label>

            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />

            <label>Check-out Date</label>

            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
            <label>Number of Guests</label>
            <input
              type="number"
              min="1"
              placeholder="Enter number of guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              required
            />
            <label>Room Type</label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            >
              <option value="">Select Room</option>
              <option value="Single Room">Single Room</option>
              <option value="Double Room">Double Room</option>
              <option value="Deluxe Room">Deluxe Room</option>
              <option value="Suite Room">Suite Room</option>
            </select>
            <button
              type="submit"
              className="main-button"
            >
              Confirm Booking
            </button>
          </form>
        </section>
      )}
      <footer>
        <p>© 2026 StayEasy Hotel Booking</p>
      </footer>
    </>
  );}
export default App;