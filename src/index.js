const { GraphQLServer } = require("graphql-yoga")
const { prisma } = require('./generated/prisma-client')

const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: (root, args, context, info) => {
			return context.prisma.links()
		}
	},
	Mutation: {
		post: (root, args, context, info) => {
			return context.prisma.createLink({
				url: args.url,
				description: args.description
			})
		},
		update: (root, args, context, info) => {
			return context.prisma.updateLink({
				data: {
					url: args.url,
					description: args.description
				}, 
				where: {
					id: args.id 
				}
			})
		},
		delete: (root, args, context, info) => {
			return context.prisma.deleteLink({
				id: args.id 
			})
		}
	}
};

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers,
	context: { prisma }
});

server.start({ port: 5000 }, () =>
	console.log(`Server is running on http://localhost:5000`)
);
