import { app, server } from '../index';
import { expect } from 'chai';
import { config } from 'dotenv';
import chaiHttp  from "chai-http";
import { testReq } from '../util/types';

import chai from 'chai';

config();

chai.use(chaiHttp);

describe("Server Integration Testing!", () => {

    after(() => process.kill(process.pid, "SIGINT"));

    it("Test Home End Point", () => {
        chai
        .request(app)
        .get("/")
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.status).to.equals("success");
    });
});

    describe("Test /pollution", () => {

        let testInput : testReq;
        beforeEach(() => {
            testInput = {longitude: process.env.TEST_LON as string, latitude: process.env.TEST_LAT as string};
        });

        it("testing request for air quality data", () => {

            chai
            .request(app)
            .get("/pollution")
            .query(testInput)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals("success");
            });
        });

        it("testing request fail if latitude is out of boundary", () => {
            
            testInput.latitude = '200';

            chai
            .request(app)
            .get("/pollution")
            .query(testInput)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.status).to.equals("failed");
                expect(res.body.details).to.contain(testInput.latitude);
            });
        });

        it("testing request fail if longitude is absent", () => {
            
            const specialCase = {'latitude' : testInput.latitude}

            chai
            .request(app)
            .get("/pollution")
            .query(specialCase)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.status).to.equals("failed");
                expect(res.body.details).to.contain('longitude');
            });
        });

        it("testing date time with highest air pollutant", () => {

            chai
            .request(app)
            .get("/pollution/maxdate")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals("success");
            });
        });
    });

});

