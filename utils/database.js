import mongoose from 'mongoose';
let MONGO_URI = process.env.MONGO_URI;
let MONGO_DB = process.env.MONGO_DB;

const connection = {};

const disconnect = async () => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("failed to disconnect");
      return;
    }
  }
};

const connectToDB = async () => {
  try {
    if (connection.isConnected) return;
    if (mongoose.connections.length > 0) {
      connection.isConnected = mongoose.connections[0].readyState;
      if (connection.isConnected === 1) return;
      await mongoose.disconnect();
      // (property) Connection.readyState: number Connection ready state | 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    };
    const db = await mongoose.connect(MONGO_URI, {
      // useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndMinify: false,
      // useUnifiedTopology: true
    });
    console.log("MongoDB Connected....")
    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
const db = { connectToDB, disconnect };
export default db;