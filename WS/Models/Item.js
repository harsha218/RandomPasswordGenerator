import mongoose from 'mongoose';
const { Schema } = mongoose;

const ItemSchema = new Schema({
  author: {type: String, required: true },
  name: {type: String, required: true },
  url: {type: String},
  type: {type: String, enum: ['word', 'password'], default: 'password'},
  comment: {type: String}
});

const Item = mongoose.model('Item', ItemSchema);

export default Item