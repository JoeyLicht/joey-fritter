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
 * Get all the full stories
 *
 * @name GET /api/fullStories
 *
 * @return {FreetResponse[]} - A list of all the full stories
 */
/**
 * Get full stories by content id.
 *
 * @name GET /api/fullStories?contentId=id
 *
 * @return {FreetResponse[]} - The full stores with id, contentId
 * @throws {400} - If contentId is not given
 * @throws {404} - If no full story has contentId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if content id query parameter was supplied
    if (req.query.contentId !== undefined) {
      next();
      return;
    }

    const allFullStories = await FullStoryCollection.findAll();
    const response = allFullStories.map(util.constructFullStoryResponse);
    res.status(200).json(response);
  },
  [
    fullStoryValidator.isFullStoryExists
  ],
  async (req: Request, res: Response) => {
    const contentFullStory = await FullStoryCollection.findOneByContentId(req.query.contentId as string);
    const response = util.constructFullStoryResponse(contentFullStory);
    res.status(200).json(response);
  }
);

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
    fullStoryValidator.isValidFullStoryContent, //checky empty, stream empty spaces, over 1,000 words
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    fullStoryValidator.isFirstFullStory //check full story hasn't been applied to this freet
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const fullStory = await FullStoryCollection.addOne(req.params.freetId, req.body.fullStoryContent, userId);
    res.status(201).json({
      message: 'Your successfully added a Full Story',
      fullStory: util.constructFullStoryResponse(fullStory)
    });
  }
);

/**
 * Delete a full story
 *
 * @name DELETE /api/fullStories/:Id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or user is not the author of the Full Story
 * @throws {404} - If fullStoryId is not valid
 */
router.delete(
  '/:fullStoryId?',
  [
    userValidator.isUserLoggedIn,
    fullStoryValidator.isFullStoryDeletable,
    fullStoryValidator.isValidFullStoryModifier
  ],
  async (req: Request, res: Response) => {
    await FullStoryCollection.deleteOne(req.params.fullStoryId);
    res.status(200).json({
      message: 'Your full story was deleted successfully.'
    });
  }
);

/**
 * Toggle a full story
 *
 * @name PUT /api/fullStories/:id
 *
 * @return {FullStoryResponse} - the updated full story
 * @throws {403} - If the user is not logged in or user is not the author of the Full Story
 * @throws {404} - If fullStoryId is not valid
 */
router.put(
  '/:fullStoryId?',
  [
    userValidator.isUserLoggedIn,
    fullStoryValidator.isFullStoryDeletable,
    fullStoryValidator.isValidFullStoryModifier
  ],
  async (req: Request, res: Response) => {
    const fullStory = await FullStoryCollection.updateOne(req.params.fullStoryId);
    res.status(200).json({
      message: 'Your full story was toggled successfully.',
      fullStory: util.constructFullStoryResponse(fullStory)
    });
  }
);

export {router as fullStoryRouter};
