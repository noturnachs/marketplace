const API_URL = `${process.env.REACT_APP_API_URL}/v1/wallet`;

export const walletService = {
  async getBalance() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },
};
