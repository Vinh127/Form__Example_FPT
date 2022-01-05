import React, { useState } from "react";
import axios from "axios";
import "./styles.css";
function Menu({ menuItem, handleAddToOrder}) {
  return (
    <tbody>
      <tr>
        <td>{menuItem.id}</td>
        <td>{menuItem.name}</td>
        <td>{menuItem.category}</td>
        <td>$ {menuItem.price}</td>
        <td>
          <button onClick={() => handleAddToOrder(menuItem.id)}>
            Add to order
          </button>
        </td>
      </tr>
    </tbody>
  );
}
export default Menu;
