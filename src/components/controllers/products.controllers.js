import Product from '../../database/schemas/product.schema.js';
import config from '../../config.js';

export const getProducts = async (req, res) => {
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
    //Filters by active product
    const product = await Product.find({ is_active: true })
      .sort(sort)
      .skip(page * rowsPerPage)
      .limit(rowsPerPage);

    //Brings all products for total rows pagination
    const totalProducts = await Product.find({ is_active: true });

    //object structure for response
    const response = {
      rowsPerPage,
      page: page + 1,
      orderBy,
      order,
      totalRows: totalProducts.length,
      rows: product,
    };

    res.status(200).json(response);
  } catch (e) {
    console.log('no entra');
    if ((e.name = 'ValidatorError')) {
      res.status(409).json(e.message);
    } else {
      res.status(500).json(e);
    }
  }
};

//Search coincidences and sort by the best coincidence
export const getProductSearch = async (req, res) => {
  const search = req.body.search;
  try {
    const requestedProduct = await Product.find(
      { $text: { $search: search } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
    if (!requestedProduct) return res.status(204).json([]);
    const response = {
      totalRows: requestedProduct.length,
      rows: requestedProduct,
    };
    res.status(200).json(response);
  } catch (e) {
    res.json(e);
  }
};

export const createNewProduct = async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  try {
    let requestBody = {};
    if (req.file) {
      const { filename } = req.file;
      const imgUrl = filename;
      requestBody = {
        ...req.body,
        imgUrl,
      };
    }
    const newProduct = new Product(requestBody);
    // console.log(requestBody);
    console.log('ESTE ES EL NUEVO PRODUCTO: ', newProduct);
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      {
        new: true,
      }
    );

    if (!deletedProduct) return res.status(204).json();

    res.status(200).json(deletedProduct);
  } catch (e) {
    res.json(e.message);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    if (
      req.body.id_senasa.length !== 16 ||
      req.body.device_number.length !== 8 ||
      req.body.name.length > 200
    ) {
      throw new Error('Error validación cantidad de caracteres');
    } else {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!updatedProduct) return res.status(204).json();
      res.status(200).json(updatedProduct);
    }
  } catch (e) {
    res.json(e.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const requestedProduct = await Product.findById(req.params.id);
    if (!requestedProduct) return res.status(204).json([]);
    res.send(requestedProduct);
  } catch (e) {
    res.json(e.message);
  }
};
