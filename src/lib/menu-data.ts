export const MENU_CATEGORIES = [
  "Signature Drinks",
  "Coffee",
  "Non-Coffee",
  "Frappuccino",
  "Smoothie",
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export type MenuItem = {
  name: string;
  price: number;
  category: MenuCategory;
  color: string;
};

export const MENU_ITEMS: MenuItem[] = [
  { name: "Mellow Milk Tea", price: 99, category: "Signature Drinks", color: "#B48A5A" },
  { name: "Taro Delight", price: 109, category: "Signature Drinks", color: "#8E7BC4" },
  { name: "Brown Sugar Boba", price: 115, category: "Signature Drinks", color: "#8A5A34" },
  { name: "Okinawa Milk Tea", price: 109, category: "Signature Drinks", color: "#A9754A" },

  { name: "Spanish Latte", price: 99, category: "Coffee", color: "#8A5A34" },
  { name: "Caramel Macchiato", price: 119, category: "Coffee", color: "#B4793A" },
  { name: "Iced Americano", price: 89, category: "Coffee", color: "#5C3A1E" },
  { name: "Vanilla Cold Brew", price: 109, category: "Coffee", color: "#9C6B3E" },

  { name: "Strawberry Milk", price: 95, category: "Non-Coffee", color: "#E77E8A" },
  { name: "Matcha Latte", price: 109, category: "Non-Coffee", color: "#7FA35C" },
  { name: "Wintermelon Milk Tea", price: 99, category: "Non-Coffee", color: "#C9D98A" },
  { name: "Chocolate Delight", price: 99, category: "Non-Coffee", color: "#6B4226" },

  { name: "Cookies & Cream Frappe", price: 129, category: "Frappuccino", color: "#B8AFA3" },
  { name: "Mocha Frappe", price: 129, category: "Frappuccino", color: "#7A4B2A" },
  { name: "Caramel Frappe", price: 129, category: "Frappuccino", color: "#C99A4B" },
  { name: "Matcha Frappe", price: 135, category: "Frappuccino", color: "#8FAE55" },

  { name: "Mango Smoothie", price: 119, category: "Smoothie", color: "#F2B705" },
  { name: "Strawberry Smoothie", price: 119, category: "Smoothie", color: "#E24E5A" },
  { name: "Blueberry Smoothie", price: 125, category: "Smoothie", color: "#5B6EC9" },
  { name: "Mixed Berry Smoothie", price: 129, category: "Smoothie", color: "#9C4A6B" },
];

export function formatPrice(price: number): string {
  return `₱${price}`;
}
