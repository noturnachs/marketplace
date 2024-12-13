const API_URL = `${process.env.REACT_APP_API_URL}/v1/auth`;

export const authService = {
  async login(username, password) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  async logout() {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("userData");
      localStorage.removeItem("userWallet");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
    }
  },

  async checkAuth() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      localStorage.removeItem("userData");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      throw error;
    }
  },
};
