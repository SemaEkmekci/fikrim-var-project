const express = require("express");
const app = express();
// const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const { tokenChecker } = require("./middlewares/checkToken.middleware");

app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));
require("dotenv").config();

const User = require("./user");
const Unit = require("./units")
const Project = require("./project");
const Feedback = require("./feedBack");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Veritabanına Bağlanıldı");
  })
  .catch((e) => console.log(e));


const sendMail = async (to, subject, text) => {
  console.log(to, subject, text);
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secureConnection: false,
    auth: {
      user: "deneme12309@outlook.com.tr",
      pass: "abcd.15987",
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  const mailOptions = {
    from: "deneme12309@outlook.com.tr",
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log(error);
  }
};

app.post("/signup", async (req, res) => {
  const { name, surname, email, password, role, mailVerification, unit } = req.body;
  const encryitedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.send({ error: "Email Kayıtlı" });
    }
    await User.create({
      userName: name,
      userSurname: surname,
      password: encryitedPassword,
      email: email,
      role: role,
      unit: unit,
      mailVerification: mailVerification,
    });
    if(role === "unitManager"){

      const unitUpdate = await Unit.findOne({ unitName: unit });
      console.log(unitUpdate);

      try {
        unitUpdate.unitManager = true;
        await unitUpdate.save();
      } catch (err) {
        console.log(err);
      }
      
      const to = email;
      const subject = "FİKRİM VAR BİRİM SORUMLUSU HESABI";
      const text = `Hesabınız oluşturulmuştur.`;
      sendMail(to, subject, text);


    }
    res.send({ status: "ok"});
  } catch (err) {
    res.send({ status: "error" });
  }
});


app.post("/newUnit", async (req, res) => {
  const { unitName, unitManager } = req.body;

  try {
    const oldUnit = await User.findOne({ unitName });

    if (oldUnit) {
      return res.send({ error: "Birim Kayıtlı" });
    }
    await Unit.create({
      unitName: unitName,
      unitManager: unitManager
    });
    res.send({ status: "ok"});
  } catch (err) {
    res.send({ status: "error" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "Kullanıcı bulunamadı" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET
    );

    return res.json({ status: "ok", data: token, role: user.role });
  } else {
    return res.json({ status: "error", error: "Geçersiz Şifre" });
  }
});






app.post("/homePage", tokenChecker, async (req, res) => {
  try {
    console.log(req.body.user);
    const useremail = req.body.user.email;
    console.log(useremail);
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {
    res.send({ status: "false", data: error });
    console.log("false");
  }
});

app.post("/feedBack",async (req, res) => {
  const {
    name,
    surname,
    email,
    unit,
    projectName,
    projectStatus,
    projectFeedbackMessage,
    datePlace,
    date,
    time,
    feedbackDate,
    feedbackTime
  } = req.body;
  console.log(
    name,
    surname,
    email,
    unit,
    projectName,
    projectStatus,
    projectFeedbackMessage,
    datePlace,
    date,
    time,
    feedbackDate,
    feedbackTime
  );
  console.log(date);

  const projectOwner = await User.findOne({ email });

  try {
    await Feedback.create({
      name: name,
      surname: surname,
      email: email,
      unit: unit,
      projectName: projectName,
      projectStatus: projectStatus,
      projectFeedbackMessage: projectFeedbackMessage,
      meetingPlace: datePlace,
      date: date,
      time:time,
      feedbackDate,
      feedbackTime: feedbackTime
    });

    const to = projectOwner.email;
    const subject = "FİKRİM VAR BİR MESAJINIZ VAR";
    const text = "PROJE FİKRİNİZE GERİ DÖNÜŞ YAPILDI.";

    sendMail(to, subject, text);
    res.send({ status: "ok" });
  } catch (err) {
    console.error(err);
    console.error("Proje gönderme işlemi sırasında bir hata oluştu:", err);
    res.send({ status: "error", error: err.message });
  }
});



app.post("/projectInfo",async (req, res) => {
  const {
    name,
    surname,
    email,
    unit,
    projectName,
    projectPurpose,
    projectDetails,
    image,
    date,
    status,
  } = req.body;
  console.log(
    name,
    surname,
    email,
    unit,
    projectName,
    projectPurpose,
    projectDetails,
    image
  );
  console.log(date);

  const unitManager = await User.findOne({ unit });

  try {
    await Project.create({
      name: name,
      surname: surname,
      email: email,
      unit: unit,
      projectName: projectName,
      projectPurpose: projectPurpose,
      projectDetails: projectDetails,
      image: image,
      date: date,
      status: status,
    });

    const to = unitManager.email;
    const subject = "FİKRİM VAR Yeni Bir Proje Fikri Bildirimi";
    const text = "Biriminize yapılan yeni bir proje fikri başvurunuz var.";

    sendMail(to, subject, text);
    res.send({ status: "ok" });
  } catch (err) {
    console.error(err);
    console.error("Proje gönderme işlemi sırasında bir hata oluştu:", err);
    res.send({ status: "error", error: err.message });
  }
});

app.post("/updateProject", async (req, res) => {
  const {
    updatedProject,
    unit,
    projectName,
    projectPurpose,
    projectDetails,
    image,
  } = req.body;
  console.log("150");
  console.log(unit, projectName, projectPurpose, projectDetails, image);
  console.log(updatedProject);
  const updateProject = await Project.findOne({ projectName: updatedProject });
  console.log(updateProject, "Update Project");
  try {
    updateProject.unit = unit;
    updateProject.projectName = projectName;
    updateProject.projectPurpose = projectPurpose;
    updateProject.projectDetails = projectDetails;
    updateProject.image = image;
    await updateProject.save();
    res.send({ status: "Ok", data: "Update" });
  } catch (err) {
    console.log(err);
    res.json({ status: "Update Error" });
  }
});

app.post("/updateUser", async (req, res) => {
  const {
    updatedUser,
    userName,
    userSurname,
    email,
  } = req.body;
  
  console.log(updatedUser, userName, userSurname, email);
  let mailChange = "false";
  const updateUser = await User.findOne({ email: updatedUser });
  console.log(updateUser, "Update User");
  try {
    updateUser.userName = userName;
    updateUser.userSurname = userSurname;
    if(updateUser.email !== email){
      updateUser.email = email;
      updateUser.mailVerification = false;
      mailChange = "true";
    }
    console.log(mailChange);
    await updateUser.save();
    
    try {
      const projects = await Project.find({ email: updatedUser });
      const FeedBack = await Feedback.find({ email: updatedUser });
      for (const project of projects) {
        project.email = email;
        project.name = userName;
        project.surname = userSurname; 
        await project.save();
      }
      for (const feed of feedBack) {
        feed.email = email;
        feed.name = userName;
        feed.surname = userSurname; 
        await feed.save();
      }
      // console.log(projects);
    } catch (err) {
      console.log("Proje güncelleme hatası:", err.message);
    }
    res.send({ status: "ok", data: mailChange});
  } catch (err) {
    if (err.code === 11000) {
      console.log("Bu e-posta adresi zaten kullanılıyor.");
      res.json({ status: "Update Error", error: "Mail Error" });
    } else {
      console.log("Genel bir hata oluştu:", err.message);
      res.json({ status: "Update Error", error: "Genel bir hata oluştu." });
    }
  }
});

app.post("/updateStatus", async (req, res) => {
  const { projectName } = req.body;
  console.log(projectName);
  const updateProject = await Project.findOne({ projectName: projectName });
  try {
    updateProject.status = true;
    await updateProject.save();
    res.send({ status: "Ok", data: "Update" });
  } catch (err) {
    console.log(err);
    res.json({ status: "Update Error" });
  }
});

app.post("/deleteProject", async (req, res) => {
  const { projectName } = req.body;
  try {
    const readProject = await Project.findOne({ projectName });
    console.log(readProject, "Delete Proje");
    await Project.deleteOne({ projectName: projectName });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/deleteManager", async (req, res) => {
  const { managerMail, unit } = req.body;
  try {
    const readManager = await User.findOne({ email:managerMail });
    console.log(readManager, "Delete Manager");
    await User.deleteOne({ email: managerMail });
    const unitUpdate = await Unit.findOne({ unitName: unit });
      console.log(unitUpdate);

      try {
        unitUpdate.unitManager = false;
        await unitUpdate.save();
      } catch (err) {
        console.log(err);
      }
    res.send({ status: "Ok", data: "Deleted" });
  } catch (err) {
    console.log(err);
  }
});


app.post("/mailVerification", tokenChecker, async (req, res) => {
  const email = req.body.user.email;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "error" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "30m",
    });
    console.log("142");
    const link = `http://localhost:5000/mailVerification/${oldUser._id}/${token}`;

    const to = email;
    const subject = "Mail Doğrulama";
    const text = link;

    sendMail(to, subject, text);
    res.json({ status: "ok" });

    console.log(link);
  } catch (err) {
    console.log(err);
  }
});

app.get("/mailVerification/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "Kullanıcı Bulunamadı" });
  }
  console.log(oldUser);
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          mailVerification: "true",
        },
      }
    );
    res.render("mailVerification", { email: verify.email, status: "Ok" });
  } catch (err) {
    console.log(err);
    res.send("No");
  }
});

app.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "error" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "30m",
    });
    console.log("142");
    const link = `http://localhost:5000/resetPassword/${oldUser._id}/${token}`;
    const to = email;
    const subject = "Parola Sıfırlama";
    const text = link;

    sendMail(to, subject, text);
    res.json({ status: "ok" });

    console.log(link);
  } catch (err) {
    console.log(err);
  }
});

app.get("/resetPassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "Kullanıcı Bulunamadı" });
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
    // res.send({status:"ok"});
  } catch (err) {
    console.log(err);
    res.send("No");
  }
});

app.post("/resetPassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "Kullanıcı Bulunamadı" });
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryitedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryitedPassword,
        },
      }
    );
    // res.json({status: "verified", message: "Şifre Güncellendi"});
    res.render("index", { email: verify.email, status: "Verified" });
    // res.send({status: "ok"});
  } catch (err) {
    console.log(err);
    res.json({ status: "Hata" });
  }
});

app.get("/getProjectIdea", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const useremail = user.email;
    // console.log(user, "KULLANICI");

    const userData = await User.findOne({ email: useremail });
    if (!userData) {
      return res.send({ status: "error", message: "Kullanıcı bulunamadı" });
    }
    const userunit = userData.get("unit");
    // console.log(userunit);

    const projects = await Project.find({ unit: userunit });

    res.send({ status: "ok", data: projects });
    // console.log(projects);
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "error", message: "Sunucu hatası" });
  }
});

app.get("/getProjectInfo", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(user,"USEEEER");
    const useremail = user.email;
    const projects = await Project.find({ email: useremail });
    res.send({ status: "ok", data: projects });
    //  console.log(projects);
  } catch (err) {
    res.status(500).send({ status: "error", message: "Sunucu hatası" });
  }
});



app.get("/getUnit", async (req, res) => {
  try {
    const units = await Unit.find();
    res.send({ status: "ok", data: units});
  } catch (err) {
    res.status(500).send({ status: "error", message: "Sunucu hatası" });
  }
});


app.get("/getUnitManagerInfo", async (req, res) => {
  try {
    const unitManagers = await User.find({ role: "unitManager" });
    res.send({ status: "ok", data: unitManagers });
    //  console.log(projects);
  } catch (err) {
    res.status(500).send({ status: "error", message: "Sunucu hatası" });
  }
});

app.get("/getFeedbackInfo", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(user,"USEEEER");
    const useremail = user.email;
    const feedback = await Feedback.find({ email: useremail });
    res.send({ status: "ok", data: feedback });
     console.log(feedback);
  } catch (err) {
    res.status(500).send({ status: "error", message: "Sunucu hatası" });
  }
});


app.listen(5000, () => {
  console.log("Server Çalışıyor");
});
