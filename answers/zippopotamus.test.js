const pactum = require('pactum');

describe('Retrieving data for US zip code 90210', () => {

    test('should yield HTTP status code 200', async () => {

        await pactum.spec()
            .get('http://api.zippopotam.us/us/90210')
            .expectStatus(200);
    });
});
