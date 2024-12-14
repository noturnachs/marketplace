const API_URL = `${process.env.REACT_APP_API_URL}/v1/purchases`;

export const purchaseService = {
  async create(listingId, amount) {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        listing_id: listingId,
        amount: amount,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getMyPurchases() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/my-purchases`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getMySales() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/my-sales`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async updateStatus(purchaseId, data) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${purchaseId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result.data;
  },

  async confirmPurchase(purchaseId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${purchaseId}/confirm`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },
};
