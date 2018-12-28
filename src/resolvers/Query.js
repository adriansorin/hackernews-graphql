const feed = (parent, args, context, info) => {
	return context.prisma.links()
}

const info = () => `This is the API of a Hackernews Clone`

module.exports = {
	feed,
	info
}