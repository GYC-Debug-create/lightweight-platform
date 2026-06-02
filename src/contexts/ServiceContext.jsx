import { createContext, useMemo } from "react";
import * as goodService from "../services/goodService";
import * as cartService from "../services/cartService";
import * as orderService from "../services/orderService";
import * as authService from "../services/authService";

const ServiceContext = createContext();

const ServiceProvider = ({ children }) => {
  const value = useMemo(() => ({
    good: goodService,
    cart: cartService,
    order: orderService,
    auth: authService,
  }), []);

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

export { ServiceContext, ServiceProvider };
