import express from 'express';
import asyncify from 'express-asyncify';
import * as controller from './user.controller';

const router = asyncify(express.Router());

router.post('/signup', controller.signup);
router.post('/signin', controller.signin);

export default router;
