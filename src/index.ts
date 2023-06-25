import  { Worker } from 'worker_threads'
import Queue from './queue'; // Use a suitable queue library

// Create a queue instance
const queue = new Queue();

// Create the worker thread
const worker = new Worker('./src/child');

worker.on('message',(data) =>{
  console.log({'worker data': data})
})

// Fetch data from the database over time
// Accumulate data into batches and enqueue them
// Implement your database fetching and batching logic here

// Example data fetching logic
function fetchDataFromDB() {
  // Fetch data from the database
  const data =   [
  
    { name: 'John', age: 25 },
    { name: 'Jane', age: 30 },
    { name: 'Mike', age: 35 },
    { name: 'Sarah', age: 28 },
    { name: 'David', age: 32 },
    { name: 'Emily', age: 27 }
  
] // fetchData(); // Implement your data fetching logic

  // Accumulate data into batches of 2
  const batchSize = 2;
  let batch :{ name: string; age: number; }[] = [];
  for (const record of data) {
    batch.push(record);
    if (batch.length === batchSize) {
      queue.enqueue(batch); // Enqueue the batch into the queue
      batch = [];
    }
  }

  // Handle the remaining records that do not make a full batch
  if (batch.length > 0) {
    queue.enqueue(batch); // Enqueue the remaining batch into the queue
  }
}

const main = () =>{
  // Start fetching data from the database
  fetchDataFromDB();
  

  setInterval(() => {

    if(queue.hasItemForDequeue()){
      console.log('post')

      worker.postMessage(queue.dequeue())


    }
    
  }, 1000);

}
main()



