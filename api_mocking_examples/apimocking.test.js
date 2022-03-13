const pactum = require('pactum');
const { mock, settings } = require('pactum');
const { like } = require('pactum-matchers');

describe('Demonstrating that Pactum API mocking can', () => {

    beforeEach(async () => {

        settings.setLogLevel('ERROR');

        await mock.start(9876);
    });

    test('return a basic REST response', async () => {

        addHelloWorldResponse();

        await pactum.spec()
            .get('http://localhost:9876/api/hello-world')
            .expectStatus(200)
            .expectBody('Hello, world!')
    });

    test('match requests based on query parameter values', async () => {

        addQueryParameterRequestMatchingResponses();

        await pactum.spec()
            .get('http://localhost:9876/api/zip?zipcode=90210')
            .expectStatus(200)
            .expectJsonMatch('city', 'Beverly Hills')

        await pactum.spec()
            .get('http://localhost:9876/api/zip?zipcode=12345')
            .expectStatus(200)
            .expectJsonMatch('city', 'Schenectady')

        await pactum.spec()
            .get('http://localhost:9876/api/zip?zipcode=55555')
            .expectStatus(404)
    });

    test('return a REST response with a delay', async () => {

        addDelayedResponse();

        await pactum.spec()
            .get('http://localhost:9876/api/delay')
            .expectStatus(200)
            .expectResponseTime(1000)
    });

    test.each(
        [[1], [2], [3]]
    )('return a response with the correct user ID for user %i', async (userId) => {

        addReusePathParameterValueResponse();

        await pactum.spec()
            .get('http://localhost:9876/api/user/{user}')
            .withPathParams('user', userId)
            .expectStatus(200)
            .expectJsonMatch('message', `Returning data for user ${userId}`)
    });

    afterEach(async () => {

        await mock.stop()
    });
});

function addHelloWorldResponse() {

    mock.addInteraction({
        request: {
            method: 'GET',
            path: '/api/hello-world'
        },
        response: {
            status: 200,
            body: 'Hello, world!'
        }
    });
}

function addQueryParameterRequestMatchingResponses() {

    mock.addInteraction({
        request: {
            method: 'GET',
            path: '/api/zip',
            queryParams: {
                zipcode: 90210
            }
        },
        response: {
            status: 200,
            body: {
                zipcode: 90210,
                city: 'Beverly Hills'
            }
        }
    });

    mock.addInteraction({
        request: {
            method: 'GET',
            path: '/api/zip',
            queryParams: {
                zipcode: 12345
            }
        },
        response: {
            status: 200,
            body: {
                zipcode: 12345,
                city: 'Schenectady'
            }
        }
    });
}

function addDelayedResponse() {

    mock.addInteraction({
        request: {
            method: 'GET',
            path: '/api/delay'
        },
        response: {
            status: 200,
            fixedDelay: 1000
        }
    })
}

function addReusePathParameterValueResponse() {

    mock.addInteraction({
        request: {
            method: 'GET',
            path: '/api/user/{id}',
            pathParams: {
                id: like('random-id')
            }
        },
        stores: {
            userId: 'req.pathParams.id'
        },
        response: {
            status: 200,
            body: {
                message: `Returning data for user $S{userId}`
            }
        }
    });
}