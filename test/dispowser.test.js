import './common.test'
import uuid from "uuid/v4";
import _ from "lodash";
import Dispowser from '@/dispowser';

describe('Dispowser', () => {
    beforeEach(() => {

    });

    afterEach(() => {

    });

    it('can create a Disposer without scope', () => {
        let disposer = Dispowser.createDisposer();
        let i = uuid();
        let fakeObject = {
            dispose: () => {
                i = null;
            }
        };

        disposer.register = fakeObject;

        disposer.dispose();
        expect(i).to.be.null;
    });

    it('can create a Disposer with an AngularJS scope', () => {
        let i = uuid();
        let fakeObject = {
            dispose: () => {
                i = null;
            }
        };

        let handler = null;
        let fakeAngularScope = {
            $on: (name, h) => {
                handler = {
                    name: name,
                    handler: h
                };
            }
        }

        let disposer = Dispowser.createDisposer(fakeAngularScope);
        disposer.register = fakeObject;

        expect(handler).to.be.not.null;
        expect(handler.name).to.be.equal("$destroy");
        expect(handler.handler).to.be.not.null;

        handler.handler();

        expect(i).to.be.null;
    });

    it('does not dispose if dispose() isn\'t trigerred', () => {
        let disposer = Dispowser.createDisposer();
        let i = uuid();
        let fakeObject = {
            dispose: () => {
                i = null;
            }
        };

        disposer.register = fakeObject;

        expect(i).to.be.not.null;
    });

    it('does not dispose $destroy event isn\'t trigerred by AngularJS scope', () => {
        let i = uuid();
        let fakeObject = {
            dispose: () => {
                i = null;
            }
        };

        let handler = null;
        let fakeAngularScope = {
            $on: (name, h) => {
                handler = {
                    name: name,
                    handler: h
                };
            }
        }

        let disposer = Dispowser.createDisposer(fakeAngularScope);
        disposer.register = fakeObject;

        expect(handler).to.be.not.null;
        expect(handler.name).to.be.equal("$destroy");
        expect(handler.handler).to.be.not.null;

        expect(i).to.be.not.null;
    });
});