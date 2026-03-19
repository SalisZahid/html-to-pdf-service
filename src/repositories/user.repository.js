import { User } from "../models/user.model.js";

export const userRepository = {
  create(data) {
    return User.create(data);
  },

  findById(id) {
    return User.findById(id);
  },

  findByEmail(email) {
    return User.findOne({ email }).select("+password");
  },

  findAll(filter = {}, options = {}) {
    const { limit = 20, page = 1 } = options;
    return User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
  },

  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async deleteById(id) {
    return User.findByIdAndDelete(id);
  },
};

