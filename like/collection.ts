import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import FreetModel from '../freet/model';

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
    return LikeModel.findOne({publishedContent: contentId, authorId: userId}).populate('publishedContent').populate('authorId');
  }

  /**
   * Find a like by published content id
   *
   * @param {string} contentId - The id of the content to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null>} - The like with the given contentId, if any
   */
  static async findOneByContentId(contentId: string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({publishedContent: contentId}).populate('publishedContent').populate('authorId');
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
    return LikeModel.find({}).sort({publishedContent: 1}).populate('publishedContent').populate('authorId');
  }

  /**
   * Delete a like with given freetId.
   *
   * @param {string} freetId - The freetId of like to delete
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string, userId: string): Promise<boolean> {
    const like = await LikeModel.deleteOne({publishedContent: freetId, authorId: userId});
    return like !== null;
  }

  /**
   * Delete all the likes by the given author
   *
   * @param {string} authorId - The id of author of like
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteMany({authorId});
  }

  /**
   * Delete all the likes by the given publishedContent
   *
   * @param {string} publishedContent - The id of author of publishedContent
   */
  static async deleteManyContent(publishedContent: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteMany({publishedContent});
  }

  /**
   * Delete all the likes of any freets posted by userId
   *
   * @param {string} userId - The id of user whose freets's likes we want to delete
   */
  static async deleteLikesOfUserFreets(userId: Types.ObjectId | string): Promise<void> {
    const authorFreets = await FreetModel.find({authorId: userId});
    const userFreetIds = authorFreets.map(freet => freet._id.toString());
    await LikeModel.deleteMany({publishedContent: {$in: userFreetIds}});
  }
}

export default LikeCollection;
