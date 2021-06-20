import Router from 'koa-router'

const router = new Router({ prefix: '/secure' })

import Issues from '../modules/issues.js'
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if (ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)

/**
 * The secure page.
 *
 * @name Secure Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	const issues = await new Issues(dbName)
	try {
		const records = await issues.showAllForUser(ctx.session.userID)
		ctx.hbs.records = records
		await ctx.render('secure', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The secure page for technicians.
 *
 * @name Tech Page
 * @route {GET} /tech
 */
router.get('/tech', async ctx => {
	const issues = await new Issues(dbName)
	try {
		const records = await issues.getAllUnassigned()
		ctx.hbs.records = records
		await ctx.render('tech_secure', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The details page about an issue for a customer.
 * @name Details Page
 * @route {GET} /details/:id
 */
router.get('/details/:id', async ctx => {
	const issues = await new Issues(dbName)
	try {
		ctx.hbs.issue = await issues.getDetailsById(ctx.params.id)
		ctx.hbs.id = ctx.params.id
		await ctx.render('details', ctx.hbs)
	} catch (err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The details page about an issue for a technician.
 * @name TechDetails Page
 * @route {GET} /tech/details/:id
 */
router.get('/tech/details/:id', async ctx => {
	const issues = await new Issues(dbName)
	try {
		ctx.hbs.issue = await issues.getDetailsById(ctx.params.id)
		ctx.hbs.id = ctx.params.id
		await ctx.render('tech_details', ctx.hbs)
	} catch (err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The script to process a new status of an issue
 * @name TechDetailsAmend Script
 * @route {POST} /tech/details/:id/amend
 */
router.post('/tech/details/:id/amend', async ctx => {
	const issues = await new Issues(dbName)
	try {
		ctx.request.body.issueid = ctx.params.id
		ctx.request.body.userid = ctx.hbs.userid
		await issues.amend(ctx.request.body)
		ctx.redirect('/secure/tech?msg=state changed')
	} catch (err) {
		console.log(err)
		ctx.render('error', ctx.hbs)
	} finally {
		issues.close()
	}
})

/**
 * The page for adding new issue.
 * @name Add Page
 * @route {GET} /add
 */
router.get('/add', async ctx => {
	try {
		await ctx.render('add', ctx.hbs)
	} catch (err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})


/**
 * The script to process new issue
 * @name Add Script
 * @route {POST} /add
 */
router.post('/add', async ctx => {
	const issues = await new Issues(dbName)
	try {
		ctx.request.body.userid = ctx.session.userID
		await issues.add(ctx.request.body)
		console.log(ctx.request.body)
		await ctx.redirect(`/secure/knowledge/${ctx.request.body.type}`)
	} catch (err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * Page to show technicians that has knowledge about this type of appliance
 * @name Knowledge Page
 * @route {GET} /knowledge/:type
 */
router.get('/knowledge/:type', async ctx => {
	const issue = await new Issues(dbName)
	try {
		ctx.hbs.type = ctx.params.type
		const technicians = await issue.getTechniciansByType(ctx.params.type)
		ctx.hbs.technicians = await issue.removeDuplicates(technicians)
		console.log(ctx.hbs.technicians)
		await ctx.render('knowledge', ctx.hbs)
	} catch (err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	}
})

export default router
