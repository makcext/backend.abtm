//index.ts
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
	_id: ID!
	userId: String!
	author: String!
	title: String!
	year: Int!
}

type User {
	_id: ID!
	email: String!
	password: String
	books: [Book]
}

type AuthData {
	userId: ID!
	token: String!
	tokenExpiration: Int!
}

input BookInput {
	userId: String!
	author: String!
	title: String!
	year: Int!
}

input UserInput {
	email: String!
	password: String!
}

type Query {
	getBook(ID: ID!): Book!
	getBooks(limit: Int): [Book]
	getUserBooks(userId: ID!): [Book]
}

type Mutation {
	createBook(bookInput: BookInput): String!
	updateBook(ID: ID!, bookInput: BookInput): String!
	deleteBook(ID: ID!): String!
	register(userInput: UserInput): String! 
	login(email: String!, password: String!): AuthData! 
}
`;
const resolvers = {
    Query: {
        async getBook(_, { ID }) {
            return await Book.findById(ID);
        },
        async getBooks(_, { limit }) {
            return await Book.find().limit(limit);
        },
        async getUserBooks(_, { userId }) {
            return await Book.find({ userId });
        },
    },
    User: {
        async books(user) {
            return await Book.find({ userId: user._id });
        },
    },
    Mutation: {
        async createBook(_, { bookInput: { userId, author, title, year } }) {
            const res = await new Book({ userId, author, title, year }).save();
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
            console.log(user);
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
            const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', { expiresIn: '1h' });
            return {
                userId: user.id,
                token: token,
                tokenExpiration: 1
            };
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
    }
    catch (error) {
        console.error(`Error starting server: ${error}`);
    }
}
startServer();
