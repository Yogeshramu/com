const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect("mongodb+srv://jack:QHpwoVO87xgcekFH@cluster0.chfrxhe.mongodb.net/crm")
  .then(async () => {
    console.log("Connected to MongoDB");
    
    // Create default user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const user = new User({
      username: "admin",
      password: hashedPassword,
      name: "Administrator"
    });
    
    await user.save();
    console.log("Default user created:");
    console.log("Username: admin");
    console.log("Password: admin123");
    
    mongoose.connection.close();
  })
  .catch(err => console.error("Error:", err));