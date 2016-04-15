process.env.APP_ENV = 'test';
var app = require('../../server');
var request = require('supertest');
var should = require('should');
var sinon = require('sinon');
var Forex = require('../../libs/forex');

describe('users', function() {
	var stub;

	it('Add new currency | USD ', function(done) {
		stub = sinon.stub(Forex, 'getPrice').yields(null, {
			'prices': [{
				'instrument': 'USD_EUR',
				'time': '2013-09-16T18:59:03.687308Z',
				'bid': 0.89,
				'ask': 0.89
			}]
		});
		request(app)
			.put('/users/57105e8b238f3501650879f4/currencies')
			.send({
				codestring: 'USD'
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				res.body[0].codestring.should.equal('USD');
				res.body[0].quote.should.equal(0.89);
				res.statusCode.should.equal(200);
				done();
			});
	});

	it('Add new currency | MXN ', function(done) {
		stub.yields(null, {
			'prices': [{
				'instrument': 'MXN_EUR',
				'time': '2013-09-16T18:59:03.687308Z',
				'bid': 19.62,
				'ask': 19.62
			}]
		});
		request(app)
			.put('/users/57105e8b238f3501650879f4/currencies')
			.send({
				codestring: 'MXN'
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				res.body[0].codestring.should.equal('USD');
				res.body[0].quote.should.equal(0.89);
				res.body[1].codestring.should.equal('MXN');
				res.body[1].quote.should.equal(19.62);
				res.statusCode.should.equal(200);
				done();
			});
	});

	it('List currencies', function(done) {
		request(app)
			.get('/users/57105e8b238f3501650879f4/currencies')
			.set('Accept', 'application/json')
			.end(function(err, res) {
				res.body[0].codestring.should.equal('USD');
				res.body[0].quote.should.equal(0.89);
				res.body[1].codestring.should.equal('MXN');
				res.body[1].quote.should.equal(19.62);
				res.statusCode.should.equal(200);
				done();
			});
	});

	it('Delete currency', function(done) {
		request(app)
			.delete('/users/57105e8b238f3501650879f4/currencies')
			.send({
				codestring: 'USD'
			})
			.set('Accept', 'application/json')
			.end(function(err, res) {
				res.body[0].codestring.should.equal('MXN');
				res.body[0].quote.should.equal(19.62);
				should.not.exist(res.body[1]);
				res.statusCode.should.equal(200);
				done();
			});
	});

});
