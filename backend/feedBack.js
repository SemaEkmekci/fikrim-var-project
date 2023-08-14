const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
    {
        name:  String,
        surname: String,
        email: String,
        unit: String,
        projectName: String,
        projectStatus: String,
        projectFeedbackMessage: String,
        meetingPlace: String,
        date: String,
        time: String,
        feedbackDate: String,
        feedbackTime: String
    },
    {
        collection:"Feedback"
    }
);

const feedback = mongoose.model("Feedback",FeedbackSchema);

module.exports = feedback;