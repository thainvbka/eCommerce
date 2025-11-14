"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../product.model");
const {
  getSelectData,
  getUnselectData,
  convertToObjectId,
} = require("../../utils");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProducts({ query, limit, skip });
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };
  const skip = (page - 1) * limit;
  select = getSelectData(select);
  return await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()
    .exec();
};

const findProductById = async ({ product_id, unselect }) => {
  return await product
    .findById(product_id)
    .select(getUnselectData(unselect))
    .lean()
    .exec();
};

const findByIdAndUpdate = async ({
  product_id,
  payload,
  model,
  newTrue = true,
}) => {
  return await model.findByIdAndUpdate(
    product_id,
    { $set: payload }, // Bọc payload trong $set
    { new: newTrue }
  );
};

const searchProductsByUser = async ({ keySearch, limit, skip }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .populate("product_shop", "name email -_id")
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
  return results;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: product_shop,
    _id: product_id,
  });
  if (!foundProduct) return null;

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: product_shop,
    _id: product_id,
  });
  if (!foundProduct) return null;

  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const queryProducts = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const getProductById = async (product_id) => {
  return await product.findOne({ _id: convertToObjectId(product_id) }).lean();
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProductById,
  findByIdAndUpdate,
  getProductById,
};
