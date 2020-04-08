"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
});
//# sourceMappingURL=user.model.js.map