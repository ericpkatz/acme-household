const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_household_db');

const tasks = [
  'clean house',
  'windows',
  'vacuum',
  'shopping',
  'milk',
  'eggs',
  'get mail'
];

const users = [
  'prof',
  'nick',
  'jake'
];

const Task = conn.define('task', {
});

const User = conn.define('user', {
});

const Chore = conn.define('chore', {
});

const syncAndSeed = async()=> {
  await conn.sync({ force: true })

};

module.exports = {
  syncAndSeed,
  models: {
    Task,
    User,
    Chore
  }
}

