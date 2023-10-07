import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connect } from "mongoose";
import Book from "../models/book.js";

const MONGODB = 'mongodb+srv://root:root@atlascluster.g9bnlyp.mongodb.net/books?retryWrites=true&w=majority';

const typeDefs = `#graphql
	type Book {
		_id: String
		author: String
		title: String
		year: Int
	}
`;