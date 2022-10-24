import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';

const mongoose = require('mongoose');

/**
 * Checks if a like with contentId in req.params and userId in req.session exists
 */
const isFirstLike = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findOneByContentIdAndUserId(req.params.freetId.toString(), req.session.userId.toString());
  if (like) {
    res.status(409).json({
      error: 'User has already liked this freet'
    });
    return;
  }

  next();
};

/**
 * Checks if a like with contentID in req.params exists
 */
const isContentIdNonEmpty = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.contentId) {
    res.status(400).json({
      error: 'Provided contentId must be nonempty.'
    });
    return;
  }

  next();
};

/**
 * Checks if a like with contentId in req.params and userId in req.session exists
 */
const isLikeDeletable = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findOneByContentIdAndUserId(req.params.contentId.toString(), req.session.userId.toString());
  if (!like) {
    res.status(404).json({
      error: `User has not liked a freet with content id '${req.params.contentId}'`
    });
    return;
  }

  next();
};

/**
 * Checks if a like with contentID in req.query exists
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.contentId) {
    res.status(400).json({
      error: 'Provided contentId must be nonempty.'
    });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(req.query.contentId)) {
    res.status(404).json({
      error: `A like with content id '${req.query.contentId as string}' does not exist.`
    });
    return;
  }

  const like = await LikeCollection.findOneByContentId(req.query.contentId as string);
  if (!like) {
    res.status(404).json({
      error: `A like with content id '${req.query.contentId as string}' does not exist.`
    });
    return;
  }

  next();
};

export {
  isFirstLike,
  isContentIdNonEmpty,
  isLikeDeletable,
  isLikeExists
};
