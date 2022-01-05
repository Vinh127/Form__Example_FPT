import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Menu from "./Menu/index";
import Order from "./Order/index";
import "./styles.css";

function List() {
  const [searchKeyName, setSearchKeyName] = useState("");
  const [minPriceKey, setMinPriceKey] = useState();
  const [maxPriceKey, setMaxPriceKey] = useState();
  const [menu, setMenu] = useState({});
  const [menuItemSelected, setMenuItemSelected] = useState();
  const [order, setOrder] = useState({});
  const [categories, setCategoies] = useState({});
  const [category, setCategory] = useState("");

  const [minError, setMinError] = useState(false);

  //   Validate Space

  if (searchKeyName.length >= 3) {
    console.log("Độ dài không được dài hơn 3 ký tự");
  }

  if (minPriceKey < 0) {
    console.log("Giá trị Min phải lớn hơn 0");
  }

  if (maxPriceKey < 0) {
    console.log("Giá trị Max phải lớn hơn 0");
  } else if (maxPriceKey < minPriceKey) {
    console.log("Giá trị Max Price phải lớn hơn Min Price");
  }

  const handleFetchCategoryData = async () => {
    await axios
      .get("http://localhost:3001/category")
      .then(function (response) {
        setCategoies(response);
      })
      .catch(function (error) {
        console.log("error:", error);
      });
  };

  useEffect(() => {
    handleFetchCategoryData();
  }, [categories]);

  const handleFetchMenuData = async () => {
    const result = await axios({
      method: "GET",
      url: `http://localhost:3001/menu`,
      params: {
        ...(category && { category }),
      },
    })
      .then(function (response) {
        setMenu(response);
      })
      .catch(function (error) {
        console.log("Error: ", error);
      });
  };

  const handleFetchOrderData = async () => {
    await axios
      .get("http://localhost:3001/order")
      .then(function (response) {
        setOrder(response);
      })
      .catch(function (error) {
        console.log("error: ", error);
      });
  };

  useEffect(() => {
    handleFetchMenuData();
  }, [menu]);

  useEffect(() => {
    handleFetchOrderData();
  }, [order]);

  async function handleAddToOrder(id) {
    const menuIndex = menu.data.findIndex((item) => {
      return item.id === id;
    });

    if (menuIndex !== 1) {
      setMenuItemSelected(menu?.data[menuIndex]);
    }

    const result = await axios({
      method: "POST",
      url: `http://localhost:3001/order`,
      data: {
        id: uuidv4(),
        name: menuItemSelected.name,
        category: menuItemSelected.category,
        price: menuItemSelected.price,
      },
    });
  }

  async function handleDeleteOrderItem(id) {
    const result = await axios({
      method: "DELETE",
      url: `http://localhost:3001/order/${id}`,
    });

    await setOrder(...order);
  }

  function renderSelecOption() {
    return categories?.data?.map((categoryItem, categoryIndex) => {
      return (
        <option value={categoryItem.categoryName}>
          {categoryItem.categoryName}
        </option>
      );
    });
  }

  let grandTotal = 0;

  function renderMenu() {
    return menu?.data?.map((menuItem, menuIndex) => {
      return (
        <Menu
          key={menuIndex}
          menuItem={menuItem}
          handleAddToOrder={handleAddToOrder}
        />
      );
    });
  }

  function renderOrder() {
    return order?.data?.map((orderItem, orderIndex) => {
      const productPrice = orderItem.price;
      grandTotal = grandTotal + productPrice;
      return (
        <Order
          key={orderIndex}
          orderItem={orderItem}
          handleDeleteOrderItem={handleDeleteOrderItem}
        />
      );
    });
  }

  return (
    <>
      <div className="list__container">
        <div className="list__container_top">
          <h3>FA Restaurant</h3>

          <div className="list__container_filter">
            <h3>Filter</h3>

            <div className="list__container_filter_list">
              <div className="list__container_filter_list_item">
                <h3>Name</h3>
                <input
                  type="text"
                  placeholder="Item's name...."
                  onChange={(e) => setSearchKeyName(e.target.value)}
                />

                {/* <p>{minError ? "Độ dài không được dài quá 3 ký tự" : ""}</p> */}
              </div>
              <div className="list__container_filter_list_item">
                <h3>Category</h3>
                <select
                  name=""
                  id=""
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {renderSelecOption()}
                </select>
              </div>
              <div className="list__container_filter_list_item">
                <h3>Min Prices</h3>
                <input
                  type="text"
                  placeholder="From"
                  onChange={(e) => setMinPriceKey(e.target.value)}
                />
              </div>
              <div className="list__container_filter_list_item">
                <h3>Max Prices</h3>
                <input
                  type="text"
                  placeholder="To"
                  onChange={(e) => setMaxPriceKey(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="list__container_menu">
            <h3>1.Menu</h3>

            <table
              className="list__container_menu_table"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              {renderMenu()}
            </table>
          </div>

          <div className="list__container_order">
            <h3>2.Order</h3>

            <table
              className="list__container_order_table"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              {renderOrder()}
            </table>
            <div className="grand__total">
              <p>Total: $ {grandTotal}</p>
              <button>Place order</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default List;
