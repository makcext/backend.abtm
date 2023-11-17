import { Schema, model } from 'mongoose';
const bookSchema = new Schema({
    id: String,
    author: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});
const Book = model('books', bookSchema);
export default Book;
