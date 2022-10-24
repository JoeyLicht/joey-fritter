import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import FeedCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as freetTypeValidator from '../freetType/middleware';
import * as feedValidator from '../feed/middleware';
import * as util from './util';

const router = express.Router();


export {router as feedRouter};
