import mongoose from 'mongoose';
const connection = mongoose.connect('mongodb://127.0.0.1:27017/userTodo')
  .then(() => {
    console.log("Connected successfully to the database");
  })
  .catch((error: Error) => {
    console.error("Error connecting to the database:", error);
  });

export default connection;
