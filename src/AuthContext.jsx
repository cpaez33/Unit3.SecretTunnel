import { createContext, useContext, useState } from "react";
import axios from "axios";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  const signup = async (username) => {
    try {
      const response = await axios.post(`${API}/signup`, {
        username,
        password: "super-secret-999",
      });
      console.log(response.data);
      if (response.data.success) {
        setToken(response.data.token);
        setLocation("TABLET");
      } else {
        throw new Error("Could not validate user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // TODO: authenticate
  const authenticate = async () => {
    if (!token) {
      throw new Error("Error: No token ");
    }
    try {
      const res = await axios(`${API}/authenticate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setLocation("TUNNEL");
      } else {
        throw new Error("Error: Cannot validate user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
