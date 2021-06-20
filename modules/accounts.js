/** @module Accounts */

import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'

const saltRounds = 10

/**
 * Accounts
 * ES6 module that handles registering accounts and logging in.
 */
class Accounts {
	/**
   * Create an account object and adds two premade technician accounts
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,\
				user TEXT, pass TEXT, email TEXT, phonenumber TEXT, address TEXT, is_technician INTEGER);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * registers a new user
	 * @param {String} user the chosen username
	 * @param {String} pass the chosen password
	 * @param {String} email the chosen email
	 * @param {String} phonenumber the chosen number
	 * @param {String} address the chosen address
	 * @returns {Boolean} returns true if the new user has been added
	 */
	async register(user, pass, email, phonenumber, address) {
		Array.from(arguments).forEach(val => {
			if (val.length === 0) throw new Error('missing field')
		})

		let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
		const data = await this.db.get(sql)
		if (data.records !== 0) throw new Error(`username "${user}" already in use`)

		sql = `SELECT COUNT(id) as records FROM users WHERE email="${email}";`
		const emails = await this.db.get(sql)
		if (emails.records !== 0) throw new Error(`email address "${email}" is already in use`)

		sql = `SELECT COUNT(id) as records FROM users WHERE phonenumber="${phonenumber}";`
		const numbers = await this.db.get(sql)
		if (numbers.records !== 0) throw new Error(`phonenumber "${phonenumber}" is already in use`)

		pass = await bcrypt.hash(pass, saltRounds)
		sql = `INSERT INTO users(user, pass, email, phonenumber, address, is_technician)\
		VALUES("${user}", "${pass}", "${email}","${phonenumber}", "${address}",0);`
		await this.db.run(sql)
		return true
	}

	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} username the username to check
	 * @param {String} password the password to check
	 * @returns {Number} returns id if credentials are valid
	 */

	async login(username, password) {
		let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
		const records = await this.db.get(sql)
		if (!records.count) throw new Error(`username "${username}" not found`)
		sql = `SELECT id,pass FROM users WHERE user = "${username}";`
		const record = await this.db.get(sql)
		const valid = await bcrypt.compare(password, record.pass)
		if (valid === false) throw new Error(`invalid password for account "${username}"`)
		return record.id
	}

	/**
	 * checks to see if a user is a technician
	 * @param {Number} id the id to check
	 * @returns {Boolean} returns true user is a technician
	 */
	async isTechnician(id) {
		const sql = `SELECT is_technician FROM users WHERE id = ${id};`
		const value = await this.db.get(sql)
		if (value.is_technician === 1) {
			return true
		} else {
			return false
		}
	}

	/**
	 * closes the database
	 */

	async close() {
		await this.db.close()
	}
}

export default Accounts
