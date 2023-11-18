//book.ts 
import { Schema, model } from 'mongoose';
const bookSchema = new Schema({
    id: String,
    author: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});
const Book = model('books', bookSchema);
export default Book;
