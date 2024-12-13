const API_URL = `${process.env.REACT_APP_API_URL}/v1/payments`;

export const paymentService = {
  async createPayment(paymentData) {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: paymentData.amount,
        coins: paymentData.coins,
        referenceId: paymentData.referenceId,
        paymentMethod: paymentData.paymentMethod,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getMyPayments() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/my-payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getPendingPayments() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getAllPayments() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async updatePaymentStatus(referenceId, status) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${referenceId}/status`, {
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
};
