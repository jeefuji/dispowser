import uuid from "uuid/v4";
import _ from "lodash";

function log(m) {
    console.log("[Dispowser] " + m);
}

function Disposer() {
    var self = this;

    self.id = uuid();
    self.instances = [];

    Object.defineProperty(self, "register",  {
        set: function(o) {
            self.add(o);
        }
    });

    self.registerHandler = function (instance, handler) {
        if (!_.isObject(instance)) {return false;}
        instance.__disposer__ = handler;
        return self.add(instance);
    };

    self.add = function (instance) {
        if (!_.isObject(instance)) {return false;}
        self.instances.push(instance);
        return true;
    };

    self.dispose = function () {
        // Use .debug()
        log("Disposing " + this.id + "...", "Disposer");
        const header = "Disposer::" + self.id.substring(0, 5);

        self.instances.forEach(function(i) {
            // rxjs
            if (i.unsubscribe) {
                log("\t-> Unsubscribe", header);
                i.unsubscribe();
            }

            // general
            if (i.dispose) {
                log("\t-> Dispose", header);
                i.dispose();
            }

            // handlers
            if (i.__disposer__) {
                log("\t-> Handler disposer", header);
                i.__disposer__(i); // disposer handler
            }
        });
        self.instances = [];
    };
}


function Dispowser() {
    var self = this;

    //#region Public methods
    self.createDisposer = function(scope) {
        var disposer = new Disposer();
        if (scope !== undefined) {
            self.registerDisposerToScope(scope, disposer);
        }
        return disposer;
    };

    self.registerDisposerToScope = function(scope, disposer) { 
        var fn = function() {
            disposer.dispose();
        };

        // AngularJS support
        if (scope.$on) {
            scope.$on("$destroy", fn);
        } else if (scope.on) {
            scope.on("$destroy", fn);
        }
    };

    //#endregion
}

export default new Dispowser();
export {
    Disposer
};