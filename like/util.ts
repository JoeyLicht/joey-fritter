import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Like, PopulatedLike} from './model';
import UserCollection from 'user/collection';

// Update this if you add a property to the Like type!
type LikeResponse = {
  _id: string;
  userLiking: string;
  // authorPublishedContent: string;
};

/**
 * Transform a raw LIke object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A like object
 * @returns {LikeResponse} - The like object
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: PopulatedLike = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = likeCopy.authorId;
  delete likeCopy.authorId;
  const {content} = likeCopy.publishedContent;
  // delete likeCopy.publishedContent;
  return {
    ...likeCopy,
    _id: likeCopy._id.toString(),
    userLiking: username
    // authorPublishedContent: content
  };
};

export {
  constructLikeResponse
};
