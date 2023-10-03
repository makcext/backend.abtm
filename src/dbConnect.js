import fetch from 'node-fetch';

const appId = 'abtmmd-jnnye';
const email = 'a@a.com';
const password = '1234567890';

const query = `query {
  restaurants: mongodbData(database: "sample_restaurants", collection: "restaurants") {
    _id
    borough
    cuisine
    name
    restaurant_id
  }
}`;

fetch(`https://realm.mongodb.com/api/client/v2.0/app/${appId}/graphql`, {
  method: 'POST',
  headers: {
    'email': email,
    'password': password,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));