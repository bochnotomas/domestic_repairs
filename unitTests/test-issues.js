
import test from 'ava'
import Issues from '../modules/issues.js'


test('ADD : add data to database', async test => {
	test.plan(1)
	const issues = await new Issues() // no database specified so runs in-memory
	const data = {
		type: 'Wasching machine',
		age: '5',
		manufacturer: 'Kenwood',
		description: 'sdada',
		userid: 1
	}
	try {
	  	const value = await issues.add(data)
		test.is(value, true, 'data added successfully')
	} catch(err) {
		test.fail('error thrown')
	} finally {
		issues.close()
	}
})


test('AMEND : amend status for issue', async test => {
	test.plan(1)
	const issues = await new Issues() // no database specified so runs in-memory
	const data = {
		type: 'Wasching machine',
		age: '5',
		manufacturer: 'Kenwood',
		description: 'sdada',
		userid: 1
	}
	await issues.add(data)
	try {
		data.status = 'resolved'
	  	const value = await issues.amend(data)
		test.is(value, true, 'data amended successfully')
	} catch(err) {
		test.fail(err)
	} finally {
		issues.close()
	}
})
