import express from 'express';
import asyncify from 'express-asyncify';
import * as controller from './user.controller';

const router = asyncify(express.Router());

router.post('/signup', controller.localRegister);

export default router;
