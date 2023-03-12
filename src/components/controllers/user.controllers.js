import User from '../../database/schemas/user.schema.js';

//Crea un usuario nuevo
export const singUpUser = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

//Conecta al usuario a su cuenta ya creada
export const singInUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json(error);
  }
};

//cierra la sesion actual
export const logoutUser = async (req, res) => {
  try {
    //elimina el token que se esta deslogueando
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    //guarda el array de tokens sin el que se elimino
    await req.user.save();
    res.status(200).json('El usuario se desconecto con éxito.');
  } catch (error) {
    res.status(500).send();
  }
};

//cierra todas las sesiones activas del usuario
export const logoutAllUsers = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    req
      .status(200)
      .json('Se cerraron todas las sesiones activas de tu cuenta.');
  } catch (error) {
    res.status(500).json(error);
  }
};
