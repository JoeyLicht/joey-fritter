import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import FreetTypeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as freetTypeValidator from '../freetType/middleware';
import * as util from './util';
import FreetTypeModel from './model';
import FullStoryModel from '../fullStory/model';

const router = express.Router();

/**
 * Get all the freet types
 *
 * @name GET /api/freetTypes
 *
 * @return {FreetTypeResponse[]} - An array of all the freet types sorted in alphabetical order by freet type label
 */
/**
 * Get freet types by freet type label.
 *
 * @name GET /api/freetTypes?freetType=label
 *
 * @return {FreetTypeResponse[]} - An array of freets types with freet type label, label
 * @throws {400} - If freetTypeLabel is not given
 * @throws {404} - If no freet type has given freetTypeLabel
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetType !== undefined) {
      next();
      return;
    }
    
    const allFreetTypes = await FreetTypeCollection.findAll();
    const response = allFreetTypes.map(util.constructFreetTypeResponse);
    res.status(200).json(response);
  },
  [
    freetTypeValidator.isFreetTypeExists
  ],
  async (req: Request, res: Response) => {
    const filteredFreetTypes = await FreetTypeCollection.findAllByFreetType(req.query.freetType as string);
    const response = filteredFreetTypes.map(util.constructFreetTypeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a Freet Type
 *
 * @name POST /api/freetTypes/:contentId
 *
 * @param {string} freetTypeLabel - The Freet Type (label)
 * @param {string} contentId - The content id
 * @return {FreetTypeResponse} - The created Freet Type
 * @throws {409} - If Freet Type has already been applied to contentID
 * @throws {400} - If Freet Type not one of the predefined freet types
 * @throws {404} - If content with contentId does not exist
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the content
 *
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetTypeValidator.isValidFreetTypeLabel,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetTypeValidator.isUniqueCombination
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freetType = await FreetTypeCollection.addOne(req.params.freetId, req.body.freetTypeLabel, userId);
    res.status(201).json({
      message: `Your successfully labeled a freet with freet type: ${freetType.freetTypeLabel}`,
      freetType: util.constructFreetTypeResponse(freetType)
    });
  }
);

/**
 * Delete a freet type
 *
 * @name DELETE /api/freetTypes/:Id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or user is not the author of the FreetType
 * @throws {404} - If freetTypeId is not valid
 */
router.delete(
  '/:freetTypeId?',
  [
    userValidator.isUserLoggedIn,
    freetTypeValidator.isFreetTypeDeletable,
    freetTypeValidator.isValidFreetTypeModifier
  ],
  async (req: Request, res: Response) => {
    await FreetTypeCollection.deleteOne(req.params.freetTypeId);
    res.status(200).json({
      message: 'Your freet type was deleted successfully.'
    });
  }
);

export {router as freetTypeRouter};
