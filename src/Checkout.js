import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";
import { useEffect, useState, useCallback } from "react";

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const formatNumbers = (number) => {
  number = number || 0;
  return parseFloat(number).toFixed(2);
};

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  incrementProductQty,
  decrementProductQty,
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${formatNumbers(total)}</td>
      <td>
        <button
          className={styles.actionButton}
          onClick={() => incrementProductQty(id)}
          disabled={orderedQuantity >= availableCount}
        >
          +
        </button>
        <button
          className={styles.actionButton}
          onClick={() => decrementProductQty(id)}
          disabled={!orderedQuantity || orderedQuantity <= 0}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState(0);
  const [discount, setDiscount] = useState(0);

  const loadProductsHandler = async () => {
    setIsLoading(true);

    const products = await getProducts();

    setProducts(products);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProductsHandler();
  }, []);

  useEffect(() => {
    if (orderSummary > 1000) {
      setDiscount(orderSummary * 0.1);
      return;
    }

    setDiscount(0);
  }, [orderSummary]);

  const incrementProductQty = useCallback(
    (id) => {
      const clonedProducts = [...products];
      const product = clonedProducts.find((product) => {
        return product.id === id;
      });

      if (!product) {
        return;
      }

      product.orderedQuantity = product.orderedQuantity || 0;
      product.orderedQuantity = product.orderedQuantity + 1;
      product.total = product.total || 0;
      product.total = product.total + product.price;

      setProducts(clonedProducts);
      setOrderSummary((prev) => prev + product.price);
    },
    [products]
  );

  const decrementProductQty = useCallback(
    (id) => {
      const clonedProducts = [...products];
      const product = clonedProducts.find((product) => {
        return product.id === id;
      });

      if (!product) {
        return;
      }

      product.orderedQuantity = product.orderedQuantity || 0;

      if (product.orderedQuantity === 0) {
        return;
      }

      product.orderedQuantity = product.orderedQuantity - 1;
      product.total = product.total || 0;
      product.total = product.total - product.price;

      setProducts(clonedProducts);
      setOrderSummary((prev) => prev - product.price);
    },
    [products]
  );

  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        {isLoading && <LoadingIcon />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <Product
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  availableCount={product.availableCount}
                  price={product.price}
                  orderedQuantity={product.orderedQuantity}
                  total={product.total}
                  incrementProductQty={incrementProductQty}
                  decrementProductQty={decrementProductQty}
                />
              );
            })}
          </tbody>
        </table>
        <h2>Order summary</h2>
        {discount > 0 && <p>Discount: {formatNumbers(discount)}$ </p>}
        <p>Total: {formatNumbers(orderSummary - discount)}$ </p>
      </main>
    </div>
  );
};

export default Checkout;
