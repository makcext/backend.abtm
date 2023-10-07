import { response } from 'express';
import fetch from 'node-fetch';


const appId = 'abtmmd-jnnye';
const email = 'a@a.com';
const password = '1234567890';

const query = `query {
  abtmes(limit: 5, query: {}) {
    _id
    name
    age
  }
}`;

const mutation = `mutation ($name: String!, $sname: String!, $age: Int!) {
  insertOneAbtme(data: { name: $name, sname: $sname, age: $age }) {
    _id
    name
    sname
    age
  }
}`;

const variables = {
  name: 'Boss',
  sname: 'Bossov',
  age: 30
};

fetch(`https://realm.mongodb.com/api/client/v2.0/app/${appId}/graphql`, {
  method: 'POST',
  headers: {
    'email': email,
    'password': password,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: mutation, variables })
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error(error));

