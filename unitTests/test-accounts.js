
import test from 'ava'
import Accounts from '../modules/accounts.js'

test('REGISTER : register and log in with a valid account', async test => {
	test.plan(1)
	const account = await new Accounts() // no database specified so runs in-memory
	try {
		await account.register('doej', 'password', 'doej@gmail.com', '07955459515', '24 High Road')
	  	const login = await account.login('doej', 'password')
		test.is(login, 1, 'unable to log in')
	} catch(err) {
		test.fail('error thrown')
	} finally {
		account.close()
	}
})

test('REGISTER : register a duplicate username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'doej@gmail.com', '07955459515', '24 High Road')
		await account.register('doej', 'password', 'doej@gmail.com', '07955459515', '24 High Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "doej" already in use', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('', 'password', 'doej@gmail.com', '07955459515', '24 High Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank password', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', '', 'doej@gmail.com', '07955459515', '24 High Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank email', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', '', '07955459515', '24 High Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if duplicate email', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'doej@gmail.com', '07955459515', '24 High Road')
		await account.register('bloggsj', 'newpassword', 'doej@gmail.com', '07955459231', '14 High Street')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'email address "doej@gmail.com" is already in use', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if duplicate number', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'doej@gmail.com', '07955459515', '24 High Road')
		await account.register('bloggsj', 'newpassword', 'bloggsj@gmail.com', '07955459515', '14 High Street')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'phonenumber "07955459515" is already in use', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('LOGIN    : invalid username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'doej@gmail.com', '07955459515', '24 High Road')
		await account.login('roej', 'password')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "roej" not found', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('LOGIN    : invalid password', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'doej@gmail.com', '07955459515', '24 High Road')
		await account.login('doej', 'bad')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'invalid password for account "doej"', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('ISTECHNICIAN : returns false if user is not technician', async test => {
	test.plan(1)
	const account = await new Accounts() // no database specified so runs in-memory
	try {
		await account.register('doej', 'password', 'doej@gmail.com')
	  	const isTechnician = await account.isTechnician(1)
		test.is(isTechnician, false, 'wrong value returned')
	} catch(err) {
		test.fail('error thrown')
	} finally {
		account.close()
	}
})
