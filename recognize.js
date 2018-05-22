var trainer={
  model:tf.sequential(),
  BATCH_SIZE:50,//64
  TEST_BATCH_SIZE:50,
  TEST_ITERATION_FREQUENCY:5,//every 5 batches, test accuracy of the model
  LEARNING_RATE: 0.002,//0.00075
  optimizer:undefined,
  history:undefined,

  totalIterations:0,
  initializeModel:function (){
    this.totalIterations=0;
    this.model=tf.sequential();
    var model=this.model;



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




    optimizer = tf.train.sgd(this.LEARNING_RATE);//gradient descent

    model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',//error between percentag ethat it will be and actual
    metrics: ['accuracy'],
    });



    $("#batch-size").html(this.BATCH_SIZE);
    $("#learning-rate").html(this.LEARNING_RATE);
  },
  train:async function (cycles){


    const batch = getRandomBatch(this.BATCH_SIZE);

    var testBatch;
    var validationData;
    for (let i = 0; i < cycles; i++) {

      await this.trainCycle(i);

    }
    this.updateStats();
  },

  trainCycle:async function (i){
    const batch = getRandomBatch(this.BATCH_SIZE);

    // Every few batches test the accuracy of the mode.
    if (i % this.TEST_ITERATION_FREQUENCY === 0) {
      console.log(i)
      testBatch = getRandomBatch(this.TEST_BATCH_SIZE);
      validationData = [
        testBatch.xs.reshape([this.TEST_BATCH_SIZE, 28, 28, 1]), testBatch.labels
      ];
    }

    // The entire dataset doesn't fit into memory so we call fit repeatedly
    // with batches.
    this.history =  await this.model.fit(
        batch.xs.reshape([this.BATCH_SIZE, 28, 28, 1]),
        batch.labels,
        {
          batchSize: this.BATCH_SIZE,
          validationData,
          epochs: 1
        });
      this.totalIterations++;

  },
  updateStats:function(){
    var numLength=5;
    if(this.history && this.history.history){
      $("#accuracy").html(((""+this.history.history.acc[0]*100)).substring(0,numLength)+"%");
      $("#loss").html((""+this.history.history.loss[0]).substring(0,numLength));
    }else{
      $("#accuracy").html("N/A");
      $("#loss").html("N/A");
    }

    $("#total-iterations").html((""+this.totalIterations).substring(0,numLength));
  }
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
    var guess=getMaxIndex(await trainer.model.predict(x.xs.reshape([1, 28, 28, 1])).data());
    var real=getMaxIndex(await x.labels.data())
    ctx.font="50px arial"
    ctx.fillStyle="#ff0000";;
    if(guess==real)ctx.fillStyle="#00ff00";
    ctx.fillRect(0,0,canvas.width,canvas.height)

    drawArray1d(await x.xs.reshape([1, 28, 28, 1]).data());
    ctx.fillStyle="black";
    ctx.fillText(guess,10,50)
    copyCanvas();
  }

}
function clearDemo(){
  $("#demos").empty();
}
