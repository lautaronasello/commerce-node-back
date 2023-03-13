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

export const getUserById = async (req, res) => {
  const { idUser } = req.body;
  try {
    const user = await User.findById(idUser);
    if (!user) return res.status(204).json([]);
    res.send(user);
    console.log(user);
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};

export const getAllUsers = async (req, res) => {
  const { page, rowsPerPage, orderBy, order } = req.body;
  try {
    let sort = {};
    if (req.query.sortBy) {
      //Divides query on column and orderBy
      const str = req.query.sortBy.split(':');
      if (str[0] !== 'null') {
        sort[str[0]] = str[1] === 'desc' ? -1 : 1;
      } else {
        sort = { createdAt: -1 };
      }
    }
    console.log(sort);
    //Filters by active product
    const users = await User.find()
      .sort(sort)
      .skip(page * rowsPerPage)
      .limit(rowsPerPage);

    //Brings all products for total rows pagination
    const totalUsers = await User.find();

    //object structure for response
    const response = {
      rowsPerPage,
      page: page + 1,
      orderBy,
      order,
      totalRows: totalUsers.length,
      rows: users,
    };

    res.status(200).json(response);
  } catch (e) {
    if ((e.name = 'ValidatorError')) {
      res.status(409).json(e.message);
    } else {
      res.status(500).json(e);
    }
  }
};
