"use strict";

const discount = require("../discount.model");
const { getSelectData, getUnselectData } = require("../../utils");

const createNewDiscount = async ({
  code,
  start_date,
  end_date,
  is_active,
  shopId,
  min_order_value,
  product_ids,
  applies_to,
  name,
  description,
  type,
  value,
  max_value,
  users_used,
  max_uses,
  uses_count,
  max_uses_per_user,
}) => {
  return await discount.create({
    discount_name: name,
    discount_description: description,
    discount_type: type,
    discount_code: code,
    discount_value: value || 0,
    discount_max_value: max_value || 0,
    discount_min_order_value: min_order_value,
    discount_users_used: users_used, // ?? max_value
    discount_start_date: new Date(start_date),
    discount_end_date: new Date(end_date),
    discount_max_uses: max_uses,
    discount_uses_count: uses_count,
    discount_shopId: shopId,
    discount_max_uses_per_user: max_uses_per_user,
    discount_is_active: is_active,
    discount_applies_to: applies_to,
    discount_product_ids: product_ids,
  });
};

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnselectData(unSelect))
    .lean();

  return documents;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return documents;
};

const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};
module.exports = {
  createNewDiscount,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
};
