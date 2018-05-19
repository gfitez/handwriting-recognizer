
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


  const LEARNING_RATE = 0.00075;//
  const optimizer = tf.train.sgd(LEARNING_RATE);//gradient descent

  model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',//error between percentag ethat it will be and actual
  metrics: ['accuracy'],
  });
async function train(cycles){
  const BATCH_SIZE = 500;//64
  const TRAIN_BATCHES = cycles;//number of batches-100


  const TEST_BATCH_SIZE = 1000;
  const TEST_ITERATION_FREQUENCY = 5;//every 5 batches, test accuracy of the model

  const batch = getRandomBatch(BATCH_SIZE);
  var acc;
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
    const history =  await model.fit(
        batch.xs.reshape([BATCH_SIZE, 28, 28, 1]),
        batch.labels,
        {
          batchSize: BATCH_SIZE,
          validationData,
          epochs: 1
        });

    const loss = history.history.loss[0];
    const accuracy = history.history.acc[0];
    acc=accuracy;

    // ... plotting code ...
    /**console.log(accuracy);
    ctx.font="60px Arial";

    var x=getRandomBatch(1);
    var guess=getMaxIndex(await model.predict(x.xs.reshape([1, 28, 28, 1])).data());
    var real=getMaxIndex(await x.labels.data())
    ctx.fillStyle="#ff0000";;
    if(guess==real)ctx.fillStyle="#00ff00";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    drawArray1d(await x.xs.reshape([1, 28, 28, 1]).data());
    ctx.fillStyle="black";
    ctx.fillText(guess,10,50)
    copyCanvas();**/



  }
  alert("training complete: last accuracy:"+acc)
}


function getRandomBatch(amount){
  const IMAGE_SIZE = 784;
  const NUM_CLASSES = 10;
  var batchImagesArray = new Float32Array(amount * IMAGE_SIZE);
  var batchLabelsArray = new Uint8Array(amount * NUM_CLASSES);

  for (let i = 0; i < amount; i++) {
    var x =getRandomLetter();
    //console.log(x.letter)
    batchImagesArray.set(x.letter, i * IMAGE_SIZE);
    batchLabelsArray.set(x.i, i * NUM_CLASSES);
  }

  const xs = tf.tensor2d(batchImagesArray, [amount, IMAGE_SIZE]);
  const labels = tf.tensor2d(batchLabelsArray, [amount, NUM_CLASSES]);

  return {xs, labels};
}


async function demo(){
  for(var i=0;i<10;i++){
    var x=getRandomBatch(1);
    var guess=getMaxIndex(await model.predict(x.xs.reshape([1, 28, 28, 1])).data());
    var real=getMaxIndex(await x.labels.data())
    ctx.font="30px arial"
    ctx.fillStyle="#ff0000";;
    if(guess==real)ctx.fillStyle="#00ff00";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle="black";
    drawArray1d(await x.xs.reshape([1, 28, 28, 1]).data());

    ctx.fillText(guess,10,50)
    copyCanvas();
  }

}
function clearDemo(){
  $("#demos").empty();
}
