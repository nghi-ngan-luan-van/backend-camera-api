"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.CameraSchema = new mongoose.Schema({
    name: { type: String, default: null },
    ip: { type: String, default: null },
    port: { type: Number, default: null },
    rtspUrl: { type: String, default: null },
    username: { type: String, default: null },
    password: { type: String, default: null },
    backupMode: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});
//# sourceMappingURL=camera.model.js.map