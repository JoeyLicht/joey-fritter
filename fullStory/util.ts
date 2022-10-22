import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {FullStory, PopulatedFullStory} from './model';
import UserCollection from 'user/collection';

// Update this if you add a property to the FullStory type!
type FullStoryResponse = {
  _id: string;
  fullStoryAuthor: string;
  authorPublishedContent: string;
  fullStoryContent: string;
};

/**
 * Transform a raw FullStory object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<FullStory>} fullStory - A fullStory object
 * @returns {FullStoryResponse} - The fullStory object
 */
const constructFullStoryResponse = (fullStory: HydratedDocument<FullStory>): FullStoryResponse => {
  const fullStoryCopy: PopulatedFullStory = {
    ...fullStory.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = fullStoryCopy.authorId;
  delete fullStoryCopy.authorId;
  const {content} = fullStoryCopy.publishedContent;
  delete fullStoryCopy.publishedContent;
  return {
    ...fullStoryCopy,
    _id: fullStoryCopy._id.toString(),
    fullStoryAuthor: username,
    authorPublishedContent: content,
    fullStoryContent: fullStoryCopy.fullStoryContent
  };
};

export {
  constructFullStoryResponse
};
