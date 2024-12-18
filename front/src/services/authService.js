const API_URL = `${process.env.REACT_APP_API_URL}/v1/auth`;

export const authService = {
  async login(username, password) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
    }

    return data;
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  async logout() {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
    }
    return true;
  },

  async checkAuth() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      localStorage.clear();
      throw error;
    }
  },

  generateTelegramVerification: async (telegramUsername) => {
    const response = await fetch(`${API_URL}/telegram-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ telegramUsername }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Telegram verification failed");
    }

    return data;
  },

  checkVerification: async (code) => {
    const response = await fetch(`${API_URL}/telegram-verify/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Verification check failed");
    }

    return data;
  },

  updateTelegramUsername: async (telegramUsername) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/update-telegram`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ telegram_username: telegramUsername }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update Telegram username");
    }

    // Update local storage
    const userData = JSON.parse(localStorage.getItem("userData"));
    userData.telegram_username = telegramUsername;
    localStorage.setItem("userData", JSON.stringify(userData));

    return data;
  },
};
