import React, { useEffect, useState } from "react";
import { useShop } from "../contexts/ShopContext";
import Title from "./Title";
function CartTotal() {
  const { getCartAmount, currency, deliveryFee, cartItems, products } = useShop();
  const [cartAmount, setCartAmount] = useState(0);

  useEffect(() => {
    if (products.length && Object.keys(cartItems).length) {
      setCartAmount(getCartAmount() ||0);
    } else {
      setCartAmount(0)
    }
  }, [cartItems, products]);

  return (
    products &&
    cartItems && (
      <div className="w-full">
        <div className="text-2xl">
          <Title children1={"Cart"} children2={"Totals"} />
        </div>

        <div className="flex flex-col gap-2 mt-2 text-sm">
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>
              {currency} {cartAmount}.00
            </p>
          </div>
          <hr />
          <div className="flex justify-between">
            <p>Shipping Fee:</p>
            <p>
              {currency} {deliveryFee}.00
            </p>
          </div>
          <hr />
          <div className="flex justify-between">
            <p>Total</p>
            <p>
              {currency} {cartAmount === 0 ? 0 : cartAmount + deliveryFee}.00
            </p>
          </div>
          <hr />
        </div>
      </div>
    )
  );
}

export default CartTotal;
