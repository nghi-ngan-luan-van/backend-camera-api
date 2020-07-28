"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose = require("mongoose");
const randomstring = require('randomstring');
exports.UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    resetToken: { type: String, default: randomstring.generate(7) },
    resetExpires: { type: Number, default: Date.now() }
});
//# sourceMappingURL=user.model.js.map