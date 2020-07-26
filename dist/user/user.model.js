"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const randomstring = require('randomstring');
exports.UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    resetToken: { type: String, default: randomstring.generate(7) },
    resetExpires: { type: Date, default: Date.now() }
});
//# sourceMappingURL=user.model.js.map