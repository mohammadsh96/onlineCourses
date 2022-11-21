const bcrypt = require('bcrypt');
const { db } = require('../../utils/db');

function findUserByEmail(email) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

function createUserByEmailAndPassword(user) {
  user.password = bcrypt.hashSync(user.password, 12);
  return db.user.create({
    data: user,
  });
}

function findUserById(id) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}
function findProducts(id) {
  return db.courses.findMany({
    where: {
      userId : id,
    },
  });
}
function addCourse(data,id){
  return db.courses.create({
    data: {
     name:  data.name ,
       cost: data.cost,
       info: data.info ||null ,
       daysInWeek:data.daysInWeek ||null,
       weeks:data.weeks ||null,
      user: {
        connect: { id: id }
        },
        category: {
          connect: { id: data.categoryId }
          },
    }
   
    
  })
}
module.exports = {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  findProducts,
  addCourse
};
