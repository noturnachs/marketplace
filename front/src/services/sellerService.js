const API_URL = `${process.env.REACT_APP_API_URL}/v1`;

export const sellerService = {
  async getPendingSellers() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sellers/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getAllSellers() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sellers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async updateStatus(sellerId, status) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sellers/${sellerId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  getBalance: async () => {
    const response = await fetch(`${API_URL}/sellers/balance`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch balance");
    }

    return response.json();
  },
};
