
import Router from 'koa-router'

const router = new Router()

import Accounts from '../modules/accounts.js'
const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	try {
		await ctx.render('index', ctx.hbs)
	} catch (err) {
		await ctx.render('error', ctx.hbs)
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', async ctx => {
	const account = await new Accounts(dbName)
	try {
		// call the functions in the module
		console.log(ctx.request.body)
		await account.register(ctx.request.body.user, ctx.request.body.pass,
			ctx.request.body.email, ctx.request.body.phonenumber, ctx.request.body.address)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch (err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		await account.close()
	}
})

/**
 * The user login page.
 *
 * @name Login Page
 * @route {GET} /login
 */
router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

/**
 * The script to process a login.
 *
 * @name Login Script
 * @route {POST} /login
 */
router.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		ctx.session.userID = await account.login(ctx.request.body.user, ctx.request.body.pass)
		const isTech = await account.isTechnician(ctx.session.userID)
		ctx.session.user = ctx.request.body.user; ctx.session.authorised = true
		const referrer = ctx.request.body.referrer || '/secure'
		if (isTech === true) {
			return ctx.redirect(`${referrer}/tech?msg=you are now logged in...`)
		} else {
			return ctx.redirect(`${referrer}?msg=you are now logged in...`)
		}
	} catch (err) {
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		await account.close()
	}
})

/**
 * The user logout page.
 *
 * @name Logout Page
 * @route {GET} /logout
 */
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	delete ctx.session.userID
	delete ctx.session.user
	ctx.redirect('/?msg=you are now logged out')
})

export default router
