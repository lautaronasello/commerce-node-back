import mongoose, { model } from 'mongoose';

const ObjectID = mongoose.Schema.Types.ObjectId;

const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    user: {
      type: ObjectID,
      required: true,
      ref: 'User',
    },
    items: [
      {
        itemId: {
          type: ObjectID,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: [true, 'Se debe indicar el nombre del producto.'],
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: Number,
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = model('Cart', cartSchema);

export default Cart;
