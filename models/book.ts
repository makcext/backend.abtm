import e from 'express';
import {Schema, model} from 'mongoose';

interface IBook {
	id?: String,
	author: String,
	title: String,
	year: Number,
}

const bookSchema = new Schema<IBook>({
	id: String,
	author: {type: String, required: true},
	title: {type: String, required: true},
	year: {type: Number, required: true},

});

const Book = model<IBook>('books', bookSchema);

export default Book;