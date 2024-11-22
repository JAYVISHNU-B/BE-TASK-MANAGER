import Task from '../models/tmodel.js';
import User from '../models/umodel.js';
import Comment from '../models/comments.js';
import nodemailer from "nodemailer";
import sendEmail from '../middlewares/emailhelper.js';


// Create task
export const createTask = async (req, res) => {
  let imageUrl = "";
  //if file uploaded then upload to cloudinary
  if(req.file && req.file.path){
    imageUrl= req.file.path;
  }
  
  const {_id, title, description, deadline, priority, status, category, assignedTo } = req.body;
  try {
    const task = new Task({ title, description, deadline, priority, status, category, assignedTo, image: imageUrl });
    await task.save();

    // Send email notification
    const user = await User.findById(assignedTo);
    if (!_id){
    sendEmail({to: user.email,subject: "New Task Assigned", text: `You have been assigned a new task: ${title}`});
  }
  else{
     sendEmail({to: user.email,subject: "Task Updated", text: `Your task "${title}" has been updated`});
   
  }
    
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);

  }
};

export const fetchAllUsers = async (req, res) => {
  
  try {
    const user = await User.find();    
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);

  }
};

export const fetchAllTask = async (req, res) => {
  
  try {
    const task = await Task.find();    
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);

  }
};

// Update task
export const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { title, description, deadline, priority, status, category, assignedTo } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(taskId, { title, description, deadline, priority, status, category, assignedTo }, { new: true });
    if (!task) return res.status(404).send('Task not found');
    
    // Send email notification for task update
    const user = await User.findById(assignedTo);
    sendEmail(user.email, 'Task Updated', `Your task "${title}" has been updated`);
    const transporter = nodemailer.createTransport({
      //Gmail or yahoo or outlook
      service: "Gmail",
      auth: {
        user: process.env.PASS_MAIL,
        pass: process.env.PASS_KEY,
      },
    });
    const mailOptions = {
      from: process.env.PASS_MAIL,
      to: user.email,
      subject: "Task Updated",
      text: `Your task "${title}" has been updated`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error in sending the mail" });
      } else {
        res.status(200).json({ message: "Email Sent Successfully" });
      }
    });
  
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).send('Task not found');
    res.status(200).send('Task deleted');
  } catch (err) {
    res.status(400).send(err);
  }
};

// Add comment to task
export const addComment = async (req, res) => {
  const { taskId, userId, content } = req.body;
  try {
    const comment = new Comment({ userId, content });
    await comment.save();

    const task = await Task.findById(taskId);
    task.comments.push(comment._id);
    await task.save();

    res.status(200).send(comment);
  } catch (err) {
    res.status(400).send(err);
  }
};
