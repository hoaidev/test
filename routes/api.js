const express = require('express');
const router = express.Router();
const sampleController = require('../controllers/sampleController');
const fairController = require('../controllers/fairController');
const stadiumController = require('../controllers/stadiumController');
const loginController = require('../controllers/loginController');
const passport = require('passport');
const userController = require('../controllers/userController')
const teamController = require('../controllers/teamController')
const social = require('./../config/passport')(router, passport);
const { check, oneOf } = require('express-validator/check');
const message = require('./../common/commonMessage');
const commonFunction = require('./../common/commonFunction');

// Need extract snippet below to reusable module
// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get Samples
router.get('/samples', sampleController.getAll);

// Get Sample by Id
router.get('/samples/:id', sampleController.getById);

// Get Price Fairs
router.post('/fair/searchPriceFair', fairController.searchPriceFair);

// Get Fairs
router.post('/fair/searchFair', fairController.searchFair);

// Update Fair
router.post('/fair/updateById', fairController.updateFair);

// delete Fair
router.post('/fair/deleteById', fairController.deleteFairbyId);

// fair.bookById
router.post('/fair/bookById',
    [
        check('fair')
            .isArray().withMessage(message.INCORRECT_PARAM)
            .not().isEmpty().withMessage(message.NULL_PARAM)
    ],
    fairController.bookById);
//longlvq add search fair statistical
router.post('/fair/seachFairStatistic', fairController.searchFairStatistic);

//fair.searchCalendarFair
router.post('/fair/searchCalendarFair', fairController.searchCalendarFair);

/**
 * @author longlvq
 * @controller userControler
 */
router.get('/user/getAllUser', userController.getAll);
router.post('/user/getById', [check('id').exists()], userController.getById);
router.post('/user/update', [check('id').exists(), check('name').optional({ nullable: true }).trim().not().isEmpty()], userController.updateAgent);

// Search all user
router.post('/user/searchAllByName', userController.searchAllByName);

// Search all team
router.post('/team/searchAllByName', teamController.searchAllByName);

// stadium.getById
router.post('/stadium/getById',
    [
        check('stadiumId')
            .exists().withMessage(message.NULL_PARAM)
            .trim().isLength({ min: 1 }).withMessage(message.NULL_PARAM)
            .isMongoId().withMessage(message.INCORRECT_PARAM)
    ],
    stadiumController.getById);
// stadium.updateById
router.post('/stadium/updateById',
    [
        check('stadiumId')
            .exists().withMessage(message.NULL_PARAM)
            .trim().isLength({ min: 1 }).withMessage(message.NULL_PARAM)
            .isMongoId().withMessage(message.INCORRECT_PARAM)
    ],
    stadiumController.updateById);
router.post('/stadium/addImageById',
    [
        check('stadiumId')
            .exists().withMessage(message.NULL_PARAM)
            .trim().isLength({ min: 1 }).withMessage(message.NULL_PARAM)
            .isMongoId().withMessage(message.INCORRECT_PARAM),
        check('imageUrl')
            .isArray().withMessage(message.INCORRECT_PARAM)
            .not().isEmpty().withMessage(message.NULL_PARAM)
    ],
    stadiumController.addImageById);

router.post('/stadium/deleteImageById',
    [
        check(['stadiumId', 'imageUrl'])
            .exists().withMessage(message.NULL_PARAM)
            .trim().isLength({ min: 1 }).withMessage(message.NULL_PARAM),
        check('stadiumId')
            .isMongoId().withMessage(message.INCORRECT_PARAM)
    ],
    stadiumController.deleteImageById);

// stadium.getStadiumTypeList
router.post('/stadium/getStadiumTypeListById',
    [
        check('stadiumId')
            .exists().withMessage(message.NULL_PARAM)
            .trim().isLength({ min: 1 }).withMessage(message.NULL_PARAM)
            .isMongoId().withMessage(message.INCORRECT_PARAM)
    ],
    stadiumController.getStadiumTypeListById);

// Update Fair Price
router.post('/fair/updatePriceFair', fairController.updatePriceFair);

// Insert Many Price
router.post('/fair/insertPriceFair', fairController.insertPriceFair);

// stadium.update
router.post('/fair/updateNameStadiumChild', fairController.updateNameStadiumChild);

// update Stadium Price
router.post('/stadium/updateStadiumPrice', stadiumController.updateStadiumPrice);

// search fair booked
router.post('/fair/searchFairBooked', fairController.searchFairBooked);

// delete update Stadiumchild
router.post('/fair/insertDeleteFair', fairController.insertDeleteFair);

// stadium.getById
router.post('/stadium/getStadiumAgent', stadiumController.getStadiumAgent);


// login
// router.post('/login', loginController.verifyToken,loginController.login);
router.route('/oauth/facebook')
    .post(passport.authenticate('facebookToken', { session: false }), loginController.facebookOAuth);
//longlvq add login fake
router.post('/auth/facebook', [check(['fbId']).exists()], loginController.loginNotVeryfacebook)
// insert child stadium
router.post('/stadium/insertChildStadium', stadiumController.insertChildStadium);
// delete child stadium
router.post('/stadium/deleteChildStadium', stadiumController.deleteChildStadium);

// update Child Stadium for stadium
router.post('/stadium/updateChildStadium', stadiumController.updateChildStadium);

// Get All User
router.get('/user/getAllUserSearch', userController.getAllUser);

module.exports = router;