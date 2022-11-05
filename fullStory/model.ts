import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Full Story
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet Story on the backend
export type FullStory = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  publishedContent: Types.ObjectId;
  fullStoryContent: string;
  display: string[];
};

export type PopulatedFullStory = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  publishedContent: Freet;
  fullStoryContent: string;
  display: string[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freet Types stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FullStorySchema = new Schema<FullStory>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The publishedContent
  publishedContent: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The fullStoryContent
  fullStoryContent: {
    type: String,
    required: true
  },
  // Display tracks whether who to show full story
  display: {
    type: [String],
    required: true
  }
});

const FullStoryModel = model<FullStory>('FullStory', FullStorySchema);
export default FullStoryModel;

