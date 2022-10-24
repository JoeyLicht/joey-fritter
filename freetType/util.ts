import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {FreetType, PopulatedFreetType} from './model';
import UserCollection from 'user/collection';

// Update this if you add a property to the FreetType type!
type FreetTypeResponse = {
  _id: string;
  freetTypeLabel: string;
  freetTypeAuthor: string;
  // authorPublishedContent: string;
};

/**
 * Transform a raw FreetType object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<FreetType>} freetType - A freetType object
 * @returns {FreetTypeResponse} - The freetType object
 */
const constructFreetTypeResponse = (freetType: HydratedDocument<FreetType>): FreetTypeResponse => {
  const freetTypeCopy: PopulatedFreetType = {
    ...freetType.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = freetTypeCopy.authorId;
  delete freetTypeCopy.authorId;
  const {content} = freetTypeCopy.publishedContent;
  // delete freetTypeCopy.publishedContent;
  return {
    ...freetTypeCopy,
    _id: freetTypeCopy._id.toString(),
    freetTypeLabel: freetTypeCopy.freetTypeLabel,
    freetTypeAuthor: username
    // authorPublishedContent: content
  };
};

export {
  constructFreetTypeResponse
};
