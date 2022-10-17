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
   * @param {string} freetTypeLabel - The Freet Type (label)
   * @return {Promise<HydratedDocument<FreetType>>} - The newly created Freet Type
   */
  static async addOne(freetTypeLabel: string): Promise<HydratedDocument<FreetType>> {
    const freetType = new FreetTypeModel({
      freetTypeLabel
    });
    await freetType.save(); // Saves user to MongoDB
    return freetType;
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<FreetType>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetTypeModel.find({}).sort({freetTypeLabel: -1});
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetTypeId: Types.ObjectId | string): Promise<boolean> {
    const freetType = await FreetTypeModel.deleteOne({_id: freetTypeId});
    return freetType !== null;
  }
}

export default FreetTypeCollection;
