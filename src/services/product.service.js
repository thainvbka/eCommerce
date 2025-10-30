"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProductById,
  findByIdAndUpdate,
} = require("../models/repositories/product.repo");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { removeUndefinedObject, updateNestedObject } = require("../utils");
class ProductFactory {
  static productRegistry = {}; //key: type, value: class

  static registerProductType(type, cls) {
    ProductFactory.productRegistry[type] = cls;
  }

  static async createProduct(type, payload) {
    const ProductClass = ProductFactory.productRegistry[type];
    if (!ProductClass) {
      throw new BadRequestError("Invalid product type");
    }
    const productInstance = new ProductClass(payload);
    return await productInstance.createProduct();
  }

  static async updateProduct(type, product_id, payload) {
    const ProductClass = ProductFactory.productRegistry[type];
    if (!ProductClass) {
      throw new BadRequestError("Invalid product type");
    }
    const productInstance = new ProductClass(payload);
    return await productInstance.updateProduct(product_id);
  }

  // static async createProduct(type, payload) {
  //   switch (type) {
  //     case "clothing":
  //       return new Clothing(payload).createProduct();
  //     case "electronic":
  //       return new Electronic(payload).createProduct();
  //     default:
  //       throw new BadRequestError("Invalid product type");
  //   }
  // }
  // query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishedForShop({ query, limit, skip });
  }

  static findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static findProductById({ product_id }) {
    return findProductById({ product_id, unselect: ["__v"] });
  }

  static async searchProductsByUser({ keySearch, limit = 50, skip = 0 }) {
    return await searchProductsByUser({ keySearch, limit, skip });
  }

  //put
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
}

//define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });

    if (newProduct) {
      await insertInventory({
        inven_productId: newProduct._id,
        inven_stock: this.product_quantity,
        inven_shopId: this.product_shop,
      });
    }

    return newProduct;
  }

  async updateProduct(product_id, payload) {
    return await findByIdAndUpdate({ product_id, payload, model: product });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new clothing error");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new product error");
    return newProduct;
  }

  async updateProduct(product_id) {
    // 1. Tạo object chứa các thuộc tính riêng của Clothing
    const objectParams = removeUndefinedObject(this);
    const clothingPayload = removeUndefinedObject(
      objectParams.product_attributes
    );

    // 2. Cập nhật collection `clothes` nếu có thay đổi
    if (Object.keys(clothingPayload).length > 0) {
      await findByIdAndUpdate({
        product_id,
        payload: clothingPayload, // Không cần flatten ở đây
        model: clothing,
      });
    }

    // 3. Tạo object chứa các thuộc tính chung của Product
    // và flatten các thuộc tính của clothing vào product_attributes
    const productPayload = updateNestedObject(objectParams);

    // 4. Cập nhật collection `Products`
    const updateProduct = await super.updateProduct(product_id, productPayload);
    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create new furniture error");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new product error");
    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new product error");
    return newProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
