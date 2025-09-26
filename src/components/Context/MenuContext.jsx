import React, { createContext, useContext, useReducer } from "react"; 

// 1️⃣ Create Menu Context
const MenuContext = createContext();

// 2️⃣ Reducer function
const menuReducer = (state, action) => {
  switch (action.type) {
    case "SET_MENU_ITEMS":
      return { ...state, menuItems: action.payload };

    case "ADD_MENU_ITEM":
      return { ...state, menuItems: [...state.menuItems, action.payload] };

    case "UPDATE_MENU_ITEM":
      return {
        ...state,
        menuItems: state.menuItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case "DELETE_MENU_ITEM":
      return {
        ...state,
        menuItems: state.menuItems.filter((item) => item.id !== action.payload),
      };

    default:
      return state;
  }
};

// 3️⃣ Initial state with mock data (using /public/images/)
const initialState = {
  menuItems: [
    {
      id: 1,
      name: "Cheese Salad",
      category: "Main Course",
      price: 12.99,
      description: "Delicious cheese pizza",
      image: "/images/Chees Salad.jpg",
      available: true,
    },
    {
      id: 2,
      name: "Burger",
      category: "Main Course",
      price: 10.5,
      description: "Juicy beef burger",
      image: "/images/Burger.jpg",
      available: true,
    },
    {
      id: 3,
      name: "Caesar Salad",
      category: "Appetizer",
      price: 8.0,
      description: "Fresh Caesar salad",
      image: "/images/Caesar Salad.jpg",
      available: true,
    },
    {
      id: 4,
      name: "Chocolate Cake",
      category: "Dessert",
      price: 6.5,
      description: "Rich chocolate cake",
      image: "/images/Chocolate Cake.jpj.jpg",
      available: true,
    },
    {
      id: 5,
      name: "Coffee",
      category: "Beverage",
      price: 3.0,
      description: "Hot brewed coffee",
      image: "/images/Coffee.jpg",
      available: true,
    },
    {
      id: 6,
      name: "Ice Cream",
      category: "Dessert",
      price: 4.5,
      description: "Vanilla ice cream",
      image: "/images/chocolat.jpg",
      available: true,
    },
    {
      id: 7,
      name: "French Fries",
      category: "Appetizer",
      price: 5.0,
      description: "Crispy fries",
      image: "/images/French Fries.jpg",
      available: true,
    },
    {
      id: 8,
      name: "Grilled Chicken",
      category: "Main Course",
      price: 14.0,
      description: "Grilled chicken breast",
      image: "/images/Grilled Chicken.jpg",
      available: true,
    },
    {
      id: 9,
      name: "Lemonade",
      category: "Beverage",
      price: 3.5,
      description: "Fresh lemonade",
      image: "/images/Lemonade.jpg",
      available: true,
    },
    {
      id: 10,
      name: "Pasta Carbonara",
      category: "Main Course",
      price: 13.0,
      description: "Creamy pasta with bacon",
      image: "/images/Pasta Carbonara.jpg",
      available: true,
    },
    {
      id: 11,
      name: "Garlic Bread",
      category: "Appetizer",
      price: 4.0,
      description: "Toasted garlic bread",
      image: "/images/Garlic Bread.jpg",
      available: true,
    },
    {
      id: 12,
      name: "Mango Smoothie",
      category: "Beverage",
      price: 5.0,
      description: "Refreshing mango smoothie",
      image: "/images/Mango Smoothie.jpg",
      available: true,
    },
  ],
};

// 4️⃣ Provider component
export const MenuProvider = ({ children }) => {
  const [state, dispatch] = useReducer(menuReducer, initialState);

  return (
    <MenuContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuContext.Provider>
  );
};

// 5️⃣ Custom hook for easier usage
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within a MenuProvider");
  return context;
};
