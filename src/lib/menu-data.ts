export const MENU_CATEGORIES = [
  "Coffee",
  "Hot Drinks",
  "Signature Drinks",
  "Non Coffee",
  "Frappuccino",
  "Smoothie",
  "Refreshers",
  "Desserts",
  "Croffle",
  "Mellow Fries",
  "Mini Bungeoppang",
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

const FOOD_CATEGORIES: MenuCategory[] = [
  "Desserts",
  "Croffle",
  "Mellow Fries",
  "Mini Bungeoppang",
];

export function isFoodCategory(category: MenuCategory): boolean {
  return FOOD_CATEGORIES.includes(category);
}

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
  color: string;
};

export const MENU_ITEMS: MenuItem[] = [
  // Coffee
  { id: "coffee-iced-americano", name: "Iced Americano", price: 145, category: "Coffee", color: "#5C3A1E" },
  { id: "coffee-iced-cafe-latte", name: "Iced Cafe Latte", price: 150, category: "Coffee", color: "#9C6B3E" },
  { id: "coffee-einspanner", name: "Einspänner", price: 155, category: "Coffee", color: "#3B2314" },
  { id: "coffee-iced-cappuccino", name: "Iced Cappuccino", price: 150, category: "Coffee", color: "#B4793A" },
  { id: "coffee-iced-spanish-latte", name: "Iced Spanish Latte", price: 160, category: "Coffee", color: "#A9754A" },
  { id: "coffee-iced-vanilla-latte", name: "Iced Vanilla Latte", price: 165, category: "Coffee", color: "#C99A4B" },
  { id: "coffee-iced-sea-salt-latte", name: "Iced Sea Salt Latte", price: 165, category: "Coffee", color: "#B8AFA3" },
  { id: "coffee-iced-hazelnut-latte", name: "Iced Hazelnut Latte", price: 165, category: "Coffee", color: "#8A5A34" },
  { id: "coffee-cream-latte", name: "Cream Latte", price: 165, category: "Coffee", color: "#D9BE95" },
  { id: "coffee-iced-cafe-mocha", name: "Iced Cafe Mocha", price: 170, category: "Coffee", color: "#6B4226" },
  { id: "coffee-iced-caramel-macchiato", name: "Iced Caramel Macchiato", price: 175, category: "Coffee", color: "#C08A3E" },
  { id: "coffee-iced-butterscotch-latte", name: "Iced Butterscotch Latte", price: 175, category: "Coffee", color: "#B4793A" },
  { id: "coffee-iced-toffee-nut-latte", name: "Iced Toffee Nut Latte", price: 180, category: "Coffee", color: "#8A5A34" },
  { id: "coffee-iced-chestnut-latte", name: "Iced Chestnut Latte", price: 185, category: "Coffee", color: "#9C6B3E" },
  { id: "coffee-iced-dirty-matcha", name: "Iced Dirty Matcha", price: 180, category: "Coffee", color: "#7FA35C" },
  { id: "coffee-iced-white-chocolate-mocha", name: "Iced White Chocolate Mocha", price: 180, category: "Coffee", color: "#E8D9B5" },
  { id: "coffee-ube-dusk", name: "Ube Dusk", price: 190, category: "Coffee", color: "#8E7BC4" },
  { id: "coffee-strawpresso-latte", name: "Strawpresso Latte", price: 195, category: "Coffee", color: "#E24E5A" },
  { id: "coffee-cold-brew", name: "Cold Brew", price: 180, category: "Coffee", color: "#3B2314" },
  { id: "coffee-cold-brew-latte", name: "Cold Brew Latte", price: 190, category: "Coffee", color: "#9C6B3E" },
  { id: "coffee-caramel-cold-brew", name: "Caramel Cold Brew", price: 200, category: "Coffee", color: "#C08A3E" },

  // Hot Drinks
  { id: "hot-drinks-hot-americano", name: "Hot Americano", price: 125, category: "Hot Drinks", color: "#5C3A1E" },
  { id: "hot-drinks-hot-cafe-latte", name: "Hot Cafe Latte", price: 145, category: "Hot Drinks", color: "#9C6B3E" },
  { id: "hot-drinks-hot-cappuccino", name: "Hot Cappuccino", price: 145, category: "Hot Drinks", color: "#B4793A" },
  { id: "hot-drinks-hot-spanish-latte", name: "Hot Spanish Latte", price: 150, category: "Hot Drinks", color: "#A9754A" },
  { id: "hot-drinks-hot-vanilla-latte", name: "Hot Vanilla Latte", price: 155, category: "Hot Drinks", color: "#C99A4B" },
  { id: "hot-drinks-hot-sea-salt-latte", name: "Hot Sea Salt Latte", price: 155, category: "Hot Drinks", color: "#B8AFA3" },
  { id: "hot-drinks-hot-hazelnut-latte", name: "Hot Hazelnut Latte", price: 155, category: "Hot Drinks", color: "#8A5A34" },
  { id: "hot-drinks-hot-cafe-mocha", name: "Hot Cafe Mocha", price: 160, category: "Hot Drinks", color: "#6B4226" },
  { id: "hot-drinks-hot-caramel-macchiato", name: "Hot Caramel Macchiato", price: 165, category: "Hot Drinks", color: "#C08A3E" },
  { id: "hot-drinks-hot-butterscotch", name: "Hot Butterscotch", price: 165, category: "Hot Drinks", color: "#B4793A" },
  { id: "hot-drinks-hot-dirty-matcha", name: "Hot Dirty Matcha", price: 175, category: "Hot Drinks", color: "#7FA35C" },
  { id: "hot-drinks-hot-white-chocolate-mocha", name: "Hot White Chocolate Mocha", price: 175, category: "Hot Drinks", color: "#E8D9B5" },
  { id: "hot-drinks-hot-green-tea", name: "Hot Green Tea", price: 120, category: "Hot Drinks", color: "#7FA35C" },
  { id: "hot-drinks-hot-jasmine-tea", name: "Hot Jasmine Tea", price: 120, category: "Hot Drinks", color: "#D9D08A" },
  { id: "hot-drinks-hot-lemon-tea", name: "Hot Lemon Tea", price: 120, category: "Hot Drinks", color: "#F2B705" },
  { id: "hot-drinks-hot-matcha-latte", name: "Hot Matcha Latte", price: 165, category: "Hot Drinks", color: "#7FA35C" },
  { id: "hot-drinks-hot-chocolate-latte", name: "Hot Chocolate Latte", price: 155, category: "Hot Drinks", color: "#6B4226" },

  // Signature Drinks
  { id: "signature-drinks-lemon-ade", name: "Lemon Ade", price: 160, category: "Signature Drinks", color: "#F2B705" },
  { id: "signature-drinks-retro-coffee", name: "Retro Coffee", price: 190, category: "Signature Drinks", color: "#B4793A" },
  { id: "signature-drinks-coconut-matcha-cloud", name: "Coconut Matcha Cloud", price: 185, category: "Signature Drinks", color: "#A9C46F" },
  { id: "signature-drinks-jolly-pong", name: "Jolly Pong", price: 195, category: "Signature Drinks", color: "#C99A4B" },
  { id: "signature-drinks-mint-chocolate", name: "Mint Chocolate", price: 195, category: "Signature Drinks", color: "#5FBF8F" },
  { id: "signature-drinks-cube-latte", name: "Cube Latte", price: 185, category: "Signature Drinks", color: "#8A5A34" },

  // Non Coffee
  { id: "non-coffee-matcha-berry-latte", name: "Matcha Berry Latte", price: 190, category: "Non Coffee", color: "#B15C7A" },
  { id: "non-coffee-chocolate-latte", name: "Chocolate Latte", price: 165, category: "Non Coffee", color: "#6B4226" },
  { id: "non-coffee-misugaru", name: "Misugaru", price: 150, category: "Non Coffee", color: "#C9A66B" },
  { id: "non-coffee-coconut-matcha-latte", name: "Coconut Matcha Latte", price: 185, category: "Non Coffee", color: "#A9C46F" },
  { id: "non-coffee-ube-coconut-latte", name: "Ube Coconut Latte", price: 175, category: "Non Coffee", color: "#8E7BC4" },
  { id: "non-coffee-ube-latte", name: "Ube Latte", price: 165, category: "Non Coffee", color: "#8E7BC4" },
  { id: "non-coffee-moonlight-matcha", name: "Moonlight Matcha", price: 195, category: "Non Coffee", color: "#7FA35C" },
  { id: "non-coffee-shikye", name: "Shikye", price: 155, category: "Non Coffee", color: "#D9BE95" },
  { id: "non-coffee-matcha-latte", name: "Matcha Latte", price: 180, category: "Non Coffee", color: "#7FA35C" },

  // Frappuccino
  { id: "frappuccino-matcha-frappe", name: "Matcha Frappe", price: 205, category: "Frappuccino", color: "#7FA35C" },
  { id: "frappuccino-cookies-n-cream-frappe", name: "Cookies N Cream Frappe", price: 200, category: "Frappuccino", color: "#B8AFA3" },
  { id: "frappuccino-java-chip", name: "Java Chip", price: 210, category: "Frappuccino", color: "#6B4226" },
  { id: "frappuccino-strawberry-frappe", name: "Strawberry Frappe", price: 200, category: "Frappuccino", color: "#E24E5A" },
  { id: "frappuccino-vanilla-coffee-frappe", name: "Vanilla Coffee Frappe", price: 185, category: "Frappuccino", color: "#C99A4B" },
  { id: "frappuccino-biscoff-frappe", name: "Biscoff Frappe", price: 200, category: "Frappuccino", color: "#B4793A" },
  { id: "frappuccino-ube-cream", name: "Ube Cream", price: 190, category: "Frappuccino", color: "#8E7BC4" },
  { id: "frappuccino-strawberry-banana", name: "Strawberry Banana", price: 210, category: "Frappuccino", color: "#F2B705" },
  { id: "frappuccino-jolly-pong", name: "Jolly Pong", price: 195, category: "Frappuccino", color: "#C99A4B" },
  { id: "frappuccino-mint-chocolate", name: "Mint Chocolate", price: 205, category: "Frappuccino", color: "#5FBF8F" },

  // Smoothie
  { id: "smoothie-strawberry-yogurt", name: "Strawberry Yogurt", price: 195, category: "Smoothie", color: "#E24E5A" },
  { id: "smoothie-blueberry-yogurt", name: "Blueberry Yogurt", price: 190, category: "Smoothie", color: "#5B6EC9" },
  { id: "smoothie-plain-yogurt", name: "Plain Yogurt", price: 180, category: "Smoothie", color: "#F4E4C6" },

  // Refreshers
  { id: "refreshers-pomelo-ade", name: "Pomelo Ade", price: 140, category: "Refreshers", color: "#F2B705" },
  { id: "refreshers-calamansi-ade", name: "Calamansi Ade", price: 155, category: "Refreshers", color: "#C9D98A" },

  // Desserts
  { id: "desserts-mellow-cookies-oreo", name: "Mellow Cookies Oreo", price: 165, category: "Desserts", color: "#3B2314" },
  { id: "desserts-dubai-chewy-cookie-bites", name: "Dubai Chewy Cookie Bites", price: 215, category: "Desserts", color: "#6B4226" },
  { id: "desserts-dubai-chewy-cookie", name: "Dubai Chewy Cookie", price: 170, category: "Desserts", color: "#C99A4B" },
  { id: "desserts-choco-chip-muffin", name: "Choco Chip Muffin", price: 125, category: "Desserts", color: "#6B4226" },
  { id: "desserts-oreo-mini-cheesecake", name: "Oreo Mini Cheesecake", price: 175, category: "Desserts", color: "#F4E4C6" },
  { id: "desserts-nutella-cheesecake", name: "Nutella Cheesecake", price: 225, category: "Desserts", color: "#8A5A34" },
  { id: "desserts-chocolate-crinkles", name: "Chocolate Crinkles", price: 95, category: "Desserts", color: "#3B2314" },

  // Croffle
  { id: "croffle-cookies-n-cream-croffle", name: "Cookies N' Cream Croffle", price: 165, category: "Croffle", color: "#B8AFA3" },
  { id: "croffle-biscoff-croffle", name: "Biscoff Croffle", price: 175, category: "Croffle", color: "#B4793A" },
  { id: "croffle-strawberry-croffle", name: "Strawberry Croffle", price: 185, category: "Croffle", color: "#E24E5A" },

  // Mellow Fries
  { id: "mellow-fries-mellow-fries", name: "Mellow Fries", price: 120, category: "Mellow Fries", color: "#C99A4B" },

  // Mini Bungeoppang
  { id: "mini-bungeoppang-mini-bungeoppang", name: "Mini Bungeoppang", price: 145, category: "Mini Bungeoppang", color: "#C9A66B" },
];

export function formatPrice(price: number): string {
  return `₱${price}`;
}
