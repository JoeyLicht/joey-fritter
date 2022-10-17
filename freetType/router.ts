import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import FreetTypeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetTypeValidator from '../freetType/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Create a Freet Type
 *
 * @name POST /api/freetTypes
 *
 * @param {string} freetTypeLabel - The Freet Type (label)
 * @return {FreetTypeResponse} - The created Freet Type
 * @throws {409} - If Freet Type is already taken
 * @throws {400} - If Freet Type is not in correct format
 *
 */
router.post(
  '/',
  [
    freetTypeValidator.isValidFreetTypeLabel
  ],
  async (req: Request, res: Response) => {
    const freetType = await FreetTypeCollection.addOne(req.body.freetTypeLabel);
    // Todo make a function (either in collection or middleware that tells you if freet type already exists)
    // req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your successfully created a freet type: ${freetType.freetTypeLabel}`,
      freetType: util.constructFreetTypeResponse(freetType)
    });
  }
);

/**
 * Get all the freet types
 *
 * @name GET /api/freetTypes
 *
 * @return {FreetResponse[]} - A list of all the freet types sorted in descending
 *                      order by date modified
 */

router.get(
  '/',
  async (req: Request, res: Response) => {
    const allFreetTypes = await FreetTypeCollection.findAll();
    const response = allFreetTypes.map(util.constructFreetTypeResponse);
    res.status(200).json(response);
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetTypeId?',
  [
    userValidator.isUserLoggedIn
    // freetValidator.isFreetExists,
    // freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await FreetTypeCollection.deleteOne(req.params.freetTypeId);
    res.status(200).json({
      message: 'Your freet type was deleted successfully.'
    });
  }
);

export {router as freetTypeRouter};
