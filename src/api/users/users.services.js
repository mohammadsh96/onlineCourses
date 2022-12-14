const bcrypt = require("bcrypt");
const { db } = require("../../utils/db");

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
      userId: id,
    },
  });
}
function addCourse(data, id) {
  return db.courses.create({
    data: {
      name: data.name,
      cost: data.cost,
      info: data.info || null,
      daysInWeek: data.daysInWeek || null,
      weeks: data.weeks || null,
      user: {
        connect: { id: id },
      },
      category: {
        connect: { id: data.categoryId },
      },
    },
  });
}
function fetchCourse() {
  return db.courses.findMany({
    include: {
      comments: true,
      category: true,
      subscription: true,
    },
  });
}
function fetchCourseById(courseId) {
  return db.courses.findUnique({
    where: {
      id: courseId,
    },
    include: {
      comments: true,
      category: true,
    },
  });
}
async function joinCourse(courseId, userId) {
  let subscriptions = await db.subscription.findMany({
    where: {
      courseId: courseId,
    },
  });
  for (let i = 0; i < subscriptions.length; i++) {
    if (subscriptions[i].userId === userId) {
      return { msg: "you joined the course already" };
    }
  }

  return db.subscription.create({
    data: {
      courseId: courseId,
      userId: userId,
    },
  });
}
function commentOnCourse(courseId, userId, comment) {
  return db.comments.create({
    data: {
      courseId: courseId,
      userId: userId,
      comment: comment,
    },
  });
}
async function likeOnCourse(courseId) {
  let course = await db.courses.findUnique({
    where: {
      id: courseId,
    },
  });

  let likes = course.likes;
  return db.courses.update({
    data: {
      likes: likes + 1,
    },
    where: {
      id: courseId,
    },
    include: {
      comments: true,
      category: true,
      subscription: true,
    },
  });
  
}
async function rateOnCourse(courseId,rate) {
  let course = await db.courses.findUnique({
    where: {
      id: courseId,
    },
  });
  
  let rateNum = course.rateNum ;
  let previousRate=course.rate;
  let newrateNum=rateNum+1
  let newrate= (previousRate*rateNum + rate)/newrateNum
  let newrecord = await db.courses.update({
    data: {
      rateNum: newrateNum,
      rate:newrate,
    },
    where: {
      id: courseId,
    },
    include: {
      comments: true,
      category: true,
      subscription: true,
    },
  });
  return newrecord
}
async function fetchSubscriptions(userId) {
 let subscribtios=await db.subscription.findMany({
  where: {userId: userId},
 });

let coursesIds = subscribtios.map((course) =>{
  return(course.courseId)
})

let  courses = await db.courses.findMany({
  where :{
    id: { in: coursesIds}
  }
})
return courses
}
async function getCourseLikes(courseId,userId) {
 let course= await db.courses.findUnique({
   where: {
    id:courseId,
  },
  select : {
    userId: true,
    comments: true,
    likes : true,
    rateNum: true,
    rate: true,
  }
  });
  if(course.userId===userId){
    return course
  }else{
    return{msg: "you are not allowed to check comments on this course"}
  }

  }
  async function updateCourseById(courseId ,data,userId){
    let course =await db.courses.findUnique({where :{
      id: courseId,
    },

  })
  if(course.userId===userId){

    return db.courses.update({where :{
      id: courseId,
    },
  data:data,
  })
  }
  else return {msg:"You do not have premessions to update this course"}
  }


  async function deleteCourseById(courseId ,userId){
    let course =await db.courses.findUnique({where :{
      id: courseId,
    },

  })
  if(course.userId===userId){

  let deleted = await db.courses.delete({where :{
      id: courseId,
    } 
  })
 if(deleted) return {msg:"Course deleted successfully"}
  }
  else return {msg:"You do not have premessions to update this course"}
  }
module.exports = {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  findProducts,
  addCourse,
  fetchCourse,
  fetchCourseById,
  joinCourse,
  commentOnCourse,
  likeOnCourse,
  fetchSubscriptions,
  getCourseLikes,
  rateOnCourse,
  updateCourseById,
  deleteCourseById,
};
