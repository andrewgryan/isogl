import { set } from "idb-keyval"


onmessage = function (e) {
    console.log("worker thread", e.data);

    console.log(set("hello", e.data.hello));

    postMessage({ hello: "ACK" });
};
