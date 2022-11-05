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
    const display: string[] = []; // Initialize display to empty (no users will initially see the full story)
    const fullStory = new FullStoryModel({
      authorId,
      publishedContent,
      fullStoryContent,
      display
    });
    await fullStory.save(); // Saves user to MongoDB
    return (await fullStory.populate('publishedContent')).populate('authorId');
  }

  /**
   * Find a full story by published content id.
   *
   * @param {string} contentId - The id of the content to find
   * @return {Promise<HydratedDocument<FullStory>> | Promise<null>} - The full story with the given contentId, if any
   */
  static async findOneByContentId(contentId: string): Promise<HydratedDocument<FullStory>> {
    return FullStoryModel.findOne({publishedContent: contentId}).populate('publishedContent').populate('authorId');
  }

  /**
   * Find a full story by _id.
   *
   * @param {string} id - The id of the full story to find
   * @return {Promise<HydratedDocument<FullStory>> | Promise<null>} - The full story with the given _id, if any
   */
  static async findOneByFullStoryId(id: string): Promise<HydratedDocument<FullStory>> {
    return FullStoryModel.findOne({_id: id});
  }

  /**
   * Get all the full stories in the database
   *
   * @return {Promise<HydratedDocument<FullStory>[]>} - An array of all of the full stories
   */
  static async findAll(): Promise<Array<HydratedDocument<FullStory>>> {
    // Retrieves full stories and sorts them from most to least recent
    return FullStoryModel.find({}).populate('publishedContent').populate('authorId');
  }

  /**
   * Delete a full story with given fullStoryId.
   *
   * @param {string} fullStoryId - The fullStoryId of full story to delete
   * @return {Promise<Boolean>} - true if the full story has been deleted, false otherwise
   */
  static async deleteOne(fullStoryId: Types.ObjectId | string): Promise<boolean> {
    const fullStory = await FullStoryModel.deleteOne({_id: fullStoryId});
    return fullStory !== null;
  }

  /**
   * Toggle the full story
   *
   * @param {string} fullStoryId - The id of the full story to be updated
   * @param {string} userId - The id of uer of that wants to toggle full story
   * @return {Promise<HydratedDocument<FullStory>>} - The newly updated full story
   */
  static async updateOne(fullStoryId: Types.ObjectId | string, userId: string): Promise<HydratedDocument<FullStory>> {
    const fullStory = await FullStoryModel.findOne({_id: fullStoryId});
    const temp: string[] = fullStory.display;
    if (temp.includes(userId)) {
      temp.filter(id => id !== userId);
    } else {
      temp.push(userId);
    }
    
    fullStory.display = temp;
    await fullStory.save();
    return (await fullStory.populate('publishedContent')).populate('authorId');
  }

  /**
   * Delete all the Full Stories by the given author
   *
   * @param {string} authorId - The id of author of Full Story
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FullStoryModel.deleteMany({authorId});
  }

  /**
   * Delete all the Full Stories by the given publishedContent
   *
   * @param {string} publishedContent - The id of Full Story of publishedContent
   */
  static async deleteManyContent(publishedContent: Types.ObjectId | string): Promise<void> {
    await FullStoryModel.deleteMany({publishedContent});
  }
}

export default FullStoryCollection;
