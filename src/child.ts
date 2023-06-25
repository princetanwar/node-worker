import {parentPort } from 'worker_threads';
// const { workerData, parentPort } 
//         = require('worker_threads')
if(parentPort){
  parentPort.on('message', async (data) => {
    if (data === 'end') {
      // Signal to stop processing
       if (parentPort) parentPort.postMessage('Worker stopped');
      if (parentPort) parentPort.close();
      return;
    }
  
    // Process the received data
    const result = await insertRowsIntoDatabase(data);
    console.log({result})
  
    // Send the result back to the parent process
   if (parentPort) parentPort.postMessage(result);
  });
  

}



function insertRowsIntoDatabase(rows) {
  // Implement your database insertion logic here
  // This is just a placeholder for demonstration purposes
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Inserting rows into the database:', rows);
      resolve('');
    }, 2000);
  });
}
