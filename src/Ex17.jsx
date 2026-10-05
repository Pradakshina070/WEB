import React, {
  createContext,
  useContext,
  useState
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
  useParams
} from "react-router-dom";

import "./Ex17.css";

/* =========================================================
   AUTH CONTEXT
========================================================= */

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("loggedUser")) || null
  );

  const signup = (newUser) => {
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (u) =>
        u.email.toLowerCase() ===
        newUser.email.toLowerCase()
    );

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists."
      };
    }

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    return {
      success: true,
      message: "Account created successfully."
    };
  };

  const login = (email, password) => {
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (u) =>
        u.email.toLowerCase() ===
          email.toLowerCase() &&
        u.password === password
    );

    if (!existingUser) {
      return {
        success: false,
        message: "Invalid email or password."
      };
    }

    localStorage.setItem(
      "loggedUser",
      JSON.stringify(existingUser)
    );

    setUser(existingUser);

    return {
      success: true
    };
  };

  const logout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

/* =========================================================
   ERROR BOUNDARY
========================================================= */

class ErrorBoundary extends React.Component {
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

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Something went wrong</h1>

          <p>
            An unexpected error occurred.
            Please refresh the application and try again.
          </p>

          <button
            className="btn"
            onClick={() =>
              window.location.reload()
            }
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname
        }}
        replace
      />
    );
  }

  return children;
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div
        className="logo"
        onClick={() => navigate("/")}
      >
        DineReserve
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/restaurants">
          Restaurants
        </Link>

        {user && (
          <>
            <Link to="/reservation">
              Reservation
            </Link>

            <Link to="/reservations">
              My Reservations
            </Link>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login">Login</Link>

            <Link to="/signup">
              <button className="nav-signup">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <>
            <span className="welcome">
              Hi, {user.name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

/* =========================================================
   REUSABLE BUTTON
========================================================= */

function Button({
  children,
  type = "button",
  onClick
}) {
  return (
    <button
      type={type}
      className="btn"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error
}) {
  return (
    <div className="form-group">
      <label>{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && (
        <small className="error">
          {error}
        </small>
      )}
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  const { user } = useAuth();

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="hero-small">
            SMART RESTAURANT RESERVATION
          </p>

          <h1>
            Reserve Your Perfect
            <br />
            Dining Experience
          </h1>

          <p>
            Search restaurants, select suitable
            tables and reserve your dining
            experience easily.
          </p>

          <Link
            to="/restaurants"
            className="btn hero-btn"
          >
            Explore Restaurants
          </Link>
        </div>

        <div className="hero-card">
          <div className="hero-icon">
            🍽️
          </div>

          <h3>Easy Reservation</h3>

          <p>
            Choose your restaurant, date,
            time and table.
          </p>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <span>01</span>
          <h3>Search</h3>
          <p>
            Find restaurants by cuisine and
            location.
          </p>
        </div>

        <div className="feature">
          <span>02</span>
          <h3>Select</h3>
          <p>
            Choose a table according to your
            guest count.
          </p>
        </div>

        <div className="feature">
          <span>03</span>
          <h3>Reserve</h3>
          <p>
            Complete your details and confirm
            your reservation.
          </p>
        </div>
      </section>

      {!user && (
        <section className="account-section">
          <h2>New to DineReserve?</h2>

          <p>
            Create an account before making
            a reservation.
          </p>

          <Link
            to="/signup"
            className="btn"
          >
            Create Account
          </Link>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   SIGN UP
========================================================= */

function Signup() {
  const navigate = useNavigate();

  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(form.phone)
    ) {
      newErrors.phone =
        "Enter a valid 10-digit phone number.";
    }

    if (!form.password) {
      newErrors.password =
        "Password is required.";
    } else if (form.password.length <= 8) {
      newErrors.password =
        "Password must contain more than 8 characters.";
    } else if (
      !/[!@#$%^&*(),.?":{}|<>]/.test(
        form.password
      )
    ) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    if (
      form.confirmPassword !==
      form.password
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");

    if (!validate()) return;

    const result = signup(form);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    navigate("/login", {
      replace: true,
      state: {
        message:
          "Account created successfully. Please login."
      }
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>

          <p>
            Register to reserve your table.
          </p>
        </div>

        {message && (
          <div className="alert error-box">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            error={errors.name}
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
            error={errors.email}
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            error={errors.phone}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            error={errors.confirmPassword}
          />

          <Button type="submit">
            Create Account
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account?
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState(
      location.state?.message || ""
    );

  const from =
    location.state?.from || "/";

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Email and password are required."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    const result = login(
      email,
      password
    );

    if (!result.success) {
      setError(result.message);

      /*
        Incorrect login does NOT move
        to reservation or another page.
        User remains on Login.
      */
      return;
    }

    /*
      Correct login:
      return to requested protected page.
      Otherwise go to Home.
    */
    navigate(from, {
      replace: true
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>

          <p>
            Login to continue your
            reservation.
          </p>
        </div>

        {successMessage && (
          <div className="success-box">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="alert error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
          />

          <Button type="submit">
            Login
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account?
          <Link to="/signup">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   RESTAURANT DATA
========================================================= */

const restaurants = [
  {
    id: 1,
    name: "The Royal Kitchen",
    cuisine: "Indian",
    location: "Coimbatore",
    rating: "4.8",
    image: "🍛"
  },
  {
    id: 2,
    name: "Urban Spice",
    cuisine: "Multi-Cuisine",
    location: "Coimbatore",
    rating: "4.6",
    image: "🍽️"
  },
  {
    id: 3,
    name: "Green Leaf",
    cuisine: "Vegetarian",
    location: "Coimbatore",
    rating: "4.7",
    image: "🥗"
  }
];

/* =========================================================
   RESTAURANTS
========================================================= */

function Restaurants() {
  const [search, setSearch] =
    useState("");

  const filteredRestaurants =
    restaurants.filter((restaurant) =>
      `${restaurant.name} ${restaurant.cuisine} ${restaurant.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="page">
      <div className="page-heading">
        <p className="section-label">
          RESTAURANT SEARCH
        </p>

        <h1>Find a Restaurant</h1>

        <p>
          Search by restaurant name,
          cuisine or location.
        </p>
      </div>

      <div className="search-box">
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search restaurants..."
        />
      </div>

      <div className="restaurant-grid">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(
            (restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            )
          )
        ) : (
          <div className="empty">
            No restaurants found.
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   RESTAURANT CARD
========================================================= */

function RestaurantCard({ restaurant }) {
  return (
    <div className="restaurant-card">
      <div className="restaurant-image">
        {restaurant.image}
      </div>

      <div className="restaurant-content">
        <div className="rating">
          ★ {restaurant.rating}
        </div>

        <h2>{restaurant.name}</h2>

        <p>{restaurant.cuisine}</p>

        <p className="muted">
          {restaurant.location}
        </p>

        <Link
          to={`/restaurant/${restaurant.id}`}
          className="btn"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

/* =========================================================
   RESTAURANT DETAILS
========================================================= */

function RestaurantDetails() {
  const { id } = useParams();

  const restaurant =
    restaurants.find(
      (r) => r.id === Number(id)
    );

  if (!restaurant) {
    return (
      <div className="empty-page">
        <h1>Restaurant Not Found</h1>

        <Link
          to="/restaurants"
          className="btn"
        >
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="details-card">
        <div className="details-icon">
          {restaurant.image}
        </div>

        <div>
          <div className="rating">
            ★ {restaurant.rating}
          </div>

          <h1>{restaurant.name}</h1>

          <p>
            Cuisine: {restaurant.cuisine}
          </p>

          <p>
            Location: {restaurant.location}
          </p>

          <p>
            Experience premium dining with
            comfortable seating and easy
            reservation management.
          </p>

          <Link
            to="/reservation"
            className="btn"
          >
            Reserve a Table
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TABLE DATA
========================================================= */

const tables = [
  {
    id: 1,
    name: "Table A1",
    capacity: 2,
    location: "Window Area"
  },
  {
    id: 2,
    name: "Table A2",
    capacity: 2,
    location: "Garden Area"
  },
  {
    id: 3,
    name: "Table B1",
    capacity: 4,
    location: "Main Hall"
  },
  {
    id: 4,
    name: "Table B2",
    capacity: 4,
    location: "Main Hall"
  },
  {
    id: 5,
    name: "Table C1",
    capacity: 6,
    location: "Private Area"
  },
  {
    id: 6,
    name: "Table C2",
    capacity: 6,
    location: "Private Area"
  },
  {
    id: 7,
    name: "Table D1",
    capacity: 8,
    location: "Premium Area"
  },
  {
    id: 8,
    name: "Table D2",
    capacity: 8,
    location: "Premium Area"
  },
  {
    id: 9,
    name: "Table E1",
    capacity: 10,
    location: "Family Area"
  }
];

/* =========================================================
   TABLE CARD
========================================================= */

function TableCard({
  table,
  selected,
  onSelect
}) {
  return (
    <div
      className={`table-card ${
        selected ? "selected-table" : ""
      }`}
      onClick={() => onSelect(table)}
    >
      <div className="table-number">
        {table.name}
      </div>

      <h3>
        Capacity: {table.capacity}
      </h3>

      <p>{table.location}</p>

      <button className="table-button">
        {selected
          ? "Selected"
          : "Select Table"}
      </button>
    </div>
  );
}

/* =========================================================
   RESERVATION
========================================================= */

function Reservation() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: "",
    phone: user?.phone || "",
    specialRequest: ""
  });

  const [selectedTable, setSelectedTable] =
    useState(null);

  const [errors, setErrors] =
    useState({});

  const [submitted, setSubmitted] =
    useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    setSelectedTable(null);
  };

  /*
    Table filtering:
    table capacity must be >= guest count.
    We choose the smallest suitable table.
  */
  const guestCount =
    Number(form.guests);

  const suitableTables =
    guestCount >= 2 && guestCount <= 10
      ? tables.filter(
          (table) =>
            table.capacity >= guestCount
        )
      : [];

  const validate = () => {
    const newErrors = {};

    if (!form.date) {
      newErrors.date =
        "Reservation date is required.";
    } else {
      const selectedDate =
        new Date(form.date);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date =
          "Reservation date cannot be in the past.";
      }
    }

    if (!form.time) {
      newErrors.time =
        "Reservation time is required.";
    }

    if (!form.guests) {
      newErrors.guests =
        "Guest count is required.";
    } else if (
      guestCount < 2 ||
      guestCount > 10
    ) {
      newErrors.guests =
        "Guest count must be between 2 and 10.";
    }

    if (!form.phone) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(
        form.phone
      )
    ) {
      newErrors.phone =
        "Enter a valid 10-digit phone number.";
    }

    if (!selectedTable) {
      newErrors.table =
        "Please select a suitable table.";
    }

    if (
      form.specialRequest.length > 200
    ) {
      newErrors.specialRequest =
        "Special request must be below 200 characters.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const reservation = {
      ...form,
      guests: guestCount,
      table: selectedTable,
      user: user.email,
      createdAt: new Date().toISOString()
    };

    const existingReservations =
      JSON.parse(
        localStorage.getItem(
          "reservations"
        )
      ) || [];

    existingReservations.push(
      reservation
    );

    localStorage.setItem(
      "reservations",
      JSON.stringify(
        existingReservations
      )
    );

    navigate("/checkout", {
      state: {
        reservation
      }
    });
  };

  return (
    <div className="page">
      <div className="page-heading">
        <p className="section-label">
          RESERVATION
        </p>

        <h1>Reserve Your Table</h1>

        <p>
          Select the date, time, guest
          count and suitable table.
        </p>
      </div>

      <form
        className="reservation-form"
        onSubmit={handleSubmit}
      >
        <div className="form-row">
          <div className="form-group">
            <label>
              Reservation Date
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={handleChange}
            />

            {errors.date && (
              <small className="error">
                {errors.date}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>
              Reservation Time
            </label>

            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
            />

            {errors.time && (
              <small className="error">
                {errors.time}
              </small>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Number of Guests
            </label>

            <input
              type="number"
              name="guests"
              min="2"
              max="10"
              value={form.guests}
              onChange={handleChange}
              placeholder="2 - 10"
            />

            <small className="hint">
              Minimum 2 and maximum 10
              guests
            </small>

            {errors.guests && (
              <small className="error">
                {errors.guests}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
            />

            {errors.phone && (
              <small className="error">
                {errors.phone}
              </small>
            )}
          </div>
        </div>

        {/* TABLE SECTION */}

        <div className="table-section">
          <h2>Select a Table</h2>

          {!form.guests && (
            <div className="info-box">
              Enter the guest count to
              display suitable tables.
            </div>
          )}

          {guestCount > 10 && (
            <div className="alert error-box">
              Guest count cannot exceed
              10.
            </div>
          )}

          {guestCount >= 2 &&
            guestCount <= 10 && (
              <>
                <p className="table-info">
                  Suitable tables for{" "}
                  <strong>
                    {guestCount} guests
                  </strong>
                </p>

                <div className="table-grid">
                  {suitableTables.map(
                    (table) => (
                      <TableCard
                        key={table.id}
                        table={table}
                        selected={
                          selectedTable?.id ===
                          table.id
                        }
                        onSelect={
                          setSelectedTable
                        }
                      />
                    )
                  )}
                </div>
              </>
            )}

          {errors.table && (
            <small className="error">
              {errors.table}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>
            Special Requests
          </label>

          <textarea
            name="specialRequest"
            value={form.specialRequest}
            onChange={handleChange}
            placeholder="Enter any special request..."
            rows="4"
          />

          <small className="hint">
            Maximum 200 characters
          </small>

          {errors.specialRequest && (
            <small className="error">
              {errors.specialRequest}
            </small>
          )}
        </div>

        <div className="selected-summary">
          {selectedTable ? (
            <>
              <strong>
                Selected Table:
              </strong>{" "}
              {selectedTable.name} —{" "}
              {selectedTable.capacity} seats
            </>
          ) : (
            "No table selected"
          )}
        </div>

        <Button type="submit">
          Continue to Summary
        </Button>
      </form>
    </div>
  );
}

/* =========================================================
   CHECKOUT / RESERVATION SUMMARY
========================================================= */

function Checkout() {
  const navigate = useNavigate();

  const location = useLocation();

  const reservation =
    location.state?.reservation;

  if (!reservation) {
    return (
      <div className="empty-page">
        <h1>No Reservation Found</h1>

        <p>
          Please create a reservation
          before continuing.
        </p>

        <Link
          to="/reservation"
          className="btn"
        >
          Create Reservation
        </Link>
      </div>
    );
  }

  const handleConfirm = () => {
    navigate("/confirmation", {
      state: {
        reservation
      },
      replace: true
    });
  };

  return (
    <div className="page">
      <div className="page-heading">
        <p className="section-label">
          RESERVATION SUMMARY
        </p>

        <h1>Review Your Reservation</h1>

        <p>
          Check the details before
          confirming your reservation.
        </p>
      </div>

      <div className="summary-card">
        <div className="summary-row">
          <span>Guest Name</span>
          <strong>
            {reservation.user}
          </strong>
        </div>

        <div className="summary-row">
          <span>Date</span>
          <strong>
            {reservation.date}
          </strong>
        </div>

        <div className="summary-row">
          <span>Time</span>
          <strong>
            {reservation.time}
          </strong>
        </div>

        <div className="summary-row">
          <span>Guests</span>
          <strong>
            {reservation.guests}
          </strong>
        </div>

        <div className="summary-row">
          <span>Phone</span>
          <strong>
            {reservation.phone}
          </strong>
        </div>

        <div className="summary-row">
          <span>Table</span>
          <strong>
            {reservation.table.name}
          </strong>
        </div>

        <div className="summary-row">
          <span>Capacity</span>
          <strong>
            {reservation.table.capacity} guests
          </strong>
        </div>

        <div className="summary-row">
          <span>Location</span>
          <strong>
            {reservation.table.location}
          </strong>
        </div>

        <div className="summary-row">
          <span>Special Request</span>
          <strong>
            {reservation.specialRequest ||
              "None"}
          </strong>
        </div>

        <div className="summary-actions">
          <button
            className="secondary-btn"
            onClick={() =>
              navigate("/reservation")
            }
          >
            Edit Reservation
          </button>

          <button
            className="btn"
            onClick={handleConfirm}
          >
            Confirm Reservation
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CONFIRMATION
========================================================= */

function Confirmation() {
  const location = useLocation();

  const navigate = useNavigate();

  const reservation =
    location.state?.reservation;

  if (!reservation) {
    return (
      <div className="empty-page">
        <h1>Reservation Not Found</h1>

        <Link
          to="/"
          className="btn"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon">
          ✓
        </div>

        <h1>
          Reservation Confirmed
        </h1>

        <p>
          Your restaurant table has been
          successfully reserved.
        </p>

        <div className="confirmation-details">
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
        </div>

        <div className="confirmation-actions">
          <button
            className="btn"
            onClick={() =>
              navigate(
                "/reservations"
              )
            }
          >
            View My Reservations
          </button>

          <button
            className="secondary-btn"
            onClick={() =>
              navigate("/")
            }
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MY RESERVATIONS
========================================================= */

function Reservations() {
  const { user } = useAuth();

  const reservations =
    JSON.parse(
      localStorage.getItem(
        "reservations"
      )
    ) || [];

  const myReservations =
    reservations.filter(
      (r) => r.user === user.email
    );

  return (
    <div className="page">
      <div className="page-heading">
        <p className="section-label">
          MY ACCOUNT
        </p>

        <h1>My Reservations</h1>

        <p>
          View your restaurant reservation
          history.
        </p>
      </div>

      {myReservations.length === 0 ? (
        <div className="empty">
          <h2>
            No reservations found
          </h2>

          <p>
            You have not made any
            reservations yet.
          </p>

          <Link
            to="/reservation"
            className="btn"
          >
            Make a Reservation
          </Link>
        </div>
      ) : (
        <div className="reservation-list">
          {myReservations.map(
            (reservation, index) => (
              <div
                className="reservation-card"
                key={index}
              >
                <div>
                  <span className="status">
                    CONFIRMED
                  </span>

                  <h2>
                    Table{" "}
                    {reservation.table.name}
                  </h2>
                </div>

                <div className="reservation-info">
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
                    <strong>Table
                    Capacity:</strong>{" "}
                    {
                      reservation.table
                        .capacity
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
/* =========================================================
   APP
========================================================= */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Navbar />
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/signup"
              element={<Signup />}
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
              element={
                <RestaurantDetails />
              }
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
            {/* UNKNOWN ROUTE */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;