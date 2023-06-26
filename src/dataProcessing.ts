import { Worker } from "worker_threads";
import Queue from "./queue";

const myQueue = new Queue();
const targetObj = {};

const observerHandler = {
  get(target, property) {
    return target[property];
  },
  set(target, property, value) {
    target[property] = value;
    return true;
  },
};

interface WorkerThread {
  worker: Worker;
  isBusy: boolean;
}

interface ThreadsObj {
  [key: string]: WorkerThread;
}

const threadsObj: ThreadsObj = new Proxy(targetObj, observerHandler);

let numberOfWorkerThreadsToBeCreated = 4;

const createWorkerThreads = () => {
  let loopCount = numberOfWorkerThreadsToBeCreated;
  for (let index = 1; index <= loopCount; index++) {
    const myWorker = new Worker("./src/workerFile.js");
    myWorker.on("message", (data) => {
      console.log({
        message: `message from worker number ${index}`,
        data: data,
      });
      threadsObj[index].isBusy = false;
    });
    threadsObj[index] = { worker: myWorker, isBusy: false };
  }
};
createWorkerThreads();

const startProcessingForFreeWorker = () => {
  for (const key in threadsObj) {
    if (!threadsObj[key].isBusy && myQueue.hasItemForDequeue()) {
      threadsObj[key].isBusy = true;
      threadsObj[key].worker.postMessage(myQueue.dequeue())

      }
  }
};


const main = () => {
  const data = [
    { name: "John", age: 25 },
    { name: "Jane", age: 30 },
    { name: "Mike", age: 35 },
    { name: "Sarah", age: 28 },
    { name: "David", age: 32 },
    { name: "Emily", age: 27 },
  ]; // fetchData(); // Implement your data fetching logic

  // Accumulate data into batches of 2
  const batchSize = 2;
  let batch: { name: string; age: number }[] = [];
  for (const record of data) {
    batch.push(record);
    if (batch.length === batchSize) {
      myQueue.enqueue(batch); // Enqueue the batch into the queue
      batch = [];
    }
  }

  // Handle the remaining records that do not make a full batch
  if (batch.length > 0) {
    myQueue.enqueue(batch); // Enqueue the remaining batch into the queue
  }

  setInterval(() =>{
    console.log('rnnin')
    startProcessingForFreeWorker();

  },1000)

  // const a = getFreeWorker();

  // if(a){
  //   a.postMessage([{ datap: "mmmmmjl" }]);

  // }

  // setInterval(() => {
  //   console.log(threadsObj)

  // }, 500);
};

main();

// const b= new Worker('./src/workerFile.js')

// setTimeout(() => {

// 	a.postMessage('dd')
// 	b.postMessage('dd')
// }, 2000);

// async function fetchDataAsStream() {
//   try {
//     const db = await DbConnection.Get();
//     const request = db.request();

//     const query = "SELECT top 1 * FROM urlManager;"; // Modify the query according to your needs

//     request.stream = true; // Enable streaming

//     request.query(query);

//     request.on("recordset", (columns) => {
//       // Recordset metadata
//         console.log(columns);
//     });
//     request.on("row", (row) => {
//       // Process each row of data
//       console.log({ row });
//     });

//     request.on("error", (error) => {
//       console.error("An error occurred:", error);
//     });

//     request.on("done", (result) => {
//       console.log("Stream ended");
//       // Stream processing completed
//     });
//   } catch (error) {
//     console.error("Failed to fetch data:", error);
//   }
// }

// // Call the function to initiate data fetching
// fetchDataAsStream();
