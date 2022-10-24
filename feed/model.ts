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
};

export type PopulatedFeed = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
};

// Mongoose schema definition for interfacing with a MongoDB table
// Feed stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FeedSchema = new Schema<Feed>({
 
});

const FeedModel = model<Feed>('Feed', FeedSchema);
export default FeedModel;
