const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        name: String,
        surname: String,
        email: String,
        unit: String,
        projectName: {type:String, unique: true},
        projectPurpose: String,
        projectDetails: String,
        image: String,
        date: String,
        status: Boolean
    },
    {
        collection:"Project"
    }
);

const project = mongoose.model("Project",ProjectSchema);

module.exports = project;