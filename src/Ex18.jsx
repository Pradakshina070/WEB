import  {createContext,useContext,useState ,Component} from "react";
import { Routes, Route, Link, Navigate, useNavigate, useLocation, useParams} from "react-router-dom";
import "./Ex18.css";
/* AUTH CONTEXT*/
const AuthContext = createContext();
function AuthProvider({ children }) {
  const [user, setUser] = useState( JSON.parse(localStorage.getItem("currentUser")) || null);
  const signup = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase() );
    if (exists) {
      return { success: false, message: "Account already exists. Please login."};}
    users.push({ email, password});
    localStorage.setItem("users", JSON.stringify(users));
    return {success: true,message: "Account created successfully."};};
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((u) =>  u.email.toLowerCase() === email.toLowerCase() &&  u.password === password );
    if (!foundUser) {
      return {success: false,message: "Invalid email or password."};}
    setUser(foundUser); localStorage.setItem("currentUser", JSON.stringify(foundUser))
    return { success: true};};
  const logout = () => { setUser(null); localStorage.removeItem("currentUser"); };
  return ( <AuthContext.Provider value={{user, signup, login,logout}}>   {children}
    </AuthContext.Provider> );}
function useAuth() {return useContext(AuthContext);}
/* PROTECTED ROUTE */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

/* =====================================================
   ERROR BOUNDARY
===================================================== */

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(error, info) {
    console.error("Application Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Something went wrong</h1>
          <p>
            We encountered an unexpected error while loading this page.
          </p>

          <Link to="/" className="btn">
            Return to Home
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function Button({ children, type = "button", onClick, disabled = false }) {
  return (
    <button
      type={type}
      className="btn"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false
}) {
  return (
    <div className="form-group">
      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function DatePicker({ value, onChange }) {
  return (
    <div className="form-group">
      <label>Reservation Date</label>

      <input
        type="date"
        value={value}
        min={new Date().toISOString().split("T")[0]}
        onChange={onChange}
        required
      />
    </div>
  );
}

function Loading() {
  return (
    <div className="loading">
      Loading...
    </div>
  );
}

/* =====================================================
   RESTAURANT DATA
===================================================== */

const restaurants = [
  {
    id: 1,
    name: "Royal Spice",
    cuisine: "Indian",
    location: "Coimbatore",
    rating: 4.7,
    description:
      "Premium Indian restaurant offering traditional and modern dishes."
  },
  {
    id: 2,
    name: "Urban Bites",
    cuisine: "Multi Cuisine",
    location: "Coimbatore",
    rating: 4.5,
    description:
      "Contemporary restaurant serving a wide variety of cuisines."
  },
  {
    id: 3,
    name: "Green Leaf",
    cuisine: "Vegetarian",
    location: "Coimbatore",
    rating: 4.6,
    description:
      "Family restaurant specializing in fresh vegetarian dishes."
  }
];

/* =====================================================
   TABLE DATA
===================================================== */

const tables = [
  {
    id: 1,
    name: "Table A1",
    capacity: 2
  },
  {
    id: 2,
    name: "Table A2",
    capacity: 4
  },
  {
    id: 3,
    name: "Table B1",
    capacity: 6
  },
  {
    id: 4,
    name: "Table B2",
    capacity: 8
  },
  {
    id: 5,
    name: "Table C1",
    capacity: 10
  }
];

/* =====================================================
   RESTAURANT CARD
===================================================== */

function RestaurantCard({ restaurant }) {
  return (
    <div className="card">
      <h3>{restaurant.name}</h3>

      <p>
        <strong>Cuisine:</strong> {restaurant.cuisine}
      </p>

      <p>
        <strong>Location:</strong> {restaurant.location}
      </p>

      <p>
        <strong>Rating:</strong> {restaurant.rating}/5
      </p>

      <Link
        to={`/restaurant/${restaurant.id}`}
        className="btn"
      >
        View Details
      </Link>
    </div>
  );
}

/* =====================================================
   TABLE CARD
===================================================== */

function TableCard({ table, selected, onSelect }) {
  return (
    <div
      className={`table-card ${
        selected ? "selected-table" : ""
      }`}
      onClick={() => onSelect(table)}
    >
      <h3>{table.name}</h3>

      <p>
        Capacity: <strong>{table.capacity} guests</strong>
      </p>

      <button className="table-btn">
        {selected ? "Selected" : "Select Table"}
      </button>
    </div>
  );
}

/* =====================================================
   NAVBAR
===================================================== */

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        DineReserve
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/restaurants">
          Restaurants
        </Link>

        {user && (
          <Link to="/reservations">
            My Reservations
          </Link>
        )}

        {user ? (
          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

/* =====================================================
   HOME
===================================================== */

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div>
          <h1>Welcome to DineReserve</h1>

          <p>
            Discover restaurants, select your table and
            reserve your dining experience easily.
          </p>

          <Link to="/restaurants" className="btn">
            Explore Restaurants
          </Link>
        </div>
      </section>
    </>
  );
}

/* =====================================================
   LOGIN / SIGNUP
===================================================== */

function Login() {
  const { user, login, signup } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

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
      setError("Email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be more than 8 characters and contain at least one special character."
      );
      return;
    }

    if (mode === "signup") {
      const result = signup(email, password);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(
        "Account created successfully. Please login."
      );

      setMode("login");
      setPassword("");

      return;
    }

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);

      /*
        Invalid login is returned to Home as requested.
      */
      setTimeout(() => {
        navigate("/");
      }, 1000);

      return;
    }

    /*
      If user originally requested a protected page,
      return to that page.
    */
    const requestedPage = location.state?.from;

    if (requestedPage) {
      navigate(requestedPage, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className="auth-card">
          <h2>
            {mode === "login"
              ? "Login"
              : "Create Account"}
          </h2>

          <p className="auth-subtitle">
            {mode === "login"
              ? "Login to continue your reservation."
              : "Create an account to reserve a table."}
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              placeholder="Minimum 9 characters with special character"
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <Button type="submit">
              {mode === "login"
                ? "Login"
                : "Create Account"}
            </Button>
          </form>

          <div className="switch-auth">
            {mode === "login" ? (
              <>
                Don't have an account?

                <button
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?

                <button
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* =====================================================
   RESTAURANT SEARCH
===================================================== */

function Restaurants() {
  const [search, setSearch] = useState("");

  const filteredRestaurants =
    restaurants.filter((restaurant) =>
      `${restaurant.name} ${restaurant.cuisine} ${restaurant.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <>
      <Navbar />

      <main className="container">
        <h1>Restaurant Search</h1>

        <input
          className="search-box"
          type="text"
          placeholder="Search by restaurant, cuisine or location"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <div className="grid">
          {filteredRestaurants.map(
            (restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            )
          )}
        </div>
      </main>
    </>
  );
}

/* =====================================================
   RESTAURANT DETAILS
===================================================== */

function RestaurantDetails() {
  const { id } = useParams();

  const restaurant = restaurants.find(
    (r) => r.id === Number(id)
  );

  if (!restaurant) {
    return (
      <>
        <Navbar />

        <div className="container">
          <h2>Restaurant not found.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="details-container">
        <div className="details-card">
          <h1>{restaurant.name}</h1>

          <p>
            <strong>Cuisine:</strong>{" "}
            {restaurant.cuisine}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {restaurant.location}
          </p>

          <p>
            <strong>Rating:</strong>{" "}
            {restaurant.rating}/5
          </p>

          <p>{restaurant.description}</p>

          <Link
            to={`/reservation?restaurant=${restaurant.id}`}
            className="btn"
          >
            Reserve a Table
          </Link>
        </div>
      </main>
    </>
  );
}

/* =====================================================
   RESERVATION
===================================================== */

function Reservation() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [guests, setGuests] = useState("");

  const [selectedTable, setSelectedTable] =
    useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [specialRequest, setSpecialRequest] =
    useState("");

  const [error, setError] = useState("");

  /* ---------- DATE & TIME ---------- */

  const validateDateTime = () => {
    if (!date) {
      setError("Please select a reservation date.");
      return false;
    }

    if (!time) {
      setError("Please select a reservation time.");
      return false;
    }

    const selectedDate = new Date(date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError(
        "Reservation date cannot be in the past."
      );
      return false;
    }

    return true;
  };

  /* ---------- GUEST COUNT ---------- */

  const validateGuests = () => {
    const count = Number(guests);

    if (!guests) {
      setError("Guest count is required.");
      return false;
    }

    if (count < 2 || count > 10) {
      setError(
        "Guest count must be between 2 and 10."
      );
      return false;
    }

    return true;
  };

  /* ---------- TABLE SELECTION ---------- */

  const availableTables = tables.filter(
    (table) =>
      table.capacity >= Number(guests)
  );

  const validateTable = () => {
    if (!selectedTable) {
      setError(
        "Please select a table suitable for the guest count."
      );

      return false;
    }

    if (
      selectedTable.capacity <
      Number(guests)
    ) {
      setError(
        "Selected table does not have enough capacity."
      );

      return false;
    }

    return true;
  };

  /* ---------- GUEST DETAILS ---------- */

  const validateGuestDetails = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return false;
    }

    if (!phone.trim()) {
      setError("Phone number is required.");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(
        "Please enter a valid 10-digit Indian phone number."
      );

      return false;
    }

    return true;
  };

  /* ---------- SPECIAL REQUEST ---------- */

  const validateSpecialRequest = () => {
    if (specialRequest.length > 200) {
      setError(
        "Special request must not exceed 200 characters."
      );

      return false;
    }

    return true;
  };

  /* ---------- NEXT ---------- */

  const nextStep = () => {
    setError("");

    if (step === 1) {
      if (!validateDateTime()) return;
    }

    if (step === 2) {
      if (!validateGuests()) return;
    }

    if (step === 3) {
      if (!validateTable()) return;
    }

    if (step === 4) {
      if (!validateGuestDetails()) return;
    }

    if (step === 5) {
      if (!validateSpecialRequest()) return;
    }

    setStep(step + 1);
  };

  /* ---------- CONFIRM ---------- */

  const confirmReservation = () => {
    const reservation = {
      date,
      time,
      guests,
      table: selectedTable,
      name,
      phone,
      specialRequest
    };

    localStorage.setItem(
      "reservation",
      JSON.stringify(reservation)
    );

    navigate("/checkout", {
      replace: true
    });
  };

  return (
    <>
      <Navbar />

      <main className="reservation-container">
        <div className="reservation-card">

          <div className="step-indicator">
            Step {step} of 6
          </div>

          {/* STEP 1 */}

          {step === 1 && (
            <>
              <h2>Date & Time Selection</h2>

              <DatePicker
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />

              <div className="form-group">
                <label>
                  Reservation Time
                </label>

                <select
                  value={time}
                  onChange={(e) =>
                    setTime(e.target.value)
                  }
                >
                  <option value="">
                    Select Time
                  </option>

                  <option value="12:00 PM">
                    12:00 PM
                  </option>

                  <option value="1:00 PM">
                    1:00 PM
                  </option>

                  <option value="7:00 PM">
                    7:00 PM
                  </option>

                  <option value="8:00 PM">
                    8:00 PM
                  </option>

                  <option value="9:00 PM">
                    9:00 PM
                  </option>
                </select>
              </div>
            </>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <>
              <h2>Guest Count</h2>

              <Input
                label="Number of Guests"
                type="number"
                value={guests}
                placeholder="2 - 10"
                onChange={(e) => {
                  setGuests(e.target.value);
                  setSelectedTable(null);
                }}
                required
              />

              <p className="info">
                Guest count must be between 2 and 10.
              </p>
            </>
          )}

          {/* STEP 3 */}

          {step === 3 && (
            <>
              <h2>Select Your Table</h2>

              <p>
                Guest Count:{" "}
                <strong>{guests}</strong>
              </p>

              <div className="table-grid">

                {availableTables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    selected={
                      selectedTable?.id ===
                      table.id
                    }
                    onSelect={setSelectedTable}
                  />
                ))}

              </div>

              {availableTables.length === 0 && (
                <p className="error-message">
                  No table available for this
                  number of guests.
                </p>
              )}
            </>
          )}

          {/* STEP 4 */}

          {step === 4 && (
            <>
              <h2>Guest Details</h2>

              <Input
                label="Full Name"
                value={name}
                placeholder="Enter your name"
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                placeholder="10-digit phone number"
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                required
              />
            </>
          )}

          {/* STEP 5 */}

          {step === 5 && (
            <>
              <h2>Special Requests</h2>

              <div className="form-group">
                <label>
                  Special Request
                </label>

                <textarea
                  value={specialRequest}
                  maxLength={200}
                  placeholder="Birthday, window seat, allergy information, etc."
                  onChange={(e) =>
                    setSpecialRequest(
                      e.target.value
                    )
                  }
                />

                <small>
                  {specialRequest.length}/200
                </small>
              </div>
            </>
          )}

          {/* STEP 6 */}

          {step === 6 && (
            <>
              <h2>Reservation Summary</h2>

              <div className="summary">

                <p>
                  <strong>Date:</strong>{" "}
                  {date}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {time}
                </p>

                <p>
                  <strong>Guests:</strong>{" "}
                  {guests}
                </p>

                <p>
                  <strong>Table:</strong>{" "}
                  {selectedTable?.name}
                </p>

                <p>
                  <strong>Capacity:</strong>{" "}
                  {selectedTable?.capacity}
                </p>

                <p>
                  <strong>Name:</strong>{" "}
                  {name}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {phone}
                </p>

                <p>
                  <strong>Special Request:</strong>{" "}
                  {specialRequest ||
                    "No special request"}
                </p>

              </div>
            </>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="navigation-buttons">

            {step > 1 && (
              <Button
                onClick={() => {
                  setError("");
                  setStep(step - 1);
                }}
              >
                Back
              </Button>
            )}

            {step < 6 && (
              <Button onClick={nextStep}>
                Continue
              </Button>
            )}

            {step === 6 && (
              <Button
                onClick={confirmReservation}
              >
                Confirm Reservation
              </Button>
            )}

          </div>

        </div>
      </main>
    </>
  );
}

/* =====================================================
   CHECKOUT
===================================================== */

function Checkout() {
  const navigate = useNavigate();

  const reservation = JSON.parse(
    localStorage.getItem("reservation")
  );

  if (!reservation) {
    return (
      <>
        <Navbar />

        <div className="container">
          <h2>
            No reservation details found.
          </h2>

          <Link
            to="/restaurants"
            className="btn"
          >
            Start Reservation
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="confirmation-container">
        <div className="confirmation-card">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Reservation Confirmed
          </h1>

          <p>
            Your table has been successfully
            reserved.
          </p>

          <div className="summary">

            <p>
              <strong>Date:</strong>{" "}
              {reservation.date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {reservation.time}
            </p>

            <p>
              <strong>Guests:</strong>{" "}
              {reservation.guests}
            </p>

            <p>
              <strong>Table:</strong>{" "}
              {reservation.table.name}
            </p>

            <p>
              <strong>Name:</strong>{" "}
              {reservation.name}
            </p>

          </div>

          <Button
            onClick={() =>
              navigate("/reservations")
            }
          >
            View My Reservations
          </Button>

        </div>
      </main>
    </>
  );
}

/* =====================================================
   RESERVATIONS
===================================================== */

function Reservations() {
  const reservation = JSON.parse(
    localStorage.getItem("reservation")
  );

  return (
    <>
      <Navbar />

      <main className="container">
        <h1>My Reservations</h1>

        {!reservation ? (
          <div className="card">
            <p>
              You do not have any reservations.
            </p>

            <Link
              to="/restaurants"
              className="btn"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="card reservation-history">

            <h2>Current Reservation</h2>

            <p>
              <strong>Date:</strong>{" "}
              {reservation.date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {reservation.time}
            </p>

            <p>
              <strong>Guests:</strong>{" "}
              {reservation.guests}
            </p>

            <p>
              <strong>Table:</strong>{" "}
              {reservation.table.name}
            </p>

            <p>
              <strong>Capacity:</strong>{" "}
              {reservation.table.capacity}
            </p>

            <p>
              <strong>Guest Name:</strong>{" "}
              {reservation.name}
            </p>

          </div>
        )}
      </main>
    </>
  );
}

/* =====================================================
   404 PAGE
===================================================== */

function NotFound() {
  return (
    <>
      <Navbar />

      <div className="error-page">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          The requested page does not exist.
        </p>

        <Link to="/" className="btn">
          Return to Home
        </Link>
      </div>
    </>
  );
}

/* =====================================================
   APP ROUTES
===================================================== */

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>

        <Routes>

          {/* PUBLIC ROUTES */}

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

          {/* PROTECTED ROUTES */}

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
              </ProtectedRoute>}/>
          <Route path="/reservations" element={
              <ProtectedRoute>
                <Reservations />
              </ProtectedRoute>}/>
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </ErrorBoundary>
    </AuthProvider>);}
export default App;