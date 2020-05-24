"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.HardwareCameraSchema = new mongoose.Schema({
    rtspUrl: { type: String, default: null },
});
//# sourceMappingURL=hardware-camera.model.js.map