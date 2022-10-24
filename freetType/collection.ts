import type {HydratedDocument, Types} from 'mongoose';
import type {FreetType} from './model';
import FreetTypeModel from './model';

/**
 * This file contains a class with functionality to create Freet Types
 *
 * Note: HydratedDocument<FreetType> is the output of the FreetTypeModel() constructor,
 * and contains all the information in FreetType. https://mongoosejs.com/docs/typescript.html
 */
class FreetTypeCollection {
  /**
   * Add a new Freet Type
   *
   * @param {Types.ObjectId | string} publishedContent - The id of the published content
   * @param {string} freetTypeLabel - The Freet Type (label)
   * @param {Types.ObjectId | string} authorId - The id of the author of the freet
   * @return {Promise<HydratedDocument<FreetType>>} - The newly created Freet Type
   */
  static async addOne(publishedContent: Types.ObjectId | string, freetTypeLabel: string, authorId: Types.ObjectId | string): Promise<HydratedDocument<FreetType>> {
    const freetType = new FreetTypeModel({
      freetTypeLabel,
      publishedContent,
      authorId
    });
    await freetType.save(); // Saves user to MongoDB
    return (await freetType.populate('publishedContent')).populate('authorId');
  }

  /**
   * Get all the freets types in the database
   *
   * @return {Promise<HydratedDocument<FreetType>[]>} - An array of all of the freets types
   */
  static async findAll(): Promise<Array<HydratedDocument<FreetType>>> {
    // Retrieves freet types and sorts them alphabetically by freet type label
    return FreetTypeModel.find({}).sort({freetTypeLabel: 1}).populate('publishedContent').populate('authorId');
  }

  /**
   * Find a freet type by label.
   *
   * @param {string} label - The label of the freet type to find
   * @return {Promise<HydratedDocument<FreetType>> | Promise<null>} - The freet type with the given label, if any
   */
  static async findOneByfreetTypeLabel(label: string): Promise<HydratedDocument<FreetType>> {
    return FreetTypeModel.findOne({freetTypeLabel: label});
  }

  /**
   * Find a freet type by _id.
   *
   * @param {string} id - The id of the freet type to find
   * @return {Promise<HydratedDocument<FreetType>> | Promise<null>} - The freet type with the given _id, if any
   */
  static async findOneByFreetTypeId(id: string): Promise<HydratedDocument<FreetType>> {
    return FreetTypeModel.findOne({_id: id});
  }

  /**
   * Find a freet type by label and published content id.
   *
   * @param {string} label - The label of the freet type to find
   * @param {string} contentId - The id of the content to find
   * @return {Promise<HydratedDocument<FreetType>> | Promise<null>} - The freet type with the given label and contentId, if any
   */
  static async findOneByfreetTypeLabelAndContentId(label: string, contentId: string): Promise<HydratedDocument<FreetType>> {
    return FreetTypeModel.findOne({freetTypeLabel: label, publishedContent: contentId});
  }

  /**
   * Find a freet type published content id.
   *
   * @param {string} contentId - The id of the content to find
   * @return {Promise<HydratedDocument<FreetType>> | Promise<null>} - The freet type with the given contentId, if any
   */
  static async findOneByContentId(contentId: string): Promise<HydratedDocument<FreetType>> {
    return FreetTypeModel.findOne({publishedContent: contentId});
  }

  /**
   * Delete a freetType with given freetTypeId.
   *
   * @param {string} freetTypeId - The freetTypeId of freetType to delete
   * @return {Promise<Boolean>} - true if the freetType has been deleted, false otherwise
   */
  static async deleteOne(freetTypeId: Types.ObjectId | string): Promise<boolean> {
    const freetType = await FreetTypeModel.deleteOne({_id: freetTypeId});
    return freetType !== null;
  }

  /**
   * Get all the freet types by given label
   *
   * @param {string} label - The label of the freet type
   * @return {Promise<HydratedDocument<FreetType>[]>} - An array of all of the freet types
   */
  static async findAllByFreetType(label: string): Promise<Array<HydratedDocument<FreetType>>> {
    return FreetTypeModel.find({freetTypeLabel: label}).populate('publishedContent').populate('authorId');
  }
}

export default FreetTypeCollection;
