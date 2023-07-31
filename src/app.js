import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const port = 8080;
const filePath = './products.json';

app.use(express.json());

const productManager = new ProductManager(filePath);

app.get('/products', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const productId = parseInt(pid, 10);
    const { product, msg } = await productManager.getProductById(productId);
    res.json({ msg, product });
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
