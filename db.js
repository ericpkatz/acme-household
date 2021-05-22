const Sequelize = require('sequelize');
const { DataTypes: { DATE, STRING, UUID, UUIDV4 } } = Sequelize;
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


Task.prototype.findChildTasks = function(){
  return Task.findAll({
    where: {
      parentId: this.id
    }
  });
}

const User = conn.define('user', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
});

const Chore = conn.define('chore', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  dueDate: {
    type: DATE,
    allowNull: false,
    defaultValue: function(){
      return new Date( new Date().getTime() + 1000*60*60*2);
    }
  }
});

Task.belongsTo(Task, { as: 'parent' });
Task.hasMany(Task, { as: 'childTasks', foreignKey: 'parentId' });

Chore.belongsTo(User);
Chore.belongsTo(Task);

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
  const [prof, nick, jake ] = await Promise.all(users.map( name => User.create({ name }))); 
  windows.parentId = cleanHouse.id;
  vacuum.parentId = cleanHouse.id;
  milk.parentId = shopping.id;
  eggs.parentId = shopping.id;
  await Promise.all([ windows.save(), vacuum.save(), milk.save(), eggs.save()]);
  await Promise.all([
    Chore.create({ userId: jake.id, taskId: shopping.id}),
    Chore.create({ userId: nick.id, taskId: vacuum.id}),
  ]);

};

module.exports = {
  syncAndSeed,
  models: {
    Task,
    User,
    Chore
  }
}

