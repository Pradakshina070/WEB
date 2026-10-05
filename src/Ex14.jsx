import { useState } from "react";
import "./App.css";
function Home({ setPage }) {
  return (
    <>
      <section className="hero">
        <h1>Find Your Perfect Hotel</h1>
        <p>Book comfortable and affordable hotels easily.</p>
        <button onClick={() => setPage("search")}>
          Search Hotels
        </button>
      </section>
      <section className="features">
        <div className="feature-card">
          <h2>🏨 Best Hotels</h2>
          <p>Choose from many comfortable hotels.</p>
        </div>
        <div className="feature-card">
          <h2>💰 Best Prices</h2>
          <p>Affordable rooms for everyone.</p>
        </div>
        <div className="feature-card">
          <h2>🔒 Easy Booking</h2>
          <p>Simple and secure reservation.</p>
        </div>
      </section>
    </>
  );
}
// SEARCH HOTELS
function SearchHotels({ onSelectRoom }) {
  const rooms = [
    {
      id: 1,
      hotel: "Grand Palace",
      type: "Deluxe Room",
      price: 2500
    },
    {
      id: 2,
      hotel: "Royal Stay",
      type: "Premium Room",
      price: 3500
    },
    {
      id: 3,
      hotel: "City Comfort",
      type: "Standard Room",
      price: 1800
    }
  ];
  return (
    <div className="page">
      <h1>Available Hotels</h1>
      <div className="rooms">
        {rooms.map((room) => (
          <div className="room-card" key={room.id}>
            <h2>🏨 {room.hotel}</h2>
            <h3>{room.type}</h3>
            <p>Comfortable room with modern facilities.</p>
            <p className="price">₹{room.price} / night</p>
            <button onClick={() => onSelectRoom(room)}>Select Room</button>
          </div>
        ))}
      </div>
    </div>
  );
}
// ROOM RESERVATION
function RoomReservation({ room, onContinue }) {
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end <= start) {
      alert("Check-out date must be after check-in date.");
      return;
    }
    const days = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );
    const total = room.price * days;
    onContinue({
      room,
      guests,
      checkIn,
      checkOut,
      days,
      total
    });
  };
  return (
    <div className="form-container">
      <h1>Room Reservation</h1>
      <div className="selected-room">
        <h2>🏨 {room.hotel}</h2>
        <p><b>Room:</b> {room.type}</p>
        <p><b>Price:</b> ₹{room.price} / night</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Number of Guests</label>
        <input
          type="number" min="1" max="5" value={guests}
          onChange={(e) => setGuests(e.target.value)}required/>
        <label>Check-in Date</label>
        <input
          type="date" value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)} required/>
        <label>Check-out Date</label>
        <input type="date" value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)} required/>
        <button type="submit"> Continue Booking</button>
      </form>
    </div>
  );
}
// CUSTOMER RESERVATION FORM
function ReservationForm({ reservation, onConfirm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("UPI");
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      ...reservation,
      name,
      email,
      phone,
      payment
    });
  };
  return (
    <div className="form-container">
      <h1>Customer Details</h1>
      <div className="booking-preview">
        <h3>Booking Details</h3>
        <p> <b>Hotel:</b> {reservation.room.hotel}</p>
        <p><b>Room:</b> {reservation.room.type}</p>
        <p><b>Guests:</b> {reservation.guests}</p>
        <p><b>Stay:</b> {reservation.days} day(s)</p>
        <p><b>Total:</b> ₹{reservation.total}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Customer Name</label>
        <input
          type="text" placeholder="Enter your name" value={name}
          onChange={(e) => setName(e.target.value)} required/>
        <label>Email Address</label>
        <input type="email" placeholder="Enter your email" value={email}
          onChange={(e) => setEmail(e.target.value)}required/>
        <label>Contact Number</label>
        <input type="tel" placeholder="Enter your phone number" value={phone}
          onChange={(e) => setPhone(e.target.value)}required/>
        <label>Payment Method</label>
        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}>
          <option value="UPI">UPI</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Cash">Cash</option>
        </select>
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
}
// BOOKING SUMMARY
function BookingSummary({ booking }) {
  return (
    <div className="summary">
      <div className="success-icon">✓</div>
      <h1>Booking Confirmed!</h1>
      <p className="success-text">Your room has been successfully reserved.</p>
      <div className="summary-details">
        <p><b>Customer Name:</b> {booking.name}</p>
        <p><b>Email:</b> {booking.email}</p>
        <p><b>Phone:</b> {booking.phone}</p>
        <hr />
        <p><b>Room Type:</b> {booking.room.type} </p>
        <p><b>Check-in:</b> {booking.checkIn}</p>
        <p><b>Check-out:</b> {booking.checkOut}</p>
        <p><b>Number of Guests:</b> {booking.guests}</p>
        <p><b>Total Stay:</b> {booking.days} day(s)</p>
        <p><b>Payment Method:</b> {booking.payment}</p>
        <hr />
        <h2>Total Cost: ₹{booking.total}</h2>
      </div> <p className="success-text">
        Thank you for booking with StayEasy!
      </p>
    </div>
  );
}
// MAIN APP
function App() {
  const [page, setPage] = useState("home");
  const [selectedRoom, setSelectedRoom] =
    useState(null);
  const [reservation, setReservation] =
    useState(null);
  const [booking, setBooking] =
    useState(null);
  // Select room
  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setPage("reservation");
  };
  // Continue reservation
  const handleReservation = (data) => {
    setReservation(data);
    setPage("customer");
  };
  // Confirm booking
  const handleConfirm = (data) => {
    setBooking(data);
    setPage("summary");
  };
  return (
    <div className="app">
      {/* HEADER */}
      <header>"
        <div className="logo">
          🏨 <span>StayEasy</span>
        </div>
        <nav>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("about")}>bout </button>
          <button onClick={() => setPage("search")}>Search</button>
        </nav>
      </header>
      {/* CONTENT */}
      <main>
        {page === "home" && (
          <Home setPage={setPage} />
        )}
        {page === "about" && (
          <div className="page about">
            <h1>About StayEasy</h1>
            <p>
              StayEasy is a simple hotel booking
              application that helps users find
              comfortable and affordable hotels.
            </p>
            <p>
              Users can select rooms, enter their
              personal details, choose a payment
              method and confirm their reservation.
            </p>
          </div>
        )}
        {page === "search" && (
          <SearchHotels
            onSelectRoom={handleSelectRoom}/>
        )}
        {page === "reservation" &&
          selectedRoom && (
            <RoomReservation
              room={selectedRoom}
              onContinue={handleReservation}/>
          )}
        {page === "customer" &&
          reservation && (
            <ReservationForm
              reservation={reservation}
              onConfirm={handleConfirm}/>
          )}
        {page === "summary" &&
          booking && (
            <BookingSummary
              booking={booking}/>
          )}
      </main>
      {/* FOOTER */}
      <footer>© 2026 StayEasy Hotel Booking</footer>
    </div>
  );
}
export default App;