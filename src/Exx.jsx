import React, { useState, useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
  Outlet
} from "react-router-dom";

/* ================= AUTH CONTEXT ================= */

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("loggedUser")) || null
  );

  const signup = (email, password) => {
    const accounts =
      JSON.parse(localStorage.getItem("accounts")) || [];

    const exists = accounts.some(
      (account) => account.email === email
    );

    if (exists) {
      throw new Error("Account already exists. Please login.");
    }

    accounts.push({ email, password });
    localStorage.setItem("accounts", JSON.stringify(accounts));
  };

  const login = (email, password) => {
    const accounts =
      JSON.parse(localStorage.getItem("accounts")) || [];

    const account = accounts.find(
      (a) => a.email === email && a.password === password
    );

    if (!account) {
      throw new Error("Invalid email or password.");
    }

    setUser(account);
    localStorage.setItem("loggedUser", JSON.stringify(account));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedUser");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ================= ERROR BOUNDARY ================= */

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <h2 style={{ padding: "30px" }}>
          Something went wrong. Please try again.
        </h2>
      );
    }

    return this.props.children;
  }
}

/* ================= REUSABLE COMPONENTS ================= */

function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

function Input(props) {
  return <input {...props} />;
}

function DatePicker(props) {
  return <input type="date" {...props} />;
}

function Loading() {
  return <p>Loading...</p>;
}

function RestaurantCard({ restaurant }) {
  return (
    <div>
      <h3>{restaurant.name}</h3>
      <p>Location: {restaurant.location}</p>
      <p>Cuisine: {restaurant.cuisine}</p>
      <p>Rating: {restaurant.rating}</p>

      <Link to={`/restaurant/${restaurant.id}`}>
        View Details
      </Link>
    </div>
  );
}

function TableCard({ table, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        margin: "5px",
        padding: "10px",
        border: selected ? "3px solid green" : "1px solid black"
      }}
    >
      {table}
    </button>
  );
}

/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}

/* ================= LOGIN + SIGNUP ================= */

function Login() {
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return (
      password.length > 8 &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be more than 8 characters and contain a special character."
      );
      return;
    }

    try {
      if (isSignup) {
        signup(email, password);

        setSuccess(
          "Account created successfully. Please login."
        );

        setIsSignup(false);
        setPassword("");
      } else {
        login(email, password);

        const destination =
          location.state?.from || "/";

        navigate(destination);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>{isSignup ? "Create Account" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <Button type="submit">
          {isSignup ? "Sign Up" : "Login"}
        </Button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {success && (
        <p style={{ color: "green" }}>{success}</p>
      )}

      <br />

      <Button
        onClick={() => {
          setIsSignup(!isSignup);
          setError("");
          setSuccess("");
        }}
      >
        {isSignup
          ? "Already have an account? Login"
          : "New user? Sign Up"}
      </Button>
    </div>
  );
}

/* ================= HOME ================= */

function Home() {
  return (
    <div>
      <h1>Restaurant Reservation System</h1>
      <p>Welcome to the restaurant reservation application.</p>

      <Link to="/restaurants">
        Search Restaurants
      </Link>
    </div>
  );
}

/* ================= RESTAURANTS ================= */

const restaurants = [
  {
    id: 101,
    name: "Spice Garden",
    location: "Coimbatore",
    cuisine: "Indian",
    rating: 4.5,
    hours: "10 AM - 10 PM"
  },
  {
    id: 102,
    name: "Food Palace",
    location: "Coimbatore",
    cuisine: "Chinese",
    rating: 4.2,
    hours: "11 AM - 11 PM"
  },
  {
    id: 103,
    name: "Royal Treat",
    location: "Coimbatore",
    cuisine: "Multi Cuisine",
    rating: 4.7,
    hours: "10 AM - 11 PM"
  }
];

function Restaurants() {
  return (
    <div>
      <h2>Restaurant Search</h2>

      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
        />
      ))}
    </div>
  );
}

/* ================= RESTAURANT DETAILS ================= */

function RestaurantDetails() {
  const { id } = useParams();

  const restaurant = restaurants.find(
    (r) => r.id === Number(id)
  );

  if (!restaurant) {
    return <h2>Restaurant not found</h2>;
  }

  return (
    <div>
      <h2>{restaurant.name}</h2>

      <p>Location: {restaurant.location}</p>
      <p>Cuisine: {restaurant.cuisine}</p>
      <p>Rating: {restaurant.rating}</p>
      <p>Opening Hours: {restaurant.hours}</p>

      <Link to="/reservation">
        Reserve Table
      </Link>
    </div>
  );
}

/* ================= RESERVATION ================= */

function Reservation() {
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTable, setSelectedTable] =
    useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequest, setSpecialRequest] =
    useState("");

  const navigate = useNavigate();

  /* TABLE SELECTION BASED ON GUEST COUNT */

  const getTables = (guests) => {
    if (guests >= 2 && guests <= 4) {
      return [
        "T1 - 4 Seats",
        "T2 - 4 Seats"
      ];
    }

    if (guests >= 5 && guests <= 6) {
      return [
        "T3 - 6 Seats",
        "T4 - 6 Seats"
      ];
    }

    if (guests >= 7 && guests <= 8) {
      return [
        "T5 - 8 Seats",
        "T6 - 8 Seats"
      ];
    }

    if (guests >= 9 && guests <= 10) {
      return [
        "T7 - 10 Seats",
        "T8 - 10 Seats"
      ];
    }

    return [];
  };

  const tables = getTables(guestCount);

  const handleGuestChange = (e) => {
    const count = Number(e.target.value);

    setGuestCount(count);

    // Clear old table when guest count changes
    setSelectedTable("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (guestCount < 2 || guestCount > 10) {
      alert("Guest count must be between 2 and 10.");
      return;
    }

    if (!date) {
      alert("Please select reservation date.");
      return;
    }

    if (!time) {
      alert("Please select reservation time.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number.");
      return;
    }

    if (!selectedTable) {
      alert("Please select a suitable table.");
      return;
    }

    if (!specialRequest.trim()) {
      alert("Please enter special request.");
      return;
    }

    navigate("/checkout", {
      state: {
        guestCount,
        selectedTable,
        date,
        time,
        phone,
        specialRequest
      }
    });
  };

  return (
    <div>
      <h2>Table Reservation</h2>

      <form onSubmit={handleSubmit}>

        <label>Guest Count:</label>

        <Input
          type="number"
          min="2"
          max="10"
          value={guestCount}
          onChange={handleGuestChange}
        />

        <p>
          Guests must be between 2 and 10.
        </p>

        <h3>Available Tables</h3>

        {tables.map((table) => (
          <TableCard
            key={table}
            table={table}
            selected={selectedTable === table}
            onClick={() => setSelectedTable(table)}
          />
        ))}

        <br /><br />

        <label>Reservation Date:</label>

        <DatePicker
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <br /><br />

        <label>Reservation Time:</label>

        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <br /><br />

        <label>Phone Number:</label>

        <Input
          type="tel"
          placeholder="10 digit phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <br /><br />

        <label>Special Request:</label>

        <br />

        <textarea
          value={specialRequest}
          onChange={(e) =>
            setSpecialRequest(e.target.value)
          }
          placeholder="Enter your request"
        />

        <br /><br />

        <Button type="submit">
          Continue
        </Button>
      </form>
    </div>
  );
}

/* ================= CHECKOUT ================= */

function Checkout() {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return <Navigate to="/reservation" />;
  }

  return (
    <div>
      <h2>Reservation Summary</h2>

      <p>Guests: {data.guestCount}</p>
      <p>Table: {data.selectedTable}</p>
      <p>Date: {data.date}</p>
      <p>Time: {data.time}</p>
      <p>Phone: {data.phone}</p>
      <p>Special Request: {data.specialRequest}</p>

      <Link to="/confirmation">
        Confirm Reservation
      </Link>
    </div>
  );
}

/* ================= CONFIRMATION ================= */

function Confirmation() {
  return (
    <div>
      <h2>Reservation Confirmed</h2>
      <p>Your table has been successfully reserved.</p>
    </div>
  );
}

/* ================= RESERVATIONS ================= */

function Reservations() {
  return (
    <div>
      <h2>My Reservations</h2>
      <p>Your reservations will appear here.</p>
    </div>
  );
}

/* ================= NAVIGATION ================= */

function Navigation() {
  const { user, logout } =
    useContext(AuthContext);

  return (
    <nav>
      <NavLink to="/">Home</NavLink>{" | "}

      <NavLink to="/restaurants">
        Restaurants
      </NavLink>{" | "}

      {user && (
        <>
          <NavLink to="/reservation">
            Reservation
          </NavLink>{" | "}

          <NavLink to="/reservations">
            My Reservations
          </NavLink>{" | "}

          <button onClick={logout}>
            Logout
          </button>
        </>
      )}

      {!user && (
        <NavLink to="/login">
          Login
        </NavLink>
      )}
    </nav>
  );
}

/* ================= APP ================= */

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>

          <Navigation />

          <hr />

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/restaurants"
              element={<Restaurants />}
            />

            <Route
              path="/restaurant/:id"
              element={<RestaurantDetails />}
            />

            <Route
              path="/reservation"
              element={
                <ProtectedRoute>
                  <Reservation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <Reservations />
                </ProtectedRoute>
              }
            />

            <Route
              path="/confirmation"
              element={
                <ProtectedRoute>
                  <Confirmation />
                </ProtectedRoute>
              }
            />

          </Routes>

        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;