const API_URL = `${process.env.REACT_APP_API_URL}/v1/wallet`;

export const walletService = {
  async getBalance() {
    const response = await fetch(`${API_URL}/balance`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },
};
