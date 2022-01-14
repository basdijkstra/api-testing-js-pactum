const pactum = require('pactum');

describe('Retrieving user data for users', () => {

    // Instead of this ...
    test('User with ID 1 has name "Leanne Graham"', async () => {

        await pactum.spec()
            .get('http://jsonplaceholder.typicode.com/users/1')
            .expectJsonMatch('name', 'Leanne Graham')
    });

    // And this ...
    test('User with ID 2 has name "Ervin Howell"', async () => {

        await pactum.spec()
            .get('http://jsonplaceholder.typicode.com/users/2')
            .expectJsonMatch('name', 'Ervin Howell')
    });

    // And this ...
    test('User with ID 3 has name "Clementine Bauch"', async () => {

        await pactum.spec()
            .get('http://jsonplaceholder.typicode.com/users/3')
            .expectJsonMatch('name', 'Clementine Bauch')
    });

    // It's better to do this!
    test.each(
        [[1,'Leanne Graham'], [2,'Ervin Howell'], [3,'Clementine Bauch']]
    )('User with ID %i has name %s', async (userId, expectedName) => {

        await pactum.spec()
            .get('http://jsonplaceholder.typicode.com/users/{user}')
            .withPathParams('user', userId)
            .expectJsonMatch('name', expectedName)
    });

});