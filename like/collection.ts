import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

/**
 * This file contains a class with functionality to create Likes
 *
 * Note: HydratedDocument<Like> is the output of the LikeModel() constructor,
 * and contains all the information in Like. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a new Like
   *
   * @param {Types.ObjectId | string} publishedContent - The id of the published content
   * @param {Types.ObjectId | string} authorId - The id of the author of the freet
   * @return {Promise<HydratedDocument<Like>>} - The newly created Like
   */
  static async addOne(publishedContent: Types.ObjectId | string, authorId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      publishedContent,
      authorId
    });
    await like.save(); // Saves user to MongoDB
    return (await like.populate('publishedContent')).populate('authorId');
  }

  /**
   * Find a like by published content id and user id.
   *
   * @param {string} contentId - The id of the content to find
   * @param {string} userId - The id of the user to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null>} - The like with the given contentId and userID, if any
   */
  static async findOneByContentIdAndUserId(contentId: string, userId: string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({publishedContent: contentId, authorId: userId});
  }

  /**
   * Find likes by published content id
   *
   * @param {string} contentId - The id of the content to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null>} - The like with the given contentId, if any
   */
  static async findAllByContentId(contentId: string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({publishedContent: contentId}).populate('publishedContent').populate('authorId');
  }

  /**
   * Get all the likes in the database
   *
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
  static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    // Retrieves likes
    return LikeModel.find({}).populate('publishedContent').populate('authorId');
  }

  /**
   * Delete a like with given freetId.
   *
   * @param {string} freetId - The freetId of like to delete
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.deleteOne({publishedContent: freetId});
    return like !== null;
  }
}

export default LikeCollection;
