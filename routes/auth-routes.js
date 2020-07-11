const express = require('express');
const router = express.Router();
const { check, oneOf } = require('express-validator');
const { protect } = require('../middleware/auth');
const { ALPHA_WHITESPACE_REGEX } = require('../utils/regex');
const {
  INVALID_EMAIL_MSG,
  INVALID_NAME_MSG,
  INVALID_PASSWORD_MSG,
  NO_FIELD_UPDATED_MSG
} = require('../utils/inputExceptionMsg');

// import controllers here
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword
  // forgotPassword,
  // resetPassword
} = require('../controllers/auth');
const { checkInputError } = require('../middleware/input-validation');

// map routes to controller
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);

router.post(
  '/register',
  [
    check('name', INVALID_NAME_MSG)
      .trim()
      .not()
      .isEmpty()
      .matches(ALPHA_WHITESPACE_REGEX),
    check('email', INVALID_EMAIL_MSG).trim().isEmail().normalizeEmail(),
    check('password', INVALID_PASSWORD_MSG).isLength({ min: 6 })
  ],
  checkInputError,
  register
);

router.post(
  '/login',
  [
    check('email', INVALID_EMAIL_MSG).trim().isEmail().normalizeEmail(),
    check('password', INVALID_PASSWORD_MSG).isLength({ min: 6 })
  ],
  checkInputError,
  login
);

router.put(
  '/updatedetails',
  protect,
  [
    oneOf(
      [check('name').exists(), check('email').exists()],
      NO_FIELD_UPDATED_MSG
    ),
    check('name', INVALID_NAME_MSG)
      .optional()
      .trim()
      .not()
      .isEmpty()
      .matches(ALPHA_WHITESPACE_REGEX),
    check('email', INVALID_EMAIL_MSG)
      .optional()
      .trim()
      .isEmail()
      .normalizeEmail()
  ],
  checkInputError,
  updateDetails
);

router.put(
  '/updatepassword',
  protect,
  [
    check('oldPassword', 'Please enter your old password').exists(),
    check('newPassword', INVALID_PASSWORD_MSG).isLength({ min: 6 })
  ],
  checkInputError,
  updatePassword
);

// router.post('/forgotpassword', forgotPassword);
// router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
