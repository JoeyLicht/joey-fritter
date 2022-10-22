import type {HydratedDocument, Types} from 'mongoose';
import type {FullStory} from './model';
import FullStoryModel from './model';

/**
 * This file contains a class with functionality to create Full Stories
 *
 * Note: HydratedDocument<FullStory> is the output of the FullStoryModel() constructor,
 * and contains all the information in FullStory. https://mongoosejs.com/docs/typescript.html
 */
class FullStoryCollection {
  /**
   * Add a new Full Story
   *
   * @param {Types.ObjectId | string} publishedContent - The id of the published content
   * @param {string} fullStoryContent - The Full Story Content
   * @param {Types.ObjectId | string} authorId - The id of the author of the freet
   * @return {Promise<HydratedDocument<FullStory>>} - The newly created Full Story
   */
  static async addOne(publishedContent: Types.ObjectId | string, fullStoryContent: string, authorId: Types.ObjectId | string): Promise<HydratedDocument<FullStory>> {
    const fullStory = new FullStoryModel({
      authorId,
      publishedContent,
      fullStoryContent
    });
    await fullStory.save(); // Saves user to MongoDB
    return (await fullStory.populate('publishedContent')).populate('authorId');
  }
}

export default FullStoryCollection;
