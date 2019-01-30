const Product = require('../api/models/products');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/server');
const should = chai.should();

chai.use(chaiHttp);

describe('Products', () => {

    beforeEach((done) => { //Before each test we empty the database
        Product.deleteMany({}, (err) => { 
           done();           
        });        
    });

    describe('/GET all products - empty', () => {
        it('It should GET', (done) => {
            chai.request(server)
            .get('/products')
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.an('Object');
                res.body.should.have.property('count').eql(0);
                res.body.should.have.property('products').eql([]);
                done();
            });
        });
    });
    
})