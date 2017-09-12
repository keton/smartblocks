var smartblocks=require('../index.js');

smartblocks.GenericDevice.discover(function(instance){

    console.log('GenericDevice.discover');

    instance.connectAndSetUp(function(callback) {
        console.log('connectAndSetUp');
        
      });
});
