# NodeJS Hapi with bearer token auth + Mongo DB

npm install --save hapi

npm install --save inert

npm install --save good

npm install --save good-console

npm install --save good-squeeze

## Various
npm install --save uuid

npm install --save base64url

## hapi-auth-bearer-token
ref. https://github.com/johnbrett/hapi-auth-bearer-token

ref. https://www.npmjs.com/package/hapi-auth-bearer-token

npm install --save hapi-auth-bearer-token


## MongoDB
npm install --save mongodb

use node_auth;
db.createUser({user:'node_auth',pwd:'node_auth',roles:["readWrite"]});
db.person.insert({key:'123456',test:'ABCD'});


## TEST
http://localhost:3000/test?access_token=123456

curl --request GET --url http://localhost:3000/test --header 'authorization: Bearer 123456'