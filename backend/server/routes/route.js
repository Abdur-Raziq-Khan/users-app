const express = require('express'),
router = express.Router(),
userController = require('../controllers/userController'),
listController = require('../controllers/listController'),
authMiddleWare = require('../middlewares/auth'),
validationMiddleWare = require("../middlewares/validation"),
validationSchemas = require("../schemas-validation/schemas");


router.post('/register', validationMiddleWare(validationSchemas.schemas.signUp, 'body'), userController.signup);

router.post('/login', validationMiddleWare(validationSchemas.schemas.signIn, 'body'), userController.login);

router.get('/users', authMiddleWare.allowIfLoggedin, authMiddleWare.grantAccess('readAny', 'user'), userController.getUsers);

router.put('/user', authMiddleWare.allowIfLoggedin, authMiddleWare.grantAccess('updateAny', 'user'), validationMiddleWare(validationSchemas.schemas.updateUser, 'body'), userController.updateUser);

router.delete('/user/:userId', authMiddleWare.allowIfLoggedin, authMiddleWare.grantAccess('deleteAny', 'user'), validationMiddleWare(validationSchemas.schemas.userId, 'params'), userController.deleteUser);

// email confirmation
router.post('/confirmation', userController.confirmationPost);
router.post('/resend', userController.resendTokenPost);

// forgot password
// router.post('/req-reset-password', userController.ResetPassword);
router.post('/new-password', userController.NewPassword);
router.post('/valid-password-token', userController.ValidPasswordToken);

// list
router.post('/user/:userId/list', listController.addList);
router.get('/lists/:userId', listController.getAllLists);

module.exports = router;