import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Feed, PopulatedFeed} from './model';
import UserCollection from 'user/collection';

// Update this if you add a property to the Feed type!
type FeedResponse = {
  _id: string;
  user: string;
};

/**
 * Transform a raw LIke object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Feed>} feed - A feed object
 * @returns {FeedResponse} - The feed object
 */
const constructFeedResponse = (feed: HydratedDocument<Feed>): FeedResponse => {
  const feedCopy: PopulatedFeed = {
    ...feed.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = feedCopy.userId;
  delete feedCopy.userId;
  return {
    ...feedCopy,
    _id: feedCopy._id.toString(),
    user: username
  };
};

export {
  constructFeedResponse
};
