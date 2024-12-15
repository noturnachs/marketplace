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

  async getSellerDetails(sellerId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sellers/${sellerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async updateVouchLink(sellerId, vouchLink) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sellers/${sellerId}/vouches`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vouch_link: vouchLink }),
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

  async updateFeeExemption(sellerId, isExempt) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/sellers/${sellerId}/fee-exemption`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isExempt }),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  requestWithdrawal: async (amount) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sellers/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to process withdrawal");
    }

    return data;
  },

  getFeeStatus: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sellers/fee-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to get fee status");
    }

    return data.feeExempt;
  },

  getSellerProfile: async (sellerId) => {
    const response = await fetch(`${API_URL}/sellers/${sellerId}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  getSellerListings: async (sellerId) => {
    const response = await fetch(`${API_URL}/sellers/${sellerId}/listings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  getProfileCustomization: async (sellerId) => {
    const response = await fetch(
      `${API_URL}/sellers/${sellerId}/profile/customization`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  updateProfileCustomization: async (sellerId, colors) => {
    const response = await fetch(
      `${API_URL}/sellers/${sellerId}/profile/customization`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(colors),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },
};
