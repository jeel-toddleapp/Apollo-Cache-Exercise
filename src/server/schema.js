import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql';

import { v4 as uuidv4 } from 'uuid';

import { books, additionalDetailsByBook } from './data';

import _ from 'lodash';

const AdditionalDetailsByBook = new GraphQLObjectType({
  name: 'AdditionalDetailsByBook',
  fields: () => ({
    id: { type: GraphQLID },
    year: { type: GraphQLString },
  }),
});

const AdditionalDetailsByBookInputType = new GraphQLInputObjectType({
  name: 'AdditionalDetailsByBookInput',
  fields: () => ({
    year: { type: GraphQLString },
  }),
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: { type: GraphQLString },

    additionalDetailsByBook: {
      type: new GraphQLList(AdditionalDetailsByBook),
      resolve: (book) => {
        return additionalDetailsByBook[book.id];
      },
    },
  }),
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: (...params) => {
    return {
      books: {
        type: new GraphQLList(BookType),
        resolve: () => {
          return books;
        },
      },
    };
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        additionalDetails: {
          type: new GraphQLList(AdditionalDetailsByBookInputType),
        },
      },
      resolve: (root, args) => {
        const book = books.find((book) => book.id === args.id);
        book.name = args.name || book.name;

        if (args.additionalDetails) {
          const additionalDetailsFormatted = args.additionalDetails.map(
            (additionalDetail, index) => {
              return {
                id: `${index + 1}`,
                ...additionalDetail,
              };
            },
          );

          additionalDetailsByBook[book.id] = additionalDetailsFormatted;
        }

        return book;
      },
    },
  },
});

var schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

export default schema;
