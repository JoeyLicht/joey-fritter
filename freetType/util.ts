import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {FreetType, PopulatedFreetType} from './model';

// Update this if you add a property to the FreetType type!
type FreetTypeResponse = {
  _id: string;
  freetTypeLabel: string;
};

/**
 * Transform a raw FreetType object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<FreetType>} freetType - A freetType object
 * @returns {FreetTypeResponse} - The freetType object without the password
 */
const constructFreetTypeResponse = (freetType: HydratedDocument<FreetType>): FreetTypeResponse => {
  const freetTypeCopy: PopulatedFreetType = {
    ...freetType.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  // const {content} = freetTypeCopy.publishedContent;
  // delete freetTypeCopy.publishedContent;
  // return {
  //   ...freetTypeCopy,
  //   _id: freetTypeCopy._id.toString(),
  //   freetTypeLabel: freetTypeCopy.freetTypeLabel,
  //   hello: content
  // };
  return {
    ...freetTypeCopy,
    _id: freetTypeCopy._id.toString(),
    freetTypeLabel: freetTypeCopy.freetTypeLabel
  };
};

export {
  constructFreetTypeResponse
};
