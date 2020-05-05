"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.CameraMotionSchema = new mongoose.Schema({
    cameraUrl: String,
    filePath: String,
    timeStart: String,
    timeEnd: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});
//# sourceMappingURL=camera-motion.model.js.map