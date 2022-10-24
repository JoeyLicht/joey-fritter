import type {HydratedDocument, Types} from 'mongoose';
import type {Feed} from './model';
import FeedModel from './model';
import type {FreetType} from '../freetType/model';
import FreetTypeModel from '../freetType/model';
import FreetTypeCollection from '../freetType/collection';

/**
 * This file contains a class with functionality to create Feeds
 *
 * Note: HydratedDocument<Feed> is the output of the FeedModel() constructor,
 * and contains all the information in Feed. https://mongoosejs.com/docs/typescript.html
 */
class FeedCollection {
  /**
   * Get all the feeds in the database
   *
   * @return {Promise<HydratedDocument<Feed>[]>} - An array of all of the feeds
   */
  static async findAll(): Promise<Array<HydratedDocument<Feed>>> {
    // Retrieves feeds and sorts them alphabetically by username
    return FeedModel.find({}).sort({userId: 1}).populate('userId');
  }

  /**
   * Curate feed per feed preferences (sorted in decending order by date, not including content created by user)
   *
   * @param {string} userIdNum - The id of the user's feed to curate
   * @return {Promise<HydratedDocument<FreetType>[]>} - An array of all freet types matching feed preferences
   */
  static async curateFeed(userIdNum: string): Promise<Array<HydratedDocument<FreetType>>> {
    const preferences = await FeedCollection.findOneByUserId(userIdNum);

    const lisPreferences = [];

    if (preferences.politics) {
      lisPreferences.push('Politics');
    }

    if (preferences.sports) {
      lisPreferences.push('Sports');
    }

    if (preferences.comedy) {
      lisPreferences.push('Comedy');
    }

    if (preferences.engineering) {
      lisPreferences.push('Engineering');
    }

    if (preferences.happy) {
      lisPreferences.push('Happy');
    }

    if (preferences.sad) {
      lisPreferences.push('Sad');
    }

    // filter by user preferences and make sure to not include any freet types created by user
    const curatedFeed = await FreetTypeModel
      .find({freetTypeLabel: {$in: lisPreferences}, authorId: {$ne: userIdNum}})
      .sort({dateFreetType: -1})
      .populate('publishedContent').populate('authorId');

    return curatedFeed;
  }

  /**
   * Find a feed by userId
   *
   * @param {string} userIdNum - The id of the user's feed to find
   * @return {Promise<HydratedDocument<Feed>> | Promise<null>} - The feed with the given userIdNum, if any
   */
  static async findOneByUserId(userIdNum: string): Promise<HydratedDocument<Feed>> {
    return FeedModel.findOne({userId: userIdNum}).populate('userId');
  }

  /**
   * Add a new Feed
   *
   * @param {Types.ObjectId | string} userId - The id of the user of the feed
   * @param {string} politicsStr - Politics preference
   * @param {string} comedyStr - Comedy preference
   * @param {string} sportsStr - Sports preference
   * @param {string} engineeringStr - Engineering preference
   * @param {string} happyStr - Happy preference
   * @param {string} sadStr - Sad preference
   * @return {Promise<HydratedDocument<Feed>>} - The newly created Feed
   */
  static async addOne(userId: Types.ObjectId | string, politicsStr: string, comedyStr: string, sportsStr: string, engineeringStr: string, happyStr: string, sadStr: string): Promise<HydratedDocument<Feed>> {
    let politics = true;
    let comedy = true;
    let sports = true;
    let engineering = true;
    let happy = true;
    let sad = true;
    // let other = true;

    if (politicsStr === 'No') {
      politics = false;
    }

    if (comedyStr === 'No') {
      comedy = false;
    }

    if (politicsStr === 'No') {
      politics = false;
    }

    if (sportsStr === 'No') {
      sports = false;
    }

    if (engineeringStr === 'No') {
      engineering = false;
    }

    if (happyStr === 'No') {
      happy = false;
    }

    if (sadStr === 'No') {
      sad = false;
    }

    // if (otherStr === 'No') {
    //   other = false;
    // }

    const like = new FeedModel({
      userId,
      politics,
      comedy,
      sports,
      engineering,
      happy,
      sad
      // other
    });

    await like.save(); // Saves user to MongoDB
    return like.populate('userId');
  }

  /**
   * Update Existing Feed
   *
   * @param {Types.ObjectId | string} userIdNum - The id of the user of the feed
   * @param {string} politicsStr - Politics preference
   * @param {string} comedyStr - Comedy preference
   * @param {string} sportsStr - Sports preference
   * @param {string} engineeringStr - Engineering preference
   * @param {string} happyStr - Happy preference
   * @param {string} sadStr - Sad preference
   * @return {Promise<HydratedDocument<Feed>>} - The newly created Feed
   */
  static async updateOne(userIdNum: Types.ObjectId | string, politicsStr: string, comedyStr: string, sportsStr: string, engineeringStr: string, happyStr: string, sadStr: string): Promise<HydratedDocument<Feed>> {
    let politics = true;
    let comedy = true;
    let sports = true;
    let engineering = true;
    let happy = true;
    let sad = true;
    // let other = true;

    if (politicsStr === 'No') {
      politics = false;
    }

    if (comedyStr === 'No') {
      comedy = false;
    }

    if (politicsStr === 'No') {
      politics = false;
    }

    if (sportsStr === 'No') {
      sports = false;
    }

    if (engineeringStr === 'No') {
      engineering = false;
    }

    if (happyStr === 'No') {
      happy = false;
    }

    if (sadStr === 'No') {
      sad = false;
    }

    // if (otherStr === 'No') {
    //   other = false;
    // }

    const like = await FeedModel.findOne({userId: userIdNum});
    like.politics = politics;
    like.comedy = comedy;
    like.sports = sports;
    like.engineering = engineering;
    like.happy = happy;
    like.sad = sad;
    // like.other = other;

    await like.save(); // Saves user to MongoDB
    return like.populate('userId');
  }
}

export default FeedCollection;
