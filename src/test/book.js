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
    it('should send empty books', done => {
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
    it('should add a book ', done => {
        chai
            .request(server)
            .post('/book')
            .send({
                "id": "55b7d315-1a5f-4b13-a665-c382a6c71756",
                "title": "Oui-Oui contre Dominique Strauss-Kahn",
                "years": "2015",
                "pages": "650"
            })
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.equal('book successfully added');
                done();
            });

    })

});

describe('Test intégration (Mocked Database)', () => {
    let book = {
        books: [{
            'id': '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9',
            'title': 'Coco raconte Channel 2',
            'years': 1990,
            'pages': 400
        }]
    }
    beforeEach(() => {
        resetDatabase(path.normalize(`${__dirname}/../data/books.json`), book);
    })

    it('should update data about a book', done => {
        chai
            .request(server)
            .put('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .send({
                "pages": "6"
            })
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.equal('book successfully updated');
                done();
            });

    })

    it('should retrieve data about a book in function of id', done => {
        chai
            .request(server)
            .get('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.equal('book fetched');
                expect(res.body.book).to.be.a('object');
                expect(res.body.book.years).to.be.a('number');
                expect(res.body.book.years).to.equal(1990);
                expect(res.body.book.pages).to.be.a('number');
                expect(res.body.book.pages).to.equal(400);
                expect(res.body.book.title).to.be.a('string');
                expect(res.body.book.title).to.equal('Coco raconte Channel 2');
                done();
            });
    })

    it('should delete a book', done => {
        chai
            .request(server)
            .delete('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.equal('book successfully deleted');
                done();
            });
    })
})

describe('Test unitaire (simulation ok)', () => {

    beforeEach(()=>{
        nock.cleanAll()
    })
    it('should send http status 200 and send an array',done=>{
        let emptyBooks = {
            books: []
        }
        nock("http://localhost:8080")
        .get('/book')
        .reply(200,emptyBooks)
            chai
            .request('http://localhost:8080')
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
    it('should for post send http status 200 and send an message',done=>{
        let message = {
            message: 'book successfully added'
        }
        nock("http://localhost:8080")
        .post('/book')
        .reply(200,message)
            chai
            .request('http://localhost:8080')
            .post('/book')
            .send({
                "id": "55b7d315-1a5f-4b13-a665-c382a6c71756",
                "title": "Oui-Oui contre Dominique Strauss-Kahn",
                "years": "2015",
                "pages": "650"
            })
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.equal('book successfully added');
                done();
            });
    })
    it('should for put send http status 200 and send an message',done=>{
        let message = {
            message: 'book successfully updated'
        }
        nock("http://localhost:8080")
        .put('/book/55b7d315-1a5f-4b13-a665-c382a6c71756')
        .reply(200,message)
            chai
            .request('http://localhost:8080')
            .put('/book/55b7d315-1a5f-4b13-a665-c382a6c71756')
            .send({
                "pages": "650"
            })
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.equal('book successfully updated');
                done();
            });
    })
    it('should for delete send http status 200 and send an message',done=>{
        let message = {
            message: 'book successfully deleted'
        }
        nock("http://localhost:8080")
        .delete('/book/55b7d315-1a5f-4b13-a665-c382a6c71756')
        .reply(200,message)
            chai
            .request('http://localhost:8080')
            .delete('/book/55b7d315-1a5f-4b13-a665-c382a6c71756')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.equal('book successfully deleted');
                done();
            });
    })

    it('should for get send http status 200 and send an message',done=>{
        let data = {
            message: 'book fetched',
            book : {
                'id': '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9',
                'title': 'Coco raconte Channel 2',
                'years': 1990,
                'pages': 400
            }
        }
        nock("http://localhost:8080")
        .delete('/book/55b7d315-1a5f-4b13-a665-c382a6c71756')
        .reply(200,data)
            chai
            .request('http://localhost:8080')
            .delete('/book/55b7d315-1a5f-4b13-a665-c382a6c71756')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.equal('book fetched');
                expect(res.body.book).to.be.a('object');
                expect(res.body.book.years).to.be.a('number');
                expect(res.body.book.years).to.equal(1990);
                expect(res.body.book.pages).to.be.a('number');
                expect(res.body.book.pages).to.equal(400);
                expect(res.body.book.title).to.be.a('string');
                expect(res.body.book.title).to.equal('Coco raconte Channel 2');
                done();
            });
    })
})

describe('Test unitaire (simulation mauvaise réponse)', () => {

})