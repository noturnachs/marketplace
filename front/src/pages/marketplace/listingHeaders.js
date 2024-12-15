import gizmoHeader from "./assets/headers/gizmoai.png";
// Import other headers here as needed

export const listingHeaders = [
  {
    keyword: "gizmo",
    image: gizmoHeader,
    alt: "Gizmo Header",
  },
  // Add more header configurations here
  // Example:
  // {
  //   keyword: "netflix",
  //   image: netflixHeader,
  //   alt: "Netflix Header"
  // },
];

export const getListingHeader = (title) => {
  if (!title) return null;

  const lowerTitle = title.toLowerCase();
  return listingHeaders.find((header) => lowerTitle.includes(header.keyword));
};

export const hasCustomHeader = (title) => {
  return !!getListingHeader(title);
};
