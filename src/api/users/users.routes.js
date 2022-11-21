const { prisma } = require('@prisma/client');
const express = require('express');
const { isAuthenticated ,acl } = require('../../middlewares');
const { findUserById } = require('./users.services');
const {findProducts, addCourse} = require('./users.services');
const router = express.Router();

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
router.get('/courses/:id', isAuthenticated,acl(["student","admin"]), async (req, res, next) => {
  const { userId } = req.payload;
  
  if(req.params.id===userId){

    try {
      const courses = await findProducts(userId)
      // const user = await findUserById(userId);
      // delete user.password;
      res.json(courses);
    } catch (err) {
      next(err);
    }
  }
});
router.post('/courses', isAuthenticated ,acl(['admin']), async (req,res,next)=>{
  const { userId } = req.payload;
  const data = req.body
  try {
    const courses = await addCourse(data,userId)
      res.status(201).json(courses);
  } catch (err) {
    console.log(err);
  }

})

module.exports = router;
