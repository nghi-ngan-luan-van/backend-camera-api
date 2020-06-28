"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardwareCameraSchema = void 0;
const mongoose = require("mongoose");
exports.HardwareCameraSchema = new mongoose.Schema({
    rtspUrl: { type: String, default: null },
});
//# sourceMappingURL=hardware-camera.model.js.map