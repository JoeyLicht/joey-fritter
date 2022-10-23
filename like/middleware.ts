import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';

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
 * Checks if a like with contentID in req.query exists
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.contentId) {
    res.status(400).json({
      error: 'Provided contentId must be nonempty.'
    });
    return;
  }

  const like = await LikeCollection.findAllByContentId(req.query.contentId as string);
  if (!like) {
    res.status(404).json({
      error: `A like with content id '${req.query.contentId as string}' does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a like with contentId in req.params and userId in req.session exists
 */
const isLikeDeletable = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findOneByContentIdAndUserId(req.params.freetId.toString(), req.session.userId.toString());
  if (!like) {
    res.status(403).json({
      error: 'User has not liked this freet'
    });
    return;
  }

  next();
};

export {
  isFirstLike,
  isLikeExists,
  isLikeDeletable
};
