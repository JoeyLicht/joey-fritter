import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as freetTypeValidator from '../freetType/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a Like
 *
 * @name POST /api/likes/:contentId
 *
 * @param {string} contentId - The content id
 * @return {LikeResponse} - The created like
 * @throws {409} - If like has already been applied to contentID by user
 * @throws {404} - If content with contentId does not exist
 * @throws {403} - If the user is not logged in or is the author of
 *                 the content
 *
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetReaction,
    likeValidator.isFirstLike
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const like = await LikeCollection.addOne(req.params.freetId, userId);
    res.status(201).json({
      message: 'You successfully liked a freet',
      like: util.constructLikeResponse(like)
    });
  }
);

/**
 * Get all the likes
 *
 * @name GET /api/likes
 *
 * @return {LikeResponse[]} - An array of all the likes
 */
/**
 * Get likes by content id
 *
 * @name GET /api/likes?contentId=id
 *
 * @return {LikeResponse[]} - The likes with id, contentId
 * @throws {400} - If contentId is not given
 * @throws {404} - If no like has content id
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetType !== undefined) {
      next();
      return;
    }

    const allLikes = await LikeCollection.findAll();
    const response = allLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  },
  [
    likeValidator.isLikeExists
  ],
  async (req: Request, res: Response) => {
    const filteredLikes = await LikeCollection.findAllByContentId(req.query.contentId as string);
    const response = filteredLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/likes/:Id
 *
 * @return {string} - A success message
 *
 * @throws {400} - If contentId is not given
 * @throws {403} - If the user is not logged in or user is not the creator of the like
 * @throws {404} - If no like has content id
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isLikeDeletable,
    likeValidator.isLikeExists
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.deleteOne(req.params.likeId);
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);

export {router as likeRouter};
