class Queue {
  private _deQueueIndex: number;
  private _enQueueIndex: number;
  private _queueData: Object;

  constructor() {
    this._queueData = {};
    this._deQueueIndex = 0;
    this._enQueueIndex = 0;
  }

   enqueue = (data) => {
    // console.log({enqueue: data})
    this._queueData[this._enQueueIndex] = data;
    this._enQueueIndex++;
  };

   dequeue = () => {
    if (this._deQueueIndex > this._enQueueIndex - 1) {
      throw new Error("index out of bound");
    }
    const data = this._queueData[this._deQueueIndex];
    delete this._queueData[this._deQueueIndex];
    this._deQueueIndex++;
    return data;
  };

  hasItemForDequeue = () => {
    return Object.keys(this._queueData).length > 0;
  };
}

// const myQueue = new Queue();
// console.log({myQueue})
// myQueue.enQueue(1);
// myQueue.enQueue(2);
// myQueue.enQueue(3);
// console.log(myQueue.deQueue());
// console.log(myQueue.deQueue());
// console.log({dd: myQueue.hasItemForDeQueue()})

export default  Queue 

