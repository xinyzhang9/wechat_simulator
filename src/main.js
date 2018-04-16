"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = __importDefault(require("xstream"));
var fromEvent_1 = __importDefault(require("xstream/extra/fromEvent"));
function main(sources) {
    var click$ = sources.DOM;
    return {
        DOM: click$.startWith(null).map(function () {
            return xstream_1.default.periodic(1000)
                .fold(function (prev) { return prev + 1; }, 0);
        }).flatten()
            .map(function (i) { return "Seconds elapsed: " + i; }),
        log: xstream_1.default.periodic(2000)
            .fold(function (prev) { return prev + 1; }, 0)
    };
}
// source = input (read) effect
// sink = output (write) effect
function domDriver(text$) {
    text$.subscribe({
        next: function (str) {
            var elem = document.querySelector('#app');
            elem.textContent = str;
        }
    });
    var domSource = fromEvent_1.default(document, 'click');
    return domSource;
}
function logDriver(msg$) {
    msg$.subscribe({ next: function (msg) { console.log(msg); } });
}
// fakeA = ...
// b = f(fakeA)
// a = g(b)
// fakeA.behaveLike(a)
function run(mainFn, drivers) {
    var fakeDOMSink = xstream_1.default.create();
    var domSource = domDriver(fakeDOMSink);
    var sinks = mainFn({ DOM: domSource });
    fakeDOMSink.imitate(sinks.DOM);
    /* Object.keys(drivers).forEach(key => {
         if (sinks[key]) {
             drivers[key](sinks[key]);
         }
     });*/
}
run(main, {
    DOM: domDriver,
    log: logDriver,
});
