import mongoose from 'mongoose';
import config from '../../config.js';
const { Schema, model } = mongoose;
const productSchema = Schema(
  {
    product_code: {
      type: String,
      required: [true, 'El codigo del producto es requerido'],
      //valida de que el campo sea completado con 10 caracteres exactos
      validate: {
        validator: (val) => {
          return val.toString().length === 10;
        },
        message: (val) => `${val.value} tiene que ser de 10 caracteres exactos`,
      },
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: [
          'accesorios',
          'braseros',
          'cruz',
          'discos',
          'planchas',
          'parrillas',
          'tablas',
          'fogoneros',
          'alquileres',
          'otros',
        ],
        lowercase: true,
        message:
          '{VALUE} no es compatible. El valor debe ser "Novillo","Toro" o "Vaquillona".',
      },
      required: [true, 'El campo tipo es requerido'],
      index: true,
    },
    name: {
      type: String,
      maxLength: [100, 'La cantidad máxima de caracteres es 100 (cien)'],
      required: [true, 'El campo nombre es requerido'],
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      default: 0,
      required: [true, 'El campo precio es requerido'],
      index: true,
    },
    imgUrl: { type: String },
    isOferta: {
      type: Boolean,
      default: false,
      index: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.is_active;
  return obj;
};

productSchema.index({ '$**': 'text' }, { name: 'textScore' });

export default model('Product', productSchema);
