require('dotenv').config()
const { Client } = require('pg'); // imports the pg module
const { pgpassword, pgusername } = process.env
console.log(pgpassword, pgusername)
// supply the db name and location of the database
const client = new Client(`postgres://${pgusername}:${pgpassword}@localhost:5432/juicebox-dev`);

module.exports = {
  client,
}

async function getAllUsers() {
    const { rows } = await client.query(
      `SELECT id, username 
      FROM users;
    `);
  
    return rows;
  }

  async function createUser({ username, password }) {
    try {
      const { rows } = await client.query(`
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
      `, [username, password]);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  // and export them
  module.exports = {
    client,
    getAllUsers,
    createUser,
  }

