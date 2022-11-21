const { prisma } = require('@prisma/client');
const express = require('express');
const { isAuthenticated ,acl } = require('../../middlewares');
const { findUserById } = require('./users.services');
const {findProducts, addCourse ,fetchCourse,fetchCourseById ,joinCourse ,commentOnCourse,likeOnCourse,fetchSubscriptions} = require('./users.services');
const router = express.Router();

// ---------- user informations ----- !
router.get('/profile', isAuthenticated, async (req, res, next) => {

  try {
    const { userId } = req.payload;
    const user = await findUserById(userId);
    console.log(user.role);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
});
//----------- check courses by users id -----!!1
router.get('/mycourses/:id', isAuthenticated,acl(["admin"]), async (req, res, next) => {
  const { userId } = req.payload;
  
  if(req.params.id===userId){

    try {
      const courses = await findProducts(userId)
      res.json(courses);
    } catch (err) {
      next(err);
    }
  }
});
//------- create Course--------- only for admin --!
router.post('/courses', isAuthenticated ,acl(['admin']), async (req,res,next)=>{
  const { userId } = req.payload;
  const data = req.body
  try {
    const courses = await addCourse(data,userId)
      res.status(201).json(courses);
  } catch (err) {
    next(err);
  }

})

//----------- fetch all courses-------------!!
router.get('/courses', isAuthenticated ,acl(['student','admin']), async (req,res,next)=>{
    try {
    const courses = await fetchCourse()
      res.status(201).json(courses);
  } catch (err) {
    next(err);
  }

})

// ------- open single course------------!!
router.get('/courses/:courseId', isAuthenticated ,acl(['student','admin']), async (req,res,next)=>{
  const courseId =parseInt(req.params.courseId);
 
  try {
    const course = await fetchCourseById(courseId)
      res.status(201).json(course);
  } catch (err) {
    next(err);
  }

})

//-------------- to Join a course --------------------------!!

router.post('/courses/:courseId/join', isAuthenticated ,acl(['student','admin']), async (req,res,next)=>{
  // const { userId } = req.payload;
  const courseId =parseInt(req.params.courseId);
  const { userId } = req.payload;
  try {
    const course = await joinCourse(courseId,userId)
      res.status(201).json(course);
  } catch (err) {
    console.log(err);
  }

})


//-------------- to hit comment on a course --------------------------!!

router.post('/courses/:courseId/comment', isAuthenticated ,acl(['student','admin']), async (req,res,next)=>{
  // const { userId } = req.payload;
  const courseId =parseInt(req.params.courseId);
  const { userId } = req.payload;
  const comment = req.body.comment;
  try {
    const course = await commentOnCourse(courseId,userId,comment)
      res.status(201).json(course);
  } catch (err) {
    next(err);
  }

})

//-------------- to hit like on a course --------------------------!!
router.put('/courses/:courseId/like', isAuthenticated ,acl(['student','admin']), async (req,res,next)=>{
  // const { userId } = req.payload;
  const courseId =parseInt(req.params.courseId);
  const { userId } = req.payload;
  
  try {
    const course = await likeOnCourse(courseId)
      res.status(201).json(course);
  } catch (err) {
    console.log(err);
  }

})
//-- - --fetch all courses that users are subscribed in them (joined in) --------- !!
router.get('/subscribtios', isAuthenticated ,acl(['student','admin']), async (req,res,next)=>{
  const { userId } = req.payload;
  
  try {
    const courses = await fetchSubscriptions(userId)
      res.status(201).json(courses);
  } catch (err) {
    console.log(err);
  }

})
module.exports = router;
