const { GraphQLServer } = require('graphql-yoga')

let links = [{
	id: 'link-0',
	url: 'www.udemy.com',
	description: 'All sorts of tutorials'
}] 

let idCount = links.length

const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: () => links,
		link: (root, args) => links.find(link => link.id === args.id)
	},
	Mutation: {
		post: (root, args) => {
			const link = {
				id: `link-${idCount++}`,
				description: args.description,
				url: args.url,
			}
			links.push(link)
			return link
		},
		updateLink: (root, args) => {
			const elem = links.findIndex(link => link.id === args.id)
			links[elem].url = args.url
			links[elem].description = args.description
			return links.find(link => link.id === args.id)
		},
		deleteLink: (root, args) => {
			links.splice(links.findIndex(link => link.id === args.id),1)
			return links.length > 0 ? links.find(link => link.id === args.id) : null
		}
	}
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
})

server.start({port: 5000}, () => console.log(`Server is running on http://localhost:5000`))