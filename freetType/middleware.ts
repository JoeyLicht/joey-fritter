import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetTypeCollection from '../freetType/collection';

/**
 * Checks if valid FreetTypeLabel
 */
const isValidFreetTypeLabel = async (req: Request, res: Response, next: NextFunction) => {
  const freetTypeRegex = /^[a-z]+$/i;
  if (!freetTypeRegex.test(req.body.freetTypeLabel)) {
    res.status(400).json({
      error: {
        freetType: 'Freet type must be a nonempty alphabetical string.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet type with freetType as freetTypeLabel in req.query exists
 */
const isFreetTypeExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.freetType) {
    res.status(400).json({
      error: 'Provided freet type must be nonempty.'
    });
    return;
  }

  const freetType = await FreetTypeCollection.findOneByfreetTypeLabel(req.query.freetType as string);
  if (!freetType) {
    res.status(404).json({
      error: `A freet type with freet type '${req.query.freetType as string}' does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a freet type with freetType as freetTypeLabel in req.body and contentId in req.params exists
 */
const isUniqueCombination = async (req: Request, res: Response, next: NextFunction) => {
  const freetType = await FreetTypeCollection.findOneByfreetTypeLabelAndContentId(req.body.freetTypeLabel as string, req.params.freetId.toString());
  if (freetType) {
    res.status(409).json({
      error: `Freet type ${req.body.freetTypeLabel as string} has already been applied to freet ${req.params.freetId.toString()}`
    });
    return;
  }

  next();
};

/**
 * Checks if a freet type with freetType as freetTypeLabel in req.body and contentId in req.params exists
 */
const isFreetTypeIdExists = async (req: Request, res: Response, next: NextFunction) => {
  const freetType = await FreetTypeCollection.findOneByFreetTypeId(req.params.freetTypeId.toString());
  if (!freetType) {
    res.status(404).json({
      error: `There doesn't exist a freet type with id: ${req.params.freetTypeId.toString()}`
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet type whose freetId is in req.params
 */
const isValidFreetTypeModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freetType = await FreetTypeCollection.findOneByFreetTypeId(req.params.freetTypeId.toString());
  const userId = freetType.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets types.'
    });
    return;
  }

  next();
};

export {
  isValidFreetTypeLabel,
  isFreetTypeExists,
  isUniqueCombination,
  isFreetTypeIdExists,
  isValidFreetTypeModifier
};
