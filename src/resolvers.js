const { ObjectID } = require('mongodb');

async function getRestaurants(db, query, sortBy, limit) {
  const cursor = db.collection('restaurants').find(query);
  if (sortBy) {
    const [field, order] = sortBy.split('_');
    cursor.sort({ [field]: order === 'ASC' ? 1 : -1 });
  }
  if (limit) {
    cursor.limit(limit);
  }
  const restaurants = await cursor.toArray();
  return restaurants.map(restaurant => ({
    _id: restaurant._id.toString(),
    restaurant_id: restaurant.restaurant_id,
    name: restaurant.name,
    borough: restaurant.borough,
    cuisine: restaurant.cuisine,
    address: restaurant.address,
    grades: restaurant.grades.map(grade => ({
      date: grade.date,
      grade: grade.grade,
      score: grade.score,
    })),
  }));
}

const resolvers = {
  Query: {
    restaurant: async (_, { query }, { db }) => {
      const restaurant = await db.collection('restaurants').findOne(query);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      return {
        _id: restaurant._id.toString(),
        restaurant_id: restaurant.restaurant_id,
        name: restaurant.name,
        borough: restaurant.borough,
        cuisine: restaurant.cuisine,
        address: restaurant.address,
        grades: restaurant.grades.map(grade => ({
          date: grade.date,
          grade: grade.grade,
          score: grade.score,
        })),
      };
    },
    restaurants: async (_, { query, sortBy, limit = 100 }, { db }) => {
      const restaurants = await getRestaurants(db, query, sortBy, limit);
      return restaurants;
    },
  },
  Mutation: {
    insertOneRestaurant: async (_, { data }, { db }) => {
      const result = await db.collection('restaurants').insertOne(data);
      const restaurant = await db.collection('restaurants').findOne({ _id: result.insertedId });
      return {
        _id: restaurant._id.toString(),
        restaurant_id: restaurant.restaurant_id,
        name: restaurant.name,
        borough: restaurant.borough,
        cuisine: restaurant.cuisine,
        address: restaurant.address,
        grades: restaurant.grades.map(grade => ({
          date: grade.date,
          grade: grade.grade,
          score: grade.score,
        })),
      };
    },
    updateOneRestaurant: async (_, { query, set }, { db }) => {
      const result = await db.collection('restaurants').findOneAndUpdate(query, { $set: set }, { returnOriginal: false });
      if (!result.value) {
        throw new Error('Restaurant not found');
      }
      const restaurant = result.value;
      return {
        _id: restaurant._id.toString(),
        restaurant_id: restaurant.restaurant_id,
        name: restaurant.name,
        borough: restaurant.borough,
        cuisine: restaurant.cuisine,
        address: restaurant.address,
        grades: restaurant.grades.map(grade => ({
          date: grade.date,
          grade: grade.grade,
          score: grade.score,
        })),
      };
    },
    deleteOneRestaurant: async (_, { query }, { db }) => {
      const restaurant = await db.collection('restaurants').findOne(query);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      await db.collection('restaurants').deleteOne(query);
      return {
        _id: restaurant._id.toString(),
        restaurant_id: restaurant.restaurant_id,
        name: restaurant.name,
        borough: restaurant.borough,
        cuisine: restaurant.cuisine,
        address: restaurant.address,
        grades: restaurant.grades.map(grade => ({
          date: grade.date,
          grade: grade.grade,
          score: grade.score,
        })),
      };
    },
    upsertOneRestaurant: async (_, { query, data }, { db }) => {
      const result = await db.collection('restaurants').findOneAndUpdate(query, { $set: data }, { upsert: true, returnOriginal: false });
      const restaurant = result.value;
      return {
        _id: restaurant._id.toString(),
        restaurant_id: restaurant.restaurant_id,
        name: restaurant.name,
        borough: restaurant.borough,
        cuisine: restaurant.cuisine,
        address: restaurant.address,
        grades: restaurant.grades.map(grade => ({
          date: grade.date,
          grade: grade.grade,
          score: grade.score,
        })),
      };
    },
    deleteManyRestaurants: async (_, { query }, { db }) => {
      const result = await db.collection('restaurants').deleteMany(query);
      return { deletedCount: result.deletedCount };
    },
    updateManyRestaurants: async (_, { query, set }, { db }) => {
      const result = await db.collection('restaurants').updateMany(query, { $set: set });
      return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
    },
    insertManyRestaurants: async (_, { data }, { db }) => {
      const result = await db.collection('restaurants').insertMany(data);
      const restaurants = await db.collection('restaurants').find({ _id: { $in: result.insertedIds } }).toArray();
      return restaurants.map(restaurant => ({
        _id: restaurant._id.toString(),
        restaurant_id: restaurant.restaurant_id,
        name: restaurant.name,
        borough: restaurant.borough,
        cuisine: restaurant.cuisine,
        address: restaurant.address,
        grades: restaurant.grades.map(grade => ({
          date: grade.date,
          grade: grade.grade,
          score: grade.score,
        })),
      }));
    },
    replaceOneRestaurant: async (_, { query, data }, { db }) => {
      const result = await db.collection('restaurants').findOneAndReplace(query, data, { returnOriginal: false });
      if (!result.value) {
        throw new Error('Restaurant not found');
      }
      const restaurant = result.value;
      return {
        _id: restaurant._id.toString(),
        restaurant_id: restaurant.restaurant_id,
        name: restaurant.name,
        borough: restaurant.borough,
        cuisine: restaurant.cuisine,
        address: restaurant.address,
        grades: restaurant.grades.map(grade => ({
          date: grade.date,
          grade: grade.grade,
          score: grade.score,
        })),
      };
    },
  },
  Restaurant: {
    _id: (restaurant) => restaurant._id.toString(),
  },
  RestaurantGrade: {
    date: (grade) => grade.date.toISOString(),
  },
};

module.exports = resolvers;