const Sequelize = require('sequelize');
const { DataTypes: { STRING, UUID, UUIDV4 } } = Sequelize;
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
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

Task.belongsTo(Task, { as: 'parent' });
Task.hasMany(Task, { as: 'childTasks', foreignKey: 'parentId' });

Task.prototype.findChildTasks = function(){
  return Task.findAll({
    where: {
      parentId: this.id
    }
  });
}

const User = conn.define('user', {
});

const Chore = conn.define('chore', {
});

const syncAndSeed = async()=> {
  await conn.sync({ force: true })
  const [
    cleanHouse,
    windows,
    vacuum,
    shopping,
    milk,
    eggs,
    getMail
  ] = await Promise.all( tasks.map( name => Task.create({ name })));
  windows.parentId = cleanHouse.id;
  vacuum.parentId = cleanHouse.id;
  milk.parentId = shopping.id;
  eggs.parentId = shopping.id;
  await Promise.all([ windows.save(), vacuum.save(), milk.save(), eggs.save()]);

};

module.exports = {
  syncAndSeed,
  models: {
    Task,
    User,
    Chore
  }
}

