const { v4: uuidv4 } = require("uuid");
const { items } = require("../data/store");

const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const validateItem = ({ name, category, quantity, price }) => {
  const errors = [];
  if (!name || typeof name !== "string" || name.trim() === "")
    errors.push("name wajib diisi dan harus berupa string");
  if (!category || typeof category !== "string" || category.trim() === "")
    errors.push("category wajib diisi dan harus berupa string");
  if (quantity === undefined || typeof quantity !== "number" || quantity < 0)
    errors.push("quantity wajib diisi, harus angka, dan >= 0");
  if (price === undefined || typeof price !== "number" || price < 0)
    errors.push("price wajib diisi, harus angka, dan >= 0");
  return errors;
};

const getAllItems = (req, res) => {
  const { category, search, minPrice, maxPrice, sortBy, order } = req.query;
  let result = [...items];

  if (category) {
    result = result.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (search) {
    const keyword = search.toLowerCase();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword),
    );
  }

  if (minPrice !== undefined) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) result = result.filter((item) => item.price >= min);
  }

  if (maxPrice !== undefined) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) result = result.filter((item) => item.price <= max);
  }

  const validSortFields = ["name", "price", "quantity", "createdAt"];
  if (sortBy && validSortFields.includes(sortBy)) {
    const dir = order === "desc" ? -1 : 1;
    result.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1 * dir;
      if (a[sortBy] > b[sortBy]) return 1 * dir;
      return 0;
    });
  }

  sendResponse(res, 200, true, "Data item berhasil diambil", {
    total: result.length,
    items: result,
  });
};

const getItemById = (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) {
    return sendResponse(
      res,
      404,
      false,
      `Item dengan id '${req.params.id}' tidak ditemukan`,
    );
  }
  sendResponse(res, 200, true, "Item berhasil ditemukan", item);
};

const createItem = (req, res) => {
  const errors = validateItem(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validasi gagal",
      errors,
    });
  }

  const { name, category, quantity, price } = req.body;
  const newItem = {
    id: uuidv4(),
    name: name.trim(),
    category: category.trim(),
    quantity,
    price,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  items.push(newItem);
  sendResponse(res, 201, true, "Item berhasil ditambahkan", newItem);
};

const updateItem = (req, res) => {
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return sendResponse(
      res,
      404,
      false,
      `Item dengan id '${req.params.id}' tidak ditemukan`,
    );
  }

  const errors = validateItem(req.body);
  if (errors.length > 0) {
    return res
      .status(400)
      .json({ success: false, message: "Validasi gagal", errors });
  }

  const { name, category, quantity, price } = req.body;
  items[index] = {
    ...items[index],
    name: name.trim(),
    category: category.trim(),
    quantity,
    price,
    updatedAt: new Date().toISOString(),
  };

  sendResponse(res, 200, true, "Item berhasil diperbarui", items[index]);
};

const deleteItem = (req, res) => {
  const index = items.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return sendResponse(
      res,
      404,
      false,
      `Item dengan id '${req.params.id}' tidak ditemukan`,
    );
  }

  const deleted = items.splice(index, 1)[0];
  sendResponse(res, 200, true, "Item berhasil dihapus", deleted);
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
