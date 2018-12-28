const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

const newLink = (parent, args, context, info) => { 
	const userId = getUserId(context)
	return context.prisma.createLink({
		url: args.url,
		description: args.description,
		postedBy: { connect: { id: userId } }
	})
}

const changeLink = (parent, args, context, info) => { 
	const userId = getUserId(context)
	const link = context.prisma.link({ id: args.id})

	if (link.postedBy.id !== userId) {
		throw new Error('Not allowed to edit this link')
	}

	return context.prisma.updateLink({
		data: {
			url: args.url,
			description: args.description
		}, 
		where: {
			id: args.id 
		}
	})
}

const removeLink = (parent, args, context, info) => { 
	const userId = getUserId(context)
	const link = context.prisma.link({ id: args.id})

	if (link.postedBy.id !== userId) {
		throw new Error('Not allowed to edit this link')
	}

	context.prisma.deleteLink({
		id: args.id 
	})
}

const signup = async (parent, args, context, info) => {
	const password = await bcrypt.hash(args.password, 10)
	const user = await context.prisma.createUser({ ...args, password })
	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	return {
		token,
		user
	}
}

const login = async(parent, args, context, info) => {
	const user = await context.prisma.user({ email: args.email })
	if (!user) {
		throw new Error('No such user')
	}

	const valid = bcrypt.compare(args.password, user.password)
	if (!valid) {
		throw new Error('Invalid password')
	}

	const token = jwt.sign({ userId: user.id }, APP_SECRET)
	return {
		token,
		user
	}
}

module.exports = {
	newLink,
	changeLink,
	removeLink,
	signup,
	login
}