const pactum = require('pactum');

describe('Retrieving data for user with ID 1', () => {

    test('should yield HTTP status code 200', async () => {

        await pactum.spec()
            .get('http://jsonplaceholder.typicode.com/users/1')
            .expectStatus(200)
    });

    test('should yield Content-Type header containing value "application/json"', async () => {

        await pactum.spec()
            .get('http://jsonplaceholder.typicode.com/users/1')
            .expectHeaderContains('content-type', 'application/json')
    });

    test('should yield "name" JSON body element with value "Leanne Graham"', async () => {

        await pactum.spec()
            .get('http://jsonplaceholder.typicode.com/users/1')
            .expectJsonMatch('name', 'Leanne Graham')
    });

    test('should yield "Gwenborough" as the city within the address', async () => {

        await pactum.spec()
            .get('http://jsonplaceholder.typicode.com/users/1')
            .expectJsonMatch('address.city', 'Gwenborough')
    });

});

describe('Retrieving all user data', () => {

    test('should yield a list of 10 users', async () => {

        await pactum.spec()
            .get('http://jsonplaceholder.typicode.com/users')
            .expectJsonLength(10)
    });
});

describe('Posting a new post item', () => {

    test('should yield HTTP status code 201', async () => {

        let new_post = {
            "title": "My awesome new post title",
            "body": "My awesome new post body",
            "userId": 1
        }

        await pactum.spec()
            .post('http://jsonplaceholder.typicode.com/posts')
            .withJson(new_post)
            .expectStatus(201)
    });
});
