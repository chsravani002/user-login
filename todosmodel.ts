import mongoose, { Document, Schema } from 'mongoose';

interface ITodo extends Document {
  user_id: mongoose.Types.ObjectId;
  iscompleted: boolean;
  task: string;
}

const todoschema = new Schema<ITodo>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  iscompleted: {
    type: Boolean,
    default: false,
  },
  task: {
    type: String,
    required: true,
  },
});

const Todos = mongoose.model<ITodo>('todos', todoschema);

export default Todos;