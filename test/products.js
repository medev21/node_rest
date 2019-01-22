const Products = require('../api/routes/products');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/server');
const should = chai.should();

chai.use(chaiHttp);

describe('Products', () => {

    describe('/GET all products', () => {
        it('It should GET', (done) => {
            chai.request(server)
            .get('/products')
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.have.property('message');
                done();
            });
        });
    });
    
})