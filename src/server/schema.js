import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql';

import { v4 as uuidv4 } from 'uuid';

import {
  tags,
  books,
  authors,
  tagsByBook,
  additionalDetailsByBook,
} from './data';

import _ from 'lodash';

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const AdditionalDetailsByBook = new GraphQLObjectType({
  name: 'AdditionalDetailsByBook',
  fields: () => ({
    id: { type: GraphQLID },
    year: { type: GraphQLString },
    pricePerUnit: { type: GraphQLString },
    totalSell: { type: GraphQLString },
  }),
});

const AdditionalDetailsByBookInputType = new GraphQLInputObjectType({
  name: 'AdditionalDetailsByBookInput',
  fields: () => ({
    year: { type: GraphQLString },
    pricePerUnit: { type: GraphQLString },
    totalSell: { type: GraphQLString },
  }),
});

const TagType = new GraphQLObjectType({
  name: 'Tag',
  fields: {
    id: { type: GraphQLID },
    value: { type: GraphQLString },
  },
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: (book) => {
        const author = authors.find((author) => author.id === book.authorId);

        if (!author) {
          return null;
        }

        return author;
      },
    },
    tag: {
      type: TagType,
      resolve: (book) => {
        const tag = tags.find((tag) => tag.id === book.tagId);

        if (!tag) {
          return null;
        }

        return tag;
      },
    },
    tags: {
      type: new GraphQLList(TagType),
      resolve: (book) => {
        return tagsByBook[book.id];
      },
    },
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
      authors: {
        type: new GraphQLList(AuthorType),
        resolve: () => authors,
      },
    };
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateAuthor: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: (root, args) => {
        const author = authors.find((author) => author.id === args.id);
        author.name = args.name || author.name;
        author.email = args.email || author.email;
        return author;
      },
    },
    createBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        authorId: { type: GraphQLID },
        tagId: { type: GraphQLID },
      },
      resolve: (root, args) => {
        const book = {
          id: uuidv4(),
          name: args.name,
          author: args.authorId,
          tagId: args.tagId,
          __typename: 'Book',
        };
        books.push(book);
        return book;
      },
    },
    createAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: (root, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
          email: args.email,
          __typename: 'Author',
        };
        authors.push(author);
        return author;
      },
    },
    updateBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        authorId: { type: GraphQLID },
        tags: { type: new GraphQLList(GraphQLID) },
        additionalDetails: {
          type: new GraphQLList(AdditionalDetailsByBookInputType),
        },
      },
      resolve: (root, args) => {
        const book = books.find((book) => book.id === args.id);
        book.name = args.name || book.name;
        book.authorId = args.authorId || book.authorId;

        if (args.tags) {
          tagsByBook[book.id] = args.tags;
        }

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
