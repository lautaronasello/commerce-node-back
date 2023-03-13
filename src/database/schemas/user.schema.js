import mongoose, { model } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value.toLowerCase().includes(' ')) {
          throw new Error('La contraseña no debe contener espacios en blanco.');
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('El email no es valido');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('contraseña')) {
          throw new Error(
            'La contraseña no debe contener la palabra contraseña.'
          );
        }
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: [true, 'El token es requerido.'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//genera el jwt y lo guarda en el array de tokens
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//funcion estatica que busca al usuario basado en el email y compara la contraseña
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('El mail ingresado no existe.');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('La contraseña no es correcta.');
  }
  return user;
};

//middleware previo a guardar encripta la contraseña a la hora de crearla
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = model('User', userSchema);

export default User;
