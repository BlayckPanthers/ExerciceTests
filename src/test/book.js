import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import chaiNock from 'chai-nock';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import nock from 'nock';

import server from '../server';
import resetDatabase from '../utils/resetDatabase';

chai.use(chaiHttp);
chai.use(chaiNock);
chai.use(chaiAsPromised);
// tout les packages et fonction nescessaire au test sont importé ici, bon courage

// fait les Tests d'integration en premier
describe('Test intégration (Empty database)', () => {
    let emptyBooks = {
        books: []
    }
    beforeEach(() => {
        resetDatabase(path.normalize(`${__dirname}/../data/books.json`), emptyBooks);
    })
    it('toto', done => {
        chai
            .request(server)
            .get('/book')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.books).to.be.a('array');
                expect(res.body.books.length).to.equal(0);
                done();
            });
    })

});

describe('Test intégration (Mocked Database)', () => {


})

describe('Test unitaire (simulation ok)', () => {

})

describe('Test unitaire (simulation mauvaise réponse)', () => {

})