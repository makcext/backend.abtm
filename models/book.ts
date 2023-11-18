//book.ts 
import {Schema, model} from 'mongoose';

interface IBook {
	id?: String,
	author: String,
	title: String,
	year: Number,
	userId: Schema.Types.ObjectId,
}

const bookSchema = new Schema<IBook>({
	id: String,
	author: {type: String, required: true},
	title: {type: String, required: true},
	year: {type: Number, required: true},
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },


});

const Book = model<IBook>('books', bookSchema);

export default Book;