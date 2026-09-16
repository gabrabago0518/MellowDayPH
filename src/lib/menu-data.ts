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
  image?: string;
};

export const MENU_ITEMS: MenuItem[] = [
  // Coffee
  { id: "coffee-iced-americano", name: "Iced Americano", price: 145, category: "Coffee", color: "#5C3A1E", image: "/americano.png" },
  { id: "coffee-iced-cafe-latte", name: "Iced Cafe Latte", price: 150, category: "Coffee", color: "#9C6B3E", image: "/cafe-latte.png" },
  { id: "coffee-einspanner", name: "Einspänner", price: 155, category: "Coffee", color: "#3B2314", image: "/einspanner.png" },
  { id: "coffee-iced-cappuccino", name: "Iced Cappuccino", price: 150, category: "Coffee", color: "#B4793A", image: "/cappucino.png" },
  { id: "coffee-iced-spanish-latte", name: "Iced Spanish Latte", price: 160, category: "Coffee", color: "#A9754A", image: "/spanish-latte.png" },
  { id: "coffee-iced-vanilla-latte", name: "Iced Vanilla Latte", price: 165, category: "Coffee", color: "#C99A4B", image: "/vanilla-latte.png" },
  { id: "coffee-iced-sea-salt-latte", name: "Iced Sea Salt Latte", price: 165, category: "Coffee", color: "#B8AFA3", image: "/sea-salt-latte.png" },
  { id: "coffee-iced-hazelnut-latte", name: "Iced Hazelnut Latte", price: 165, category: "Coffee", color: "#8A5A34", image: "/hazelnut-latte.png" },
  { id: "coffee-cream-latte", name: "Cream Latte", price: 165, category: "Coffee", color: "#D9BE95", image: "/cream-latte.png" },
  { id: "coffee-iced-cafe-mocha", name: "Iced Cafe Mocha", price: 170, category: "Coffee", color: "#6B4226", image: "/cafe-mocha.png" },
  { id: "coffee-iced-caramel-macchiato", name: "Iced Caramel Macchiato", price: 175, category: "Coffee", color: "#C08A3E", image: "/caramel-macchiato.png" },
  { id: "coffee-iced-butterscotch-latte", name: "Iced Butterscotch Latte", price: 175, category: "Coffee", color: "#B4793A", image: "/butterscotch-latte.png" },
  { id: "coffee-iced-toffee-nut-latte", name: "Iced Toffee Nut Latte", price: 180, category: "Coffee", color: "#8A5A34", image: "/toffee-nut-latte.png" },
  { id: "coffee-iced-chestnut-latte", name: "Iced Chestnut Latte", price: 185, category: "Coffee", color: "#9C6B3E", image: "/chestnut-latte.png" },
  { id: "coffee-iced-dirty-matcha", name: "Iced Dirty Matcha", price: 180, category: "Coffee", color: "#7FA35C", image: "/dirty-matcha.png" },
  { id: "coffee-iced-white-chocolate-mocha", name: "Iced White Chocolate Mocha", price: 180, category: "Coffee", color: "#E8D9B5", image: "/white-chocolate-mocha.png" },
  { id: "coffee-ube-dusk", name: "Ube Dusk", price: 190, category: "Coffee", color: "#8E7BC4", image: "/ube-dusk.png" },
  { id: "coffee-strawpresso-latte", name: "Strawpresso Latte", price: 195, category: "Coffee", color: "#E24E5A", image: "/strawpresso.png" },
  { id: "coffee-cold-brew", name: "Cold Brew", price: 180, category: "Coffee", color: "#3B2314", image: "/cold-brew.png" },
  { id: "coffee-cold-brew-latte", name: "Cold Brew Latte", price: 190, category: "Coffee", color: "#9C6B3E", image: "/cold-brew-latte.png" },
  { id: "coffee-caramel-cold-brew", name: "Caramel Cold Brew", price: 200, category: "Coffee", color: "#C08A3E", image: "/caramel-cold-brew.png" },

  // Hot Drinks
  { id: "hot-drinks-hot-americano", name: "Hot Americano", price: 125, category: "Hot Drinks", color: "#5C3A1E", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-cafe-latte", name: "Hot Cafe Latte", price: 145, category: "Hot Drinks", color: "#9C6B3E", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-cappuccino", name: "Hot Cappuccino", price: 145, category: "Hot Drinks", color: "#B4793A", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-spanish-latte", name: "Hot Spanish Latte", price: 150, category: "Hot Drinks", color: "#A9754A", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-vanilla-latte", name: "Hot Vanilla Latte", price: 155, category: "Hot Drinks", color: "#C99A4B", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-sea-salt-latte", name: "Hot Sea Salt Latte", price: 155, category: "Hot Drinks", color: "#B8AFA3", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-hazelnut-latte", name: "Hot Hazelnut Latte", price: 155, category: "Hot Drinks", color: "#8A5A34", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-cafe-mocha", name: "Hot Cafe Mocha", price: 160, category: "Hot Drinks", color: "#6B4226", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-caramel-macchiato", name: "Hot Caramel Macchiato", price: 165, category: "Hot Drinks", color: "#C08A3E", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-butterscotch", name: "Hot Butterscotch", price: 165, category: "Hot Drinks", color: "#B4793A", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-dirty-matcha", name: "Hot Dirty Matcha", price: 175, category: "Hot Drinks", color: "#7FA35C", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-white-chocolate-mocha", name: "Hot White Chocolate Mocha", price: 175, category: "Hot Drinks", color: "#E8D9B5", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-green-tea", name: "Hot Green Tea", price: 120, category: "Hot Drinks", color: "#7FA35C", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-jasmine-tea", name: "Hot Jasmine Tea", price: 120, category: "Hot Drinks", color: "#D9D08A", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-lemon-tea", name: "Hot Lemon Tea", price: 120, category: "Hot Drinks", color: "#F2B705", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-matcha-latte", name: "Hot Matcha Latte", price: 165, category: "Hot Drinks", color: "#7FA35C", image: "/hot-coffee.png" },
  { id: "hot-drinks-hot-chocolate-latte", name: "Hot Chocolate Latte", price: 155, category: "Hot Drinks", color: "#6B4226", image: "/hot-coffee.png" },

  // Signature Drinks
  { id: "signature-drinks-lemon-ade", name: "Lemon Ade", price: 160, category: "Signature Drinks", color: "#F2B705", image: "/lemon-ade.png" },
  { id: "signature-drinks-retro-coffee", name: "Retro Coffee", price: 190, category: "Signature Drinks", color: "#B4793A", image: "/retro-coffee.png" },
  { id: "signature-drinks-coconut-matcha-cloud", name: "Coconut Matcha Cloud", price: 185, category: "Signature Drinks", color: "#A9C46F", image: "/coconut-matcha-cloud.png" },
  { id: "signature-drinks-jolly-pong", name: "Jolly Pong", price: 195, category: "Signature Drinks", color: "#C99A4B", image: "/jolly-pong.png" },
  { id: "signature-drinks-mint-chocolate", name: "Mint Chocolate", price: 195, category: "Signature Drinks", color: "#5FBF8F", image: "/mint-chocolate.png" },
  { id: "signature-drinks-cube-latte", name: "Cube Latte", price: 185, category: "Signature Drinks", color: "#8A5A34", image: "/cube-latte.png" },

  // Non Coffee
  { id: "non-coffee-matcha-berry-latte", name: "Matcha Berry Latte", price: 190, category: "Non Coffee", color: "#B15C7A", image: "/matchaberry-latte.png" },
  { id: "non-coffee-chocolate-latte", name: "Chocolate Latte", price: 165, category: "Non Coffee", color: "#6B4226", image: "/chocolate-latte.png" },
  { id: "non-coffee-misugaru", name: "Misugaru", price: 150, category: "Non Coffee", color: "#C9A66B", image: "/misugaru.png" },
  { id: "non-coffee-coconut-matcha-latte", name: "Coconut Matcha Latte", price: 185, category: "Non Coffee", color: "#A9C46F" },
  { id: "non-coffee-ube-coconut-latte", name: "Ube Coconut Latte", price: 175, category: "Non Coffee", color: "#8E7BC4", image: "/ube-coconut-latte.png" },
  { id: "non-coffee-ube-latte", name: "Ube Latte", price: 165, category: "Non Coffee", color: "#8E7BC4", image: "/ube-latte.png" },
  { id: "non-coffee-moonlight-matcha", name: "Moonlight Matcha", price: 195, category: "Non Coffee", color: "#7FA35C", image: "/moonlight-matcha.png" },
  { id: "non-coffee-shikye", name: "Shikye", price: 155, category: "Non Coffee", color: "#D9BE95", image: "/shikye.png" },
  { id: "non-coffee-matcha-latte", name: "Matcha Latte", price: 180, category: "Non Coffee", color: "#7FA35C", image: "/matcha-latte.png" },

  // Frappuccino
  { id: "frappuccino-matcha-frappe", name: "Matcha Frappe", price: 205, category: "Frappuccino", color: "#7FA35C", image: "/matcha-frappe.png" },
  { id: "frappuccino-cookies-n-cream-frappe", name: "Cookies N Cream Frappe", price: 200, category: "Frappuccino", color: "#B8AFA3", image: "/cookies-and-cream.png" },
  { id: "frappuccino-java-chip", name: "Java Chip", price: 210, category: "Frappuccino", color: "#6B4226", image: "/java-chip.png" },
  { id: "frappuccino-strawberry-frappe", name: "Strawberry Frappe", price: 200, category: "Frappuccino", color: "#E24E5A", image: "/strawberry.png" },
  { id: "frappuccino-vanilla-coffee-frappe", name: "Vanilla Coffee Frappe", price: 185, category: "Frappuccino", color: "#C99A4B", image: "/vanilla-coffee.png" },
  { id: "frappuccino-biscoff-frappe", name: "Biscoff Frappe", price: 200, category: "Frappuccino", color: "#B4793A", image: "/biscoff.png" },
  { id: "frappuccino-ube-cream", name: "Ube Cream", price: 190, category: "Frappuccino", color: "#8E7BC4", image: "/ube-cream.png" },
  { id: "frappuccino-strawberry-banana", name: "Strawberry Banana", price: 210, category: "Frappuccino", color: "#F2B705", image: "/strawberry-banana-milk.png" },
  { id: "frappuccino-jolly-pong", name: "Jolly Pong", price: 195, category: "Frappuccino", color: "#C99A4B", image: "/jolly-pong.png" },
  { id: "frappuccino-mint-chocolate", name: "Mint Chocolate", price: 205, category: "Frappuccino", color: "#5FBF8F", image: "/mint-chocolate.png" },

  // Smoothie
  { id: "smoothie-strawberry-yogurt", name: "Strawberry Yogurt", price: 195, category: "Smoothie", color: "#E24E5A", image: "/strawberry-yogurt.png" },
  { id: "smoothie-blueberry-yogurt", name: "Blueberry Yogurt", price: 190, category: "Smoothie", color: "#5B6EC9", image: "/blueberry-yogurt.png" },
  { id: "smoothie-plain-yogurt", name: "Plain Yogurt", price: 180, category: "Smoothie", color: "#F4E4C6", image: "/pure-yogurt.png" },
  { id: "smoothie-pure-mango", name: "Pure Mango", price: 185, category: "Smoothie", color: "#F2B705", image: "/pure-mango.png" },

  // Refreshers
  { id: "refreshers-pomelo-ade", name: "Pomelo Ade", price: 140, category: "Refreshers", color: "#F2B705", image: "/pomelo-ade.png" },
  { id: "refreshers-calamansi-ade", name: "Calamansi Ade", price: 155, category: "Refreshers", color: "#C9D98A", image: "/calamansi-ade.png" },

  // Desserts
  { id: "desserts-mellow-cookies-oreo", name: "Mellow Cookies Oreo", price: 165, category: "Desserts", color: "#3B2314" },
  { id: "desserts-dubai-chewy-cookie-bites", name: "Dubai Chewy Cookie Bites", price: 215, category: "Desserts", color: "#6B4226", image: "/dubai-chewy-cookie-bites.png" },
  { id: "desserts-dubai-chewy-cookie", name: "Dubai Chewy Cookie", price: 170, category: "Desserts", color: "#C99A4B", image: "/dubai-chewy-cookie.png" },
  { id: "desserts-choco-chip-muffin", name: "Choco Chip Muffin", price: 125, category: "Desserts", color: "#6B4226", image: "/choco-chip-muffin.png" },
  { id: "desserts-oreo-mini-cheesecake", name: "Oreo Mini Cheesecake", price: 175, category: "Desserts", color: "#F4E4C6", image: "/oreo-mini-cheesecake.png" },
  { id: "desserts-nutella-cheesecake", name: "Nutella Cheesecake", price: 225, category: "Desserts", color: "#8A5A34", image: "/nutella-cheesecake.png" },
  { id: "desserts-chocolate-crinkles", name: "Chocolate Crinkles", price: 95, category: "Desserts", color: "#3B2314", image: "/crinkles.png" },

  // Croffle
  { id: "croffle-cookies-n-cream-croffle", name: "Cookies N' Cream Croffle", price: 165, category: "Croffle", color: "#B8AFA3", image: "/cookies-n-cream-croffle-1.png" },
  { id: "croffle-biscoff-croffle", name: "Biscoff Croffle", price: 175, category: "Croffle", color: "#B4793A", image: "/biscoff-croffle.png" },
  { id: "croffle-strawberry-croffle", name: "Strawberry Croffle", price: 185, category: "Croffle", color: "#E24E5A", image: "/strawberry-croffle-1.png" },

  // Mellow Fries
  { id: "mellow-fries-mellow-fries", name: "Mellow Fries", price: 120, category: "Mellow Fries", color: "#C99A4B", image: "/mellow-fries.png" },

  // Mini Bungeoppang
  { id: "mini-bungeoppang-mini-bungeoppang", name: "Mini Bungeoppang", price: 145, category: "Mini Bungeoppang", color: "#C9A66B", image: "/mini-bungeoppang.png" },
];

export function formatPrice(price: number): string {
  return `₱${price}`;
}
