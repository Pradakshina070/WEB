import  {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import "./App.css";

/* =========================
   RESTAURANT DATA
========================= */

const restaurantData = [
  {
    id: 1,
    name: "Anjappar",
    location: "Coimbatore",
    cuisine: "South Indian",
    rating: 4.5,
    tables: [
      { id: 1, seats: 2 },
      { id: 2, seats: 4 },
      { id: 3, seats: 6 },
    ],
  },
  {
    id: 2,
    name: "Junior Kuppanna",
    location: "Coimbatore",
    cuisine: "Indian",
    rating: 4.2,
    tables: [
      { id: 1, seats: 2 },
      { id: 2, seats: 4 },
      { id: 3, seats: 8 },
    ],
  },
  {
    id: 3,
    name: "Barbeque Nation",
    location: "Chennai",
    cuisine: "Barbeque",
    rating: 4.6,
    tables: [
      { id: 1, seats: 4 },
      { id: 2, seats: 6 },
      { id: 3, seats: 8 },
    ],
  },
];

/* =========================
   CUSTOM HOOK - RESTAURANTS
========================= */

function useRestaurants() {
  const [location, setLocation] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [rating, setRating] = useState(0);

  const filteredRestaurants = useMemo(() => {
    return restaurantData.filter((restaurant) => {
      const locationMatch = restaurant.location
        .toLowerCase()
        .includes(location.toLowerCase());

      const cuisineMatch = restaurant.cuisine
        .toLowerCase()
        .includes(cuisine.toLowerCase());

      const ratingMatch = restaurant.rating >= rating;

      return locationMatch && cuisineMatch && ratingMatch;
    });
  }, [location, cuisine, rating]);

  return {
    restaurants: filteredRestaurants,
    location,
    cuisine,
    rating,
    setLocation,
    setCuisine,
    setRating,
  };
}

/* =========================
   CUSTOM HOOK - RESERVATION
========================= */

function useReservation() {
  const [restaurant, setRestaurant] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [table, setTable] = useState(null);
  const [specialRequest, setSpecialRequest] = useState("");
  const [dietary, setDietary] = useState("");

  const selectRestaurant = useCallback((item) => {
    setRestaurant(item);
    setDate("");
    setTime("");
    setTable(null);
  }, []);

  const updateDate = useCallback((value) => {
    setDate(value);
    setTime("");
    setTable(null);
  }, []);

  const updateTime = useCallback((value) => {
    setTime(value);
    setTable(null);
  }, []);

  const updateGuests = useCallback((value) => {
    setGuests(Number(value));
    setTable(null);
  }, []);

  const selectTable = useCallback((item) => {
    setTable(item);
  }, []);

  const clearReservation = useCallback(() => {
    setRestaurant(null);
    setDate("");
    setTime("");
    setGuests(1);
    setTable(null);
    setSpecialRequest("");
    setDietary("");
  }, []);

  return {
    restaurant,
    date,
    time,
    guests,
    table,
    specialRequest,
    dietary,
    selectRestaurant,
    updateDate,
    updateTime,
    updateGuests,
    selectTable,
    setSpecialRequest,
    setDietary,
    clearReservation,
  };
}

/* =========================
   CONTEXT API
========================= */

const ReservationContext = createContext(null);

function ReservationProvider({ children }) {
  const reservation = useReservation();

  return (
    <ReservationContext.Provider value={reservation}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservationContext() {
  return useContext(ReservationContext);
}

/* =========================
   HEADER
========================= */

function Header() {
  return (
    <header>
      <h2>Restaurant Reservation System</h2>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/summary">Summary</Link>
        <Link to="/booking">My Booking</Link>
      </nav>
    </header>
  );
}

/* =========================
   HOME
========================= */

function Home() {
  return (
    <div className="container">
      <h1>Restaurant Reservation System</h1>

      <p>
        Search restaurants and reserve your table easily.
      </p>

      <Link to="/restaurants">
        <button>Search Restaurants</button>
      </Link>

      <br />
      <br />

      <Link to="/booking">
        <button>View My Booking</button>
      </Link>
    </div>
  );
}

/* =========================
   RESTAURANT LIST
========================= */

function RestaurantList() {
  const {
    restaurants,
    location,
    cuisine,
    rating,
    setLocation,
    setCuisine,
    setRating,
  } = useRestaurants();

  const { selectRestaurant } =
    useReservationContext();

  return (
    <div className="container">
      <h2>Search Restaurants</h2>

      <input
        type="text"
        placeholder="Search by location"
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
      />

      <input
        type="text"
        placeholder="Search by cuisine"
        value={cuisine}
        onChange={(e) =>
          setCuisine(e.target.value)
        }
      />

      <select
        value={rating}
        onChange={(e) =>
          setRating(Number(e.target.value))
        }
      >
        <option value="0">
          All Ratings
        </option>

        <option value="4">
          4+ Rating
        </option>

        <option value="4.5">
          4.5+ Rating
        </option>
      </select>

      <h3>
        Available Restaurants
      </h3>

      {restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        restaurants.map((restaurant) => (
          <div
            className="card"
            key={restaurant.id}
          >
            <h3>{restaurant.name}</h3>

            <p>
              Location: {restaurant.location}
            </p>

            <p>
              Cuisine: {restaurant.cuisine}
            </p>

            <p>
              Rating: {restaurant.rating}
            </p>

            <Link to="/restaurant">
              <button
                onClick={() =>
                  selectRestaurant(
                    restaurant
                  )
                }
              >
                View Details
              </button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

/* =========================
   RESTAURANT DETAIL
========================= */

function RestaurantDetail() {
  const {
    restaurant,
    date,
    time,
    updateDate,
    updateTime,
  } = useReservationContext();

  const navigate = useNavigate();

  const timeSlots = [
    "12:00 PM",
    "1:00 PM",
    "7:00 PM",
    "8:00 PM",
  ];

  if (!restaurant) {
    return (
      <div className="container">
        <h2>No Restaurant Selected</h2>

        <Link to="/restaurants">
          <button>
            Select Restaurant
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>{restaurant.name}</h2>

      <p>
        Location: {restaurant.location}
      </p>

      <p>
        Cuisine: {restaurant.cuisine}
      </p>

      <p>
        Rating: {restaurant.rating}
      </p>

      <label>
        Select Date:
      </label>

      <br />

      <input
        type="date"
        value={date}
        onChange={(e) =>
          updateDate(e.target.value)
        }
      />

      {date && (
        <>
          <h3>Select Time</h3>

          <select
            value={time}
            onChange={(e) =>
              updateTime(e.target.value)
            }
          >
            <option value="">
              Select Time
            </option>

            {timeSlots.map((slot) => (
              <option
                key={slot}
                value={slot}
              >
                {slot}
              </option>
            ))}
          </select>
        </>
      )}

      <br />
      <br />

      <button
        disabled={!date || !time}
        onClick={() =>
          navigate("/tables")
        }
      >
        Choose Table
      </button>
    </div>
  );
}

/* =========================
   TABLE SELECTION
========================= */

function TableSelection() {
  const {
    restaurant,
    guests,
    table,
    updateGuests,
    selectTable,
  } = useReservationContext();

  const navigate = useNavigate();

  const availableTables = useMemo(() => {
    if (!restaurant) {
      return [];
    }

    return restaurant.tables.filter(
      (item) =>
        item.seats >= guests
    );
  }, [restaurant, guests]);

  const handleTableSelection =
    useCallback(
      (selectedTable) => {
        selectTable(selectedTable);
      },
      [selectTable]
    );

  if (!restaurant) {
    return (
      <div className="container">
        <h2>
          Please select a restaurant
        </h2>

        <Link to="/restaurants">
          <button>
            Restaurants
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Select Table</h2>

      <p>
        Restaurant:{" "}
        <b>{restaurant.name}</b>
      </p>

      <label>
        Number of Guests:
      </label>

      <input
        type="number"
        min="1"
        value={guests}
        onChange={(e) =>
          updateGuests(e.target.value)
        }
      />

      <h3>
        Available Tables
      </h3>

      {availableTables.length === 0 ? (
        <p>
          No table available for{" "}
          {guests} guests.
        </p>
      ) : (
        availableTables.map((item) => (
          <div
            className="table"
            key={item.id}
          >
            <span>
              Table {item.id} -{" "}
              {item.seats} Seats
            </span>

            <button
              onClick={() =>
                handleTableSelection(
                  item
                )
              }
            >
              {table?.id === item.id
                ? "Selected"
                : "Select"}
            </button>
          </div>
        ))
      )}

      <br />

      <button
        disabled={!table}
        onClick={() =>
          navigate("/summary")
        }
      >
        Continue
      </button>
    </div>
  );
}

/* =========================
   RESERVATION SUMMARY
========================= */

function ReservationSummary() {
  const {
    restaurant,
    date,
    time,
    guests,
    table,
    specialRequest,
    dietary,
    setSpecialRequest,
    setDietary,
  } = useReservationContext();

  const navigate = useNavigate();

  const reservationDetails = useMemo(() => {
    if (
      !restaurant ||
      !date ||
      !time ||
      !table
    ) {
      return null;
    }

    return {
      restaurant: restaurant.name,
      date: date,
      time: time,
      guests: guests,
      table: table.id,
      capacity: table.seats,
      specialRequest:
        specialRequest,
      dietary: dietary,
    };
  }, [
    restaurant,
    date,
    time,
    guests,
    table,
    specialRequest,
    dietary,
  ]);

  const confirmReservation =
    () => {
      if (!reservationDetails) {
        return;
      }

      /* SAVE CONFIRMED BOOKING */
      localStorage.setItem(
        "confirmedBooking",
        JSON.stringify(
          reservationDetails
        )
      );

      navigate("/confirmation");
    };

  if (!reservationDetails) {
    return (
      <div className="container">
        <h2>
          Reservation Summary
        </h2>

        <p>
          Please complete your
          reservation first.
        </p>

        <Link to="/restaurants">
          <button>
            Go to Restaurants
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>
        Reservation Summary
      </h2>

      <div className="summary">
        <p>
          Restaurant:{" "}
          <b>
            {reservationDetails.restaurant}
          </b>
        </p>

        <p>
          Date:{" "}
          <b>
            {reservationDetails.date}
          </b>
        </p>

        <p>
          Time:{" "}
          <b>
            {reservationDetails.time}
          </b>
        </p>

        <p>
          Guests:{" "}
          <b>
            {reservationDetails.guests}
          </b>
        </p>

        <p>
          Table:{" "}
          <b>
            {reservationDetails.table}
          </b>
        </p>

        <p>
          Capacity:{" "}
          <b>
            {reservationDetails.capacity}
          </b>
        </p>
      </div>

      <input
        type="text"
        placeholder="Special Request"
        value={specialRequest}
        onChange={(e) =>
          setSpecialRequest(
            e.target.value
          )
        }
      />

      <input
        type="text"
        placeholder="Dietary Preference"
        value={dietary}
        onChange={(e) =>
          setDietary(e.target.value)
        }
      />

      <br />
      <br />

      <button
        onClick={confirmReservation}
      >
        Confirm Reservation
      </button>
    </div>
  );
}

/* =========================
   CONFIRMATION
========================= */

function Confirmation() {
  const [booking, setBooking] =
    useState(null);

  useEffect(() => {
    const savedBooking =
      localStorage.getItem(
        "confirmedBooking"
      );

    if (savedBooking) {
      setBooking(
        JSON.parse(savedBooking)
      );
    }
  }, []);

  if (!booking) {
    return (
      <div className="container">
        <h2>
          No Booking Found
        </h2>

        <Link to="/restaurants">
          <button>
            Make Reservation
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>
        Reservation Confirmed!
      </h2>

      <div className="summary">
        <p>
          Restaurant:{" "}
          <b>{booking.restaurant}</b>
        </p>

        <p>
          Date: <b>{booking.date}</b>
        </p>

        <p>
          Time: <b>{booking.time}</b>
        </p>

        <p>
          Guests: <b>{booking.guests}</b>
        </p>

        <p>
          Table: <b>{booking.table}</b>
        </p>

        <p>
          Capacity:{" "}
          <b>{booking.capacity}</b>
        </p>

        {booking.specialRequest && (
          <p>
            Special Request:{" "}
            <b>
              {booking.specialRequest}
            </b>
          </p>
        )}

        {booking.dietary && (
          <p>
            Dietary Preference:{" "}
            <b>{booking.dietary}</b>
          </p>
        )}
      </div>

      <Link to="/booking">
        <button>
          View My Booking
        </button>
      </Link>

      <br />
      <br />

      <Link to="/">
        <button>
          Home
        </button>
      </Link>
    </div>
  );
}

/* =========================
   MY BOOKING
========================= */

function MyBooking() {
  const [booking, setBooking] =
    useState(null);

  useEffect(() => {
    const savedBooking =
      localStorage.getItem(
        "confirmedBooking"
      );

    if (savedBooking) {
      setBooking(
        JSON.parse(savedBooking)
      );
    }
  }, []);

  const cancelBooking = () => {
    localStorage.removeItem(
      "confirmedBooking"
    );

    setBooking(null);
  };

  return (
    <div className="container">
      <h2>My Booking</h2>

      {booking ? (
        <div className="summary">
          <h3>
            Your Booking Details
          </h3>

          <p>
            Restaurant:{" "}
            <b>{booking.restaurant}</b>
          </p>

          <p>
            Date:{" "}
            <b>{booking.date}</b>
          </p>

          <p>
            Time:{" "}
            <b>{booking.time}</b>
          </p>

          <p>
            Guests:{" "}
            <b>{booking.guests}</b>
          </p>

          <p>
            Table:{" "}
            <b>{booking.table}</b>
          </p>

          <p>
            Capacity:{" "}
            <b>{booking.capacity}</b>
          </p>

          {booking.specialRequest && (
            <p>
              Special Request:{" "}
              <b>
                {booking.specialRequest}
              </b>
            </p>
          )}

          {booking.dietary && (
            <p>
              Dietary Preference:{" "}
              <b>{booking.dietary}</b>
            </p>
          )}

          <button
            onClick={cancelBooking}
          >
            Cancel Booking
          </button>
        </div>
      ) : (
        <p>
          No booking found.
        </p>
      )}

      <br />

      <Link to="/">
        <button>
          Home
        </button>
      </Link>
    </div>
  );
}

/* =========================
   APP
========================= */

function App() {
  return (
    <BrowserRouter>
      <ReservationProvider>
        <Header />

        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/restaurants"
            element={
              <RestaurantList />
            }
          />

          <Route
            path="/restaurant"
            element={
              <RestaurantDetail />
            }
          />

          <Route
            path="/tables"
            element={
              <TableSelection />
            }
          />

          <Route
            path="/summary"
            element={
              <ReservationSummary />
            }
          />

          <Route
            path="/confirmation"
            element={
              <Confirmation />
            }
          />

          <Route
            path="/booking"
            element={
              <MyBooking />
            }
          />
        </Routes>
      </ReservationProvider>
    </BrowserRouter>
  );
}

export default App;