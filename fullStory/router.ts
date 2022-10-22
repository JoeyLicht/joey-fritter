import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import FreetTypeCollection from '../FreetType/collection';
import FullStoryCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as fullStoryValidator from '../fullStory/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a Full Story
 *
 * @name POST /api/fullStories/:contentId
 *
 * @param {string} fullStoryContent - The Full Story content
 * @param {string} contentId - The content id
 * @return {FreetTypeResponse} - The created Full Story
 * @throws {400} - if fullStoryContent is empty or a stream of empty spaces
 * @throws {400} - if contentId does not exist
 * @throws {403} - if the user is not logged in or is not the author of the content
 * @throws {409} - if the full story has already been applied to contentID
 * @throws {413} - if the fullStoryContent is more than 1,000 words long
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    // freetTypeValidator.isValidFreetTypeLabel, //checky empty, stream empty spaces, over 1,000 words
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
    // freetTypeValidator.isFirstFullStory //check full story hasn't been applied to this freet
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const fullStory = await FullStoryCollection.addOne(req.params.freetId, req.body.fullStoryContent, userId);
    res.status(201).json({
      message: `Your successfully added a Full Story`,
      fullStory: util.constructFullStoryResponse(fullStory)
    });
  }
);

export {router as fullStoryRouter};
