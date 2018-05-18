
  const model = tf.sequential();
  model.add(tf.layers.conv2d({
  inputShape: [28, 28, 1],//28x28 image, 1 deep
  kernelSize: 5,//5x5 convolutional window to slide over image
  filters: 8,//number of filters
  strides: 1,//move window one over each time
  activation: 'relu',
  kernelInitializer: 'VarianceScaling'
  }));

  model.add(tf.layers.maxPooling2d({//downsample previous layer
    poolSize: [2, 2],//2x2 window
    strides: [2, 2]//2x2 step size
  }));

  model.add(tf.layers.conv2d({//convolutional layer
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'VarianceScaling'
  }));

  model.add(tf.layers.maxPooling2d({//same as efore
    poolSize: [2, 2],
    strides: [2, 2]
  }));

  model.add(tf.layers.flatten());//mak last output vector

  model.add(tf.layers.dense({
  units: 10,//0-9
  kernelInitializer: 'VarianceScaling',
  activation: 'softmax'//probability distribution
  }));


  const LEARNING_RATE = 0.15;
  const optimizer = tf.train.sgd(LEARNING_RATE);//gradient descent

  model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',//error between percentag ethat it will be and actual
  metrics: ['accuracy'],
  });
function runModel(){
  const BATCH_SIZE = 64;
  const TRAIN_BATCHES = 100;//number of batches


  const TEST_BATCH_SIZE = 1000;
  const TEST_ITERATION_FREQUENCY = 5;//every 5 batches, test accuracy of the model



  const batch = getRandomBatch(BATCH_SIZE);

  for (let i = 0; i < TRAIN_BATCHES; i++) {
    const batch = getRandomBatch(BATCH_SIZE);
    let testBatch;
    let validationData;
    // Every few batches test the accuracy of the mode.
    if (i % TEST_ITERATION_FREQUENCY === 0) {
      testBatch = getRandomBatch(TEST_BATCH_SIZE);
      validationData = [
        testBatch.xs.reshape([TEST_BATCH_SIZE, 28, 28, 1]), testBatch.labels
      ];
    }

    // The entire dataset doesn't fit into memory so we call fit repeatedly
    // with batches.
    const history = model.fit(
        batch.xs.reshape([BATCH_SIZE, 28, 28, 1]),
        batch.labels,
        {
          batchSize: BATCH_SIZE,
          validationData,
          epochs: 1
        });

      //const loss = history.history.loss[0];
    //const accuracy = history.history.acc[0];

    // ... plotting code ...
    //console.log(history.history.loss)
  }
}


function getRandomBatch(amount){
  var batchImagesArray = [];
  var batchLabelsArray = [];

  for (let i = 0; i < amount; i++) {
    var x =getRandomLetter();
    //console.log(x.letter)
    batchImagesArray[i]=(x.letter);
    batchLabelsArray.push(x.i);
  }

  const xs = tf.tensor2d(batchImagesArray);
  const labels = tf.tensor(batchLabelsArray);

  return {xs, labels};
}
