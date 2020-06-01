"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.TaskSchema = new mongoose.Schema({
    idCamera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camera'
    },
    pID: { type: Number, default: null },
    cameraUrl: { type: String, default: null },
    taskType: { type: String, default: null },
    active: { type: Boolean, default: null },
});
//# sourceMappingURL=task.model.js.map