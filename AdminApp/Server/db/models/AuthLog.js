const mongoose = require('mongoose');



const AuthLogSchema = new mongoose.Schema({
    userId: {type: String, default: 'Unknown'},
    timestamp: {type: Date, default: Date.now},
    success: {type: Boolean, required: true},
    imageCapture:{
        type: String,
    }
   
});

module.exports = mongoose.model("AuthLog", AuthLogSchema);