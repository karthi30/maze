$(document).ready(function(){
  tomPositions = []
  $(".text-box").keyup(function() {
    $(".text-box").val(this.value.match(/[1-8]*/));
  });
  $('.generate').click(function(){
      matrixSize = parseInt($('.text-box')[0].value)
      randJerry = Math.floor((Math.random()*matrixSize));
      randCheese = Math.floor((Math.random()*matrixSize));
      for(i=0;i<matrixSize;i++){
          for(j=0;j<matrixSize;j++){
              $(".container").append("<div class='cell cell"+i+j+"'></div>")
          }
          $(".container").append("<div class='clearfix'></div>")
      }
      width = matrixSize*50 +40
      height = $(".container").height()
      $(".container").css({"width": width, "height": height})
      moveJerry(randJerry,0)
      $('.jerry').addClass('standing')
      $('.cell'+randCheese+(matrixSize-1)).append("<img src='images/cheese.png' class='item cheese'>")
      placeTom()
      matrix = [];
      for (var i=0; i<matrixSize; i++) {
        matrix[i] = [];
        for (var j=0; j<matrixSize; j++) {
          matrix[i][j] = 'Path';
          if (JSON.stringify(tomPositions).indexOf([j,i])>=0) {
            matrix[i][j]='Tom'
          };
        }
      }
      matrix[randCheese][matrixSize-1] = "Cheese"
      matrix[randJerry][0] = "Jerry"
  })

  function moveJerry(top,left){
    top = top * 53
    left = left * 53
    $('.jerry').animate({top: top, left: left},500)
  }
  function placeTom(){
      noOfTom = (matrixSize * matrixSize)/3
      for (var i = 0; i < noOfTom; i++) {
          randRow = Math.floor((Math.random()*matrixSize));
          randColumn = Math.floor((Math.random()*(matrixSize-1)))+1;
          if (matrixSize > randRow){
              if ($('.cell'+randRow+randColumn)[0].children.length == 0){
                  tomPositions.push([randColumn,randRow])
                  $('.cell'+randRow+randColumn).append("<img src='images/tom.png' class='tom'>")
              }
          }
      };
  }
  paths = []
  $('.findPath').click(function(){
  
   // your code goes here
   
  })
  var findCheese = function(jerryLocation, matrix) {
    var dTop = jerryLocation[0];
    var dLeft = jerryLocation[1];
    var location = {
      dTop: dTop,
      dLeft: dLeft,
      path: [],
      status: 'Jerry',
      pathLatLng: [[dTop,dLeft]]
    };
    var queue = [location];
    while (queue.length > 0) {
      var currentLocation = queue.shift();
      var newLocation = movingSide(currentLocation, 'Top', matrix);
      if (newLocation.status === 'Cheese') {
        return newLocation.pathLatLng;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
      var newLocation = movingSide(currentLocation, 'Right', matrix);
      if (newLocation.status === 'Cheese') {
        return newLocation.pathLatLng;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
      var newLocation = movingSide(currentLocation, 'Bottom', matrix);
      if (newLocation.status === 'Cheese') {
        return newLocation.pathLatLng;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
      var newLocation = movingSide(currentLocation, 'Left', matrix);
      if (newLocation.status === 'Cheese') {
        return newLocation.pathLatLng;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
    }
    return false;
  };
  var movingSide = function(currentLocation, direction, matrix, latLng) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);

    var dft = currentLocation.dTop;
    var dfl = currentLocation.dLeft;

    if (direction === 'Top') {
      dft -= 1;
    } else if (direction === 'Right') {
      dfl += 1;
    } else if (direction === 'Bottom') {
      dft += 1;
    } else if (direction === 'Left') {
      dfl -= 1;
    }
    var pathLatLng = currentLocation.pathLatLng.slice();
    pathLatLng.push([dft,dfl]);

    var newLocation = {
      dTop: dft,
      dLeft: dfl,
      path: newPath,
      pathLatLng: pathLatLng,
      status: 'Unknown'
    };
    newLocation.status = moves(newLocation, matrix);
    if (newLocation.status === 'Valid') {
      matrix[newLocation.dTop][newLocation.dLeft] = 'Visited';
    }
    return newLocation;
  };
  var moves = function(location, matrix) {
    var matrixSize = matrix.length;
    var dft = location.dTop;
    var dfl = location.dLeft;
    if (location.dLeft > 1 ||
      location.dLeft <= matrixSize ||
      location.dTop > 1 ||
      location.dTop <= matrixSize) {
      return 'Invalid';
    } else if (matrix[dft][dfl] === 'Cheese') {
      return 'Cheese';
    } else if (matrix[dft][dfl] !== 'Path') {
      return 'Blocked';
    } else {
      return 'Valid';
    }
  };
}) 