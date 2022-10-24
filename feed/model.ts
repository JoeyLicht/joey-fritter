import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Feed
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Feed on the backend
export type Feed = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  politics: boolean;
  comedy: boolean;
  sports: boolean;
  engineering: boolean;
  happy: boolean;
  sad: boolean;
  // other: boolean;
};

export type PopulatedFeed = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  politics: boolean;
  comedy: boolean;
  sports: boolean;
  engineering: boolean;
  happy: boolean;
  sad: boolean;
  // other: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Feed stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FeedSchema = new Schema<Feed>({
  // The userId of the feed preferences
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The politics preference
  politics: {
    type: Boolean,
    required: true
  },
  // The comedy preference
  comedy: {
    type: Boolean,
    required: true
  },
  // The sports preference
  sports: {
    type: Boolean,
    required: true
  },
  // The engineering preference
  engineering: {
    type: Boolean,
    required: true
  },
  // The happy preference
  happy: {
    type: Boolean,
    required: true
  },
  // The sad preference
  sad: {
    type: Boolean,
    required: true
  }
  // // The other preference
  // other: {
  //   type: Boolean,
  //   required: true
  // }
});

const FeedModel = model<Feed>('Feed', FeedSchema);
export default FeedModel;
