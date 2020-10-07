import express from 'express';
export const router = express.Router();
import { check, oneOf } from 'express-validator';
import { advancedResults, protect, checkInputError } from '../../middleware';
import {
    ALPHA_WHITESPACE_REGEX,
    INVALID_URL_MSG,
    INVALID_PHONE_NUMBER_MSG,
    INVALID_EMAIL_MSG,
    INVALID_ALPHA_SPACE_MSG,
    NO_FIELD_UPDATED_MSG,
} from '../../utils';

// Import organisation controllers
import {
    getOrganisations,
    getOrganisation,
    createOrganisation,
    updateOrganisation,
    deleteOrganisation
} from '../../controllers/organisations';

// Define input validation
const validateCreateOrganisationFields = [
    check('name', INVALID_ALPHA_SPACE_MSG('name')).trim().notEmpty().matches(ALPHA_WHITESPACE_REGEX),
    check('type', INVALID_ALPHA_SPACE_MSG('type')).optional().trim().matches(ALPHA_WHITESPACE_REGEX),
    check('about', INVALID_ALPHA_SPACE_MSG('about')).trim().notEmpty().matches(ALPHA_WHITESPACE_REGEX),
    check('website_url', INVALID_URL_MSG).optional().trim().isURL(),
    check('handphone', INVALID_PHONE_NUMBER_MSG).trim().notEmpty(),
    check('email', INVALID_EMAIL_MSG).trim().notEmpty().isEmail().normalizeEmail()
]

const validateUpdateOrganisationFields = [
    oneOf([
        check('name').exists(),
        check('type').exists(),
        check('about').exists(),
        check('website_url').exists(),
        check('handphone').exists(),
        check('email').exists()], NO_FIELD_UPDATED_MSG),
    check('name', INVALID_ALPHA_SPACE_MSG('name')).optional().trim().notEmpty().matches(ALPHA_WHITESPACE_REGEX),
    check('type', INVALID_ALPHA_SPACE_MSG('type')).optional().trim().matches(ALPHA_WHITESPACE_REGEX),
    check('about', INVALID_ALPHA_SPACE_MSG('about')).optional().trim().notEmpty().matches(ALPHA_WHITESPACE_REGEX),
    check('website_url', INVALID_URL_MSG).optional().trim().isURL(),
    check('handphone', INVALID_PHONE_NUMBER_MSG).optional().trim().notEmpty(),
    check('email', INVALID_EMAIL_MSG).optional().trim().notEmpty().isEmail().normalizeEmail()
]

// Map public routes to controller
router
    .route('/')
    .get(advancedResults('organisations'), getOrganisations)

router
    .route('/:id')
    .get(getOrganisation)

// Use auth middleware
router.use(protect);

// Map routes to controller
router
    .route('/')
    .post(validateCreateOrganisationFields, checkInputError, createOrganisation);

router
    .route('/:id')
    .put(validateUpdateOrganisationFields, checkInputError, updateOrganisation)
    .delete(deleteOrganisation);