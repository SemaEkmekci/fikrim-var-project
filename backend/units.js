const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema(
    {
        unitName: {type:String, unique: true},
        unitManager: Boolean
        
    },{
        collection:"Units"
    }
);

const units = mongoose.model("Units",UnitSchema);

module.exports = units;