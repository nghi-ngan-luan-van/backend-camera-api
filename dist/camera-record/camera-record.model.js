"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.CameraRecordSchema = new mongoose.Schema({
    cameraID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timeStart: String,
    timeEnd: String,
    cdnUrl: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});
//# sourceMappingURL=camera-record.model.js.map