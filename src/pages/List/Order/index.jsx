import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

function Order({ orderItem, handleDeleteOrderItem }) {
  const [quantity, setQuantity] = useState(1);

  let q =quantity;

  

  const total = quantity * orderItem.price;


  return (
    <>
      <tbody>
        <tr>
          <td>{orderItem.id}</td>
          <td>{orderItem.name}</td>
          <td>{orderItem.category}</td>
          <td className="orderitem__price">
            $ {orderItem.price}
            <input
              type="text"
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity <= 0 ? 1 : quantity}
              
            />
          </td>

          <td> = </td>

          <td className="orderitem__total">{total}</td>

          <td>
            <button
              className="orderitem__button"
              onClick={() => handleDeleteOrderItem(orderItem.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </>
  );
}
export default Order;
