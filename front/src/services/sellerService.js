const API_URL = `${process.env.REACT_APP_API_URL}/v1`;

export const sellerService = {
  async getPendingSellers() {
    const response = await fetch(`${API_URL}/sellers/pending`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getAllSellers() {
    const response = await fetch(`${API_URL}/sellers`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async updateStatus(sellerId, status) {
    const response = await fetch(`${API_URL}/sellers/${sellerId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },
};
