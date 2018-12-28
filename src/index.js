const { GraphQLServer } = require("graphql-yoga")
const { prisma } = require('./generated/prisma-client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Link = require('./resolvers/Link')
const User = require('./resolvers/User')

const resolvers = {
	Query,
	Mutation,
	Link,
	User
};

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers,
	context: request => {
	    return {
	      ...request,
	      prisma,
	    }
  	},
});

server.start({ port: 5000 }, () =>
	console.log(`Server is running on http://localhost:5000`)
);
