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
import * as freetTypeUtil from '../freetType/util';
import * as freetUtil from '../freet/util';
import FeedModel from './model';
import FreetTypeModel from '../freetType/model';

const router = express.Router();

/**
 * Create a new feed.
 *
 * @name POST /api/feeds
 *
 * @param {string} politics - Politics preference
 * @param {string} comedy - Comedy preference
 * @param {string} sports - Sports preference
 * @param {string} engineering - Engineering preference
 * @param {string} happy - Happy preference
 * @param {string} sad - Sad preference
 * @return {FeedResponse} - The created feed
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user inputs don't match 'Yes' or 'No'
 * @throws {409} - If the user has already created a feed
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isFirstFeed,
    feedValidator.isValidInputs
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const feed = await FeedCollection.addOne(userId, req.body.politics, req.body.comedy, req.body.sports, req.body.engineering, req.body.happy, req.body.sad);

    res.status(201).json({
      message: 'Your feed was created successfully.',
      feed: util.constructFeedResponse(feed)
    });
  }
);

/**
 * Update Feed
 *
 * @name PATCH /api/feeds
 *
 * @param {string} politics - Politics preference
 * @param {string} comedy - Comedy preference
 * @param {string} sports - Sports preference
 * @param {string} engineering - Engineering preference
 * @param {string} happy - Happy preference
 * @param {string} sad - Sad preference
 * @return {FullStoryResponse} - the updated feed
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user inputs don't match 'Yes' or 'No'
 * @throws {409} - If the user has not already created a feed
 */
router.patch(
  '/',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isNotFirstFeed,
    feedValidator.isValidInputs
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const feed = await FeedCollection.updateOne(userId, req.body.politics, req.body.comedy, req.body.sports, req.body.engineering, req.body.happy, req.body.sad);

    res.status(201).json({
      message: 'Your feed was updated successfully.',
      feed: util.constructFeedResponse(feed)
    });
  }
);

/**
 * Curate feed
 *
 * @name GET /api/feeds
 *
 * @return {FreetTypeResponse[]} - curated feed per user feed preferences sorted in decending order by date
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the user has not already created a feed
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    feedValidator.isNotFirstFeed
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const curated = await FeedCollection.curateFeed(userId);
    const response = curated
                            .map(freetTypeUtil.constructFreetTypeResponse)
                            .map(x => x.publishedContent);
                            // .map(freetUtil.constructFreetResponse);
    res.status(200).json(response);
  }
);

// /**
//  * Get all the feeds
//  *
//  * @name GET /api/feeds
//  *
//  * @return {FeedResponse[]} - A list of all the feeds
//  */
// router.get(
//   '/',
//   async (req: Request, res: Response, next: NextFunction) => {
//     // await FreetTypeModel.deleteMany({});
//     const allFeeds = await FeedCollection.findAll();
//     const response = allFeeds.map(util.constructFeedResponse);
//     res.status(200).json(response);
//   }
// );

export {router as feedRouter};

