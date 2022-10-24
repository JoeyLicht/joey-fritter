import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FullStoryCollection from '../fullStory/collection';

const mongoose = require('mongoose');

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFullStoryContent = (req: Request, res: Response, next: NextFunction) => {
  const {fullStoryContent} = req.body as {fullStoryContent: string};
  if (!fullStoryContent.trim()) {
    res.status(400).json({
      error: 'Full Story content must be at least one character long.'
    });
    return;
  }

  if (fullStoryContent.split(' ').length > 1000) {
    res.status(413).json({
      error: 'Full Story content must be no more than 1,000 words'
    });
    return;
  }

  next();
};

/**
 * Checks if a full story with contentId in req.params exists
 */
const isFirstFullStory = async (req: Request, res: Response, next: NextFunction) => {
  const fullStory = await FullStoryCollection.findOneByContentId(req.params.freetId.toString());
  if (fullStory) {
    res.status(409).json({
      error: 'A full story has already been applied to this freet'
    });
    return;
  }

  next();
};

/**
 * Checks if a full story with contentID in req.query exists
 */
const isFullStoryExists = async (req: Request, res: Response, next: NextFunction) => {
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

  const fullStory = await FullStoryCollection.findOneByContentId(req.query.contentId as string);
  if (!fullStory) {
    res.status(404).json({
      error: `A full story with content id '${req.query.contentId as string}' does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a full story with fullStoryId is req.params exists
 */
const isFullStoryDeletable = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.fullStoryId);
  const fullStory = validFormat ? await FullStoryCollection.findOneByFullStoryId(req.params.fullStoryId) : '';
  if (!fullStory) {
    res.status(404).json({
      error: {
        freetNotFound: `Full story with full story ID ${req.params.fullStoryId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the full story whose fullStoryId is in req.params
 */
const isValidFullStoryModifier = async (req: Request, res: Response, next: NextFunction) => {
  const fullStory = await FullStoryCollection.findOneByFullStoryId(req.params.fullStoryId.toString());
  const userId = fullStory.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' full stories.'
    });
    return;
  }

  next();
};

export {
  isValidFullStoryContent,
  isFirstFullStory,
  isFullStoryExists,
  isFullStoryDeletable,
  isValidFullStoryModifier
};
