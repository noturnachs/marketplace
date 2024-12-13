const API_URL = `${process.env.REACT_APP_API_URL}/v1/listings`;

export const listingService = {
  async getAll() {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getById(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async getMyListings() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/my-listings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async create(listing) {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listing),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async update(id, listing) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listing),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async delete(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },
};
