const API_URL = `${process.env.REACT_APP_API_URL}/v1/purchases`;

export const purchaseService = {
  async create(listingId) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ listing_id: listingId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getMyPurchases() {
    const response = await fetch(`${API_URL}/my-purchases`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getMySales() {
    const response = await fetch(`${API_URL}/my-sales`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async updateStatus(purchaseId, data) {
    const response = await fetch(`${API_URL}/${purchaseId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result.data;
  },
};
