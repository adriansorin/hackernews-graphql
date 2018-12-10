const { GraphQLServer } = require("graphql-yoga")
const { Prisma } = require('prisma-binding')

const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: (root, args, context, info) => {
			return context.db.query.links({}, info);
		}
		// link: (root, args) => links.find(link => link.id === args.id)
	},
	Mutation: {
		post: (root, args, context, info) => {
			return context.db.mutation.createLink(
				{
					data: {
						url: args.url,
						description: args.description
					}
				},
				info
			);
		}
		/*updateLink: (root, args) => {
			const elem = links.findIndex(link => link.id === args.id)
			links[elem].url = args.url
			links[elem].description = args.description
			return links.find(link => link.id === args.id)
		},
		deleteLink: (root, args) => {
			links.splice(links.findIndex(link => link.id === args.id),1)
			return links.length > 0 ? links.find(link => link.id === args.id) : null
		}*/
	}
};

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers,
	context: req => ({
		...req,
		db: new Prisma({
			typeDefs: "src/generated/prisma.graphql",
			endpoint: "http://localhost:4466",
			secret: "mysecret123",
			debug: true
		})
	})
});

server.start({ port: 5000 }, () =>
	console.log(`Server is running on http://localhost:5000`)
);
