
/** @module Issues */

import sqlite from 'sqlite-async'


/**
 * Issues
 * ES6 module that handles registering accounts and logging in.
 */
class Issues {
	/**
    * Create an account object
    * @param {String} [dbName=":memory:"] - The name of the database file to use.
    */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user issues
			const sql = 'CREATE TABLE IF NOT EXISTS issues(\
                id INTEGER PRIMARY KEY AUTOINCREMENT,\
                userid INTEGER NOT NULL,\
                technicianid INTEGER,\
                typeofapp TEXT NOT NULL,\
                ageofapp TEXT NOT NULL,\
                manufacturer TEXT NOT NULL,\
                description TEXT,\
                status TEXT,\
                lastissue INTEGER,\
                FOREIGN KEY(userid) REFERENCES users(id)\
            );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
     * retrieves all the issues in the system for a particular user
	 * @param {Number} id of a particular user
     * @return {Array} returns an array containing all the issues of a user
     */

	async showAllForUser(id) {
		try {
			const sql = `SELECT * FROM issues WHERE userid = ${id};`
			const issues = await this.db.all(sql)
			for (const i in issues) {
				const dateTime = new Date(issues[i].lastissue)
				const date = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`
				issues[i].lastissue = date
			}
			return issues
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
     * retrieves all the issues in the system that are unassigned
     * @return {Array} returns an array containing all the issues
     */

	async getAllUnassigned() {
		try {
			const sql = 'SELECT * FROM issues WHERE status = "unassigned"'
			const issues = this.db.all(sql)
			for (const i in issues) {
				const dateTime = new Date(issues[i].lastissue)
				const date = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`
				issues[i].lastissue = date
			}
			return issues
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
     * retrieves all the details about the issue that mathes with the id
	 * @param {Number} id of a particular issue
     * @return {Array} return an array containing all the details about the issue
     */

	async getDetailsById(id) {
		try {
			const sql = `SELECT * FROM issues WHERE id = ${id};`
			const issue = await this.db.get(sql)
			const dateTime = new Date(issue.lastissue)
			const date = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`
			issue.lastissue = date
			return issue
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
     * removes the duplicate accounts from an array with technician accounts
	 * @param {Arrray} array of a technicians
     * @return {Array} return an array containing no duplicate accounts
     */

	async removeDuplicates(array) {
		for (let i = 0; i < array.length; i++) {
			const name = array[i].user
			let counter = 0
			for (let j = 0; j < array.length; j++) {
				if (name === array[j].user) {
					counter += 1
				}
				if (counter > 1) {
					array.splice(j, 1)
				}
			}
		}
		return array
	}

	/**
     * retrieves technician account which already worked on particular type of appliance
	 * @param {String} type of appliance
     * @return {Array} return an array containing all technicians that worked on this type of applance
     */

	async getTechniciansByType(type) {
		try {
			let sql = `SELECT technicianid FROM issues WHERE typeofapp = "${type}" AND status = "resolved"`
			const id = await this.db.all(sql)
			const technicians = new Array()
			for (const index in id) {
				sql = `SELECT user, email, phonenumber, address FROM users where id = ${id[index].technicianid};`
				const value = await this.db.get(sql)
				if (value === undefined) {
					console.log('undefined')
				} else {
					technicians.push(value)
				}
			}
			return technicians
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
     * insert a new issue into database
	 * @param {Array} data of data needed to insert a new issue
     * @return {Boolean} return true if insert was successful
     */

	async add(data) {
		console.log(data)
		try {
			const sql = `INSERT INTO issues(userid, typeofapp, ageofapp, manufacturer, description, status, lastissue)\
            VALUES(${data.userid},'${data.type}', '${data.age}',\
            '${data.manufacturer}', "${data.description}", 'unassigned', CURRENT_TIMESTAMP);`
			await this.db.run(sql)
			return true
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
     * update a status in issues table for a particular issue
	 * @param {Array} data of data needed to update a status of an issue
     * @return {Boolean} return true if update was successful
     */

	async amend(data) {
		try {
			const sql = `UPDATE issues SET status = "${data.status}",\
            technicianid = ${data.userid} WHERE id = ${data.issueid};`
			await this.db.run(sql)
			return true
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
	 * closes the database
	 */


	async close() {
		await this.db.close()
	}
}

export default Issues
