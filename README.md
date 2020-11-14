# Related Links

## Client Repo
https://github.com/Crookinator/guide-dog-log-client 
## Deployed Links
Client:
https://crookinator.github.io/guide-dog-log-client/ 
API:
https://mighty-hamlet-83462.herokuapp.com

# List of Technologies 
	- Express
	- Mongoose
	- mongoDB
	- JavaScript
	- TextMate (editor)

# Planning & Problem Solving
I thought out what I would want to do on the client side application then determined what would be needed as far as resources on the API side. I planned out the Posts resource as a CRUD resource. I tackled the schema first and then worked on the endpoints for the api. By starting at the schema I was able to trace any issues easily by following the current chain I was working on back to the schema. Often times I'd find the error or issue quckly with this method. 

# Future Plans
In the APIs current state there is only one additional resource to the authentication resource with the one relationship of user to posts. In future versions I'd like to finish building out the user resource to include more "keys" on the schema to fully build out a "profile" as well as adding relationships for comments on posts.

## ERD description
User -|--< Post
This is a relationship that shows a single User can have many Posts. This is how I've set up the API resource of posts.  

## API
### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/` | `users#changepw`  |
| DELETE | `/sign-out/`        | `users#signout`   |

#### POST /sign-up

Request:

```sh
curl --include --request POST http://localhost:4741/sign-up \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password",
      "password_confirmation": "an example password"
    }
  }'
```

```sh
curl-scripts/sign-up.sh
```

Response:

```md
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email"
  }
}
```

#### POST /sign-in

Request:

```sh
curl --include --request POST http://localhost:4741/sign-in \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password"
    }
  }'
```

```sh
curl-scripts/sign-in.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email",
    "token": "33ad6372f795694b333ec5f329ebeaaa"
  }
}
```

#### PATCH /change-password/

Request:

```sh
curl --include --request PATCH http://localhost:4741/change-password/ \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "an example password",
      "new": "super sekrit"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa curl-scripts/change-password.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

#### DELETE /sign-out/

Request:

```sh
curl --include --request DELETE http://localhost:4741/sign-out/ \
  --header "Authorization: Bearer $TOKEN"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa curl-scripts/sign-out.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

### Post
POST  /posts 
PATCH   /posts/:id
GET   /posts
GET   /posts/:id
DELETE  /posts/:id

### Curl Scripts 
``` index.sh
#!/bin/sh

API="http://localhost:4741"
URL_PATH="/posts"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
`
``` show.sh
#!/bin/sh

API="http://localhost:4741"
URL_PATH="/posts"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo

`
```md create.md
#!/bin/bash

API="http://localhost:4741"
URL_PATH="/posts"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "post": {
      "text": "'"${TEXT}"'",
      "guideDogName": "'"${DGNAME}"'",
      "yearsOfService": "'"${SERVICEYEARS}"'",
      "breed": "'"${BREED}"'",
      "title": "'"${TITLE}"'"
    }
  }'

echo

`
```md update.sh
#!/bin/bash

API="http://localhost:4741"
URL_PATH="/posts"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "post": {
      "title": "'"${TITLE}"'",
      "text": "'"${TEXT}"'",
      "guideDogName": "'"${DGNAME}"'",
      "yearsOfService": "'"${SERVICEYEARS}"'",
      "breed": "'"${BREED}"'"
    }
  }'

echo

`
```md destroy.sh

`


## [License](LICENSE)

1. All content is licensed under a CC­BY­NC­SA 4.0 license.
1. All software code is licensed under GNU GPLv3. For commercial use or
    alternative licensing, please contact legal@ga.co.
