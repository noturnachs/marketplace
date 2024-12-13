const API_URL = `${process.env.REACT_APP_API_URL}/v1/listings`;

export const listingService = {
  async getAll() {
    const response = await fetch(API_URL, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  },

  async getMyListings() {
    const response = await fetch(`${API_URL}/my-listings`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  },

  async create(listingData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(listingData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  },

  async update(id, listingData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(listingData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  },
};
