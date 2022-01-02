require('dotenv').config()
const { Client } = require('pg'); // imports the pg module
const { pgpassword, pgusername } = process.env
console.log(pgpassword, pgusername)
// supply the db name and location of the database
const client = new Client(`postgres://${pgusername}:${pgpassword}@localhost:5432/juicebox-dev`);

module.exports = {
  client,
}

// async function getAllUsers() {
//     const { rows } = await client.query(`
//         SELECT id, username, name, location, active 
//         FROM users;
//       `);
  
//     return rows;
//   }

//   async function createUser({ 
//     username, 
//     password,
//     name,
//     location
//   }) {
//     try {
//       const { rows: [ user ] } = await client.query(`
//         INSERT INTO users(username, password, name, location) 
//         VALUES($1, $2, $3, $4) 
//         ON CONFLICT (username) DO NOTHING 
//         RETURNING *;
//       `, [username, password, name, location]);
  
//       return user;
//     } catch (error) { 
//       throw error;
//     }
//   }

//   async function updateUser(id, fields = {}) {
//     // build the set string
//     const setString = Object.keys(fields).map(
//       (key, index) => `"${ key }"=$${ index + 1 }`
//     ).join(', ');
  
//     // return early if this is called without fields
//     if (setString.length === 0) {
//       return;
//     }
  
//     try {
//       const { rows: [ user ] }  = await client.query(`
//         UPDATE users
//         SET ${ setString }
//         WHERE id=${ id }
//         RETURNING *;
//       `, Object.values(fields));
  
//       return user;
//     } catch (error) {
//       throw error;
//     }
//   }
  
//   async function createPost({
//     authorId,
//     title,
//     content
//   }) {
//     try {
  
//     } catch (error) {
//       throw error;
//     }
//   }

//   async function updatePost(id, {
//     title,
//     content,
//     active
//   }) {
//     try {
  
//     } catch (error) {
//       throw error;
//     }
//   }

//   async function getAllPosts() {
//     try {
  
//     } catch (error) {
//       throw error;
//     }
//   }

//   async function getUserById(userId) {
//     try {
//       const { rows: [ user ] } = await client.query(`
//         SELECT id, username, name, location, active
//         FROM users
//         WHERE id=${ userId }
//       `);
  
//       if (!user) {
//         return null
//       }
  
//       user.posts = await getPostsByUser(userId);
  
//       return user;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async function getPostsByUser(userId) {
//     try {
//       const { rows } = client.query(`
//         SELECT * FROM posts
//         WHERE "authorId"=${ userId };
//       `);
  
//       return rows;
//     } catch (error) {
//       throw error;
//     }
//   }
 
//   // and export them
//   module.exports = {
//     client,
//     getAllUsers,
//     getAllPosts,
//     getPostsByUser,
//     getUserById,
//     createUser,
//     updateUser,
//     createPost,
//     updatePost
//   }

async function createUser({ 
    username, 
    password,
    name,
    location
  }) {
    try {
      const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password, name, location) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password, name, location]);
  
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ user ] } = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  async function getAllUsers() {
    try {
      const { rows } = await client.query(`
        SELECT id, username, name, location, active 
        FROM users;
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  async function getUserById(userId) {
    try {
      const { rows: [ user ] } = await client.query(`
        SELECT id, username, name, location, active
        FROM users
        WHERE id=${ userId }
      `);
  
      if (!user) {
        return null
      }
  
      user.posts = await getPostsByUser(userId);
  
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * POST Methods
   */
  
  async function createPost({
    authorId,
    title,
    content
  }) {
    try {
      const { rows: [ post ] } = await client.query(`
        INSERT INTO posts("authorId", title, content) 
        VALUES($1, $2, $3)
        RETURNING *;
      `, [authorId, title, content]);
  
      return post;
    } catch (error) {
      throw error;
    }
  }
  
  async function updatePost(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ post ] } = await client.query(`
        UPDATE posts
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return post;
    } catch (error) {
      throw error;
    }
  }
  
  async function getAllPosts() {
    try {
      const { rows } = await client.query(`
        SELECT *
        FROM posts;
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  async function getPostsByUser(userId) {
    try {
      const { rows } = await client.query(`
        SELECT * 
        FROM posts
        WHERE "authorId"=${ userId };
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tag methods
   */

   async function createTags(tagList) {
    if (tagList.length === 0) { 
      return; 
    }
  
    // need something like: $1), ($2), ($3 
    const insertValues = tagList.map(
      (_, index) => `$${index + 1}`).join('), (');
    // then we can use: (${ insertValues }) in our string template
  
    // need something like $1, $2, $3
    const selectValues = tagList.map(
      (_, index) => `$${index + 1}`).join(', ');
    // then we can use (${ selectValues }) in our string template
  
    try {
      // insert the tags, doing nothing on conflict
      // returning nothing, we'll query after
      await client.query(`
        INSERT INTO tags(name) 
        VALUES(${ insertValues })
        ON CONFLICT (name) DO NOTHING;
      `, [insertValues]);
  
      // select all tags where the name is in our taglist
      // return the rows from the query
      const { rows } = await client.query(`
        SELECT * FROM tags
        WHERE name
        IN (${ selectValues });
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  module.exports = {  
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    createTags
  }