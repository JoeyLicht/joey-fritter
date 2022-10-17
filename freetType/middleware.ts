import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetTypeCollection from '../freetType/collection';

/**
 * Checks if the current session user (if any) still exists in the database, for instance,
 * a user may try to post a freet in some browser while the account has been deleted in another or
 * when a user tries to modify an account in some browser while it has been deleted in another
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

export {
  isValidFreetTypeLabel
};
