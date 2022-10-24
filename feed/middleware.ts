import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FeedCollection from '../feed/collection';

const mongoose = require('mongoose');

/**
 * Checks if valid user Inputs
 */
const isValidInputs = async (req: Request, res: Response, next: NextFunction) => {
  if (!/^(Yes|No)$/g.test(req.body.politics)) {
    res.status(400).json({
      error: {
        feed: 'politics input must match exactly one of the following: Yes, No'
      }
    });
    return;
  }

  if (!/^(Yes|No)$/g.test(req.body.comedy)) {
    res.status(400).json({
      error: {
        feed: 'comedy input must match exactly one of the following: Yes, No'
      }
    });
    return;
  }

  if (!/^(Yes|No)$/g.test(req.body.sports)) {
    res.status(400).json({
      error: {
        feed: 'sports input must match exactly one of the following: Yes, No'
      }
    });
    return;
  }

  if (!/^(Yes|No)$/g.test(req.body.engineering)) {
    res.status(400).json({
      error: {
        feed: 'engineering input must match exactly one of the following: Yes, No'
      }
    });
    return;
  }

  if (!/^(Yes|No)$/g.test(req.body.happy)) {
    res.status(400).json({
      error: {
        feed: 'happy input must match exactly one of the following: Yes, No'
      }
    });
    return;
  }

  if (!/^(Yes|No)$/g.test(req.body.sad)) {
    res.status(400).json({
      error: {
        feed: 'sad input must match exactly one of the following: Yes, No'
      }
    });
    return;
  }

  // if (!/^(Yes|No)$/g.test(req.body.other)) {
  //   res.status(400).json({
  //     error: {
  //       feed: 'other input must match exactly one of the following: Yes, No'
  //     }
  //   });
  //   return;
  // }

  next();
};

/**
 * Checks if a feed with userId in req.session exists
 */
const isFirstFeed = async (req: Request, res: Response, next: NextFunction) => {
  const feed = await FeedCollection.findOneByUserId(req.session.userId.toString());
  if (feed) {
    res.status(409).json({
      error: 'User has already initialized their feed'
    });
    return;
  }

  next();
};

/**
 * Checks if a feed with userId in req.session exists
 */
const isNotFirstFeed = async (req: Request, res: Response, next: NextFunction) => {
  const feed = await FeedCollection.findOneByUserId(req.session.userId.toString());
  if (!feed) {
    res.status(409).json({
      error: 'User needs to first initialize their feed'
    });
    return;
  }

  next();
};

export {
  isFirstFeed,
  isValidInputs,
  isNotFirstFeed
};
