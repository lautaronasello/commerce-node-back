import Cart from '../../database/schemas/cart.schema.js';
import Product from '../../database/schemas/product.schema.js';

export const getCart = async (req, res) => {
  try {
    const owner = req.user._id;
    //busqueda por id de usuario
    const cart = Cart.findOne({ owner });

    //si el carrito tiene algun item devuelve el mismo
    if (cart && cart.item.length > 0) {
      res.status(200).json(cart);
    } else {
      res.status(204);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const createCart = async (req, res) => {
  const user = req.user._id;
  const { itemId, qty } = req.body;
  try {
    const cart = await Cart.findOne({ user });
    const product = await Product.findById({ _id: itemId });
    if (!product) {
      res.status(404).json({ message: 'El item no se encuentra' });
      return;
    }

    const price = item.price;
    const name = item.name;

    //If cart already exists for user
    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.itemId === itemId);

      //add qty to the product if already exists
      if (itemIndex > -1) {
        let cartProduct = cart.items[itemIndex];
        cartProduct.qty += qty;

        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.qty * curr.price;
        }, 0);
        cart.items[itemIndex] = cartProduct;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.items.push({ itemId, name, qty, price });
        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        await cart.save();
        res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        owner,
        items: [{ itemId, name, quantity, price }],
        bill: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
