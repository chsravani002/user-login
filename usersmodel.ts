import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
}

const userschema = new Schema<IUser>({
  id: {
    type: String,
    default: () => crypto.randomUUID(),
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model<IUser>('users', userschema);

export default Users;
