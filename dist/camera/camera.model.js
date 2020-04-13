"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.CameraSchema = new mongoose.Schema({
    name: String,
    ip: String,
    port: String,
    rtspUrl: String,
    username: String,
    password: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});
//# sourceMappingURL=camera.model.js.map