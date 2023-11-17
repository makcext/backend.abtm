import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connect } from "mongoose";
import Book from "../models/book.js";
import User from "../models/user.js"; // Import User model
import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken'; // For token generation

const MONGODB = 'mongodb+srv://root:root@atlascluster.g9bnlyp.mongodb.net/?retryWrites=true&w=majority';

const typeDefs = `#graphql
type Book {
	_id: String
	author: String
	title: String
	year: Int
}

type User {
	_id: ID!
	email: String!
	password: String
}

input BookInput {
	author: String
	title: String
	year: Int
}

input UserInput {
	email: String!
	password: String!
}

type Query {
	getBook(ID: ID!): Book!
	getBooks(limit: Int): [Book]
}

type Mutation {
	createBook(bookInput: BookInput): String!
	updateBook(ID: ID!, bookInput: BookInput): String!
	deleteBook(ID: ID!): String!
	register(userInput: UserInput): String! 
	login(email: String!, password: String!): String! 
}
`;

const resolvers = {
	Query: {
		async getBook(_, { ID }) {
			return await Book.findById(ID);
		},
		async getBooks(_, { limit }) {
			return await Book.find().limit(limit);
		}
	},
	Mutation: {
		async createBook(_, { bookInput: { author, title, year } }) {
			const res = await new Book({ author, title, year }).save();
			return res._id;
		},
		async updateBook(_, { ID, bookInput: { author, title, year } }) {
			await Book.updateOne({ _id: ID }, { $set: { author, title, year } });
			return ID;
		},
		async deleteBook(_, { ID }) {
			await Book.deleteOne({ _id: ID });
			return ID;
		},
		async register(_, { userInput: { email, password } }) {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				throw new Error('User already exists');
			}
			const hashedPassword = await bcrypt.hash(password, 12);
			const user = new User({ email, password: hashedPassword });
			await user.save();
			return jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', { expiresIn: '1h' });
		},
		async login(_, { email, password }) {
			const user = await User.findOne({ email });
			if (!user) {
				throw new Error('User does not exist');
			}
			const isEqual = await bcrypt.compare(password, user.password);
			if (!isEqual) {
				throw new Error('Password is incorrect');
			}
			return jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', { expiresIn: '1h' });
		}
	}
};

async function startServer() {
	try {
		await connect(MONGODB);

		const server = new ApolloServer({
			typeDefs,
			resolvers,
			introspection: true, // enables introspection in non-production environments
		});

		const port = Number(process.env.PORT || '4000');

		const { url } = await startStandaloneServer(server, {
			listen: { port: port }
		});

		console.log(`🚀 Server ready at ${url}`);
	} catch (error) {
		console.error(`Error starting server: ${error}`);
	}
}

startServer();