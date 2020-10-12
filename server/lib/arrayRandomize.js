Array.prototype.randomize = function() {
  let newArray = this;

  let currentIndex = this.length -1;

  while(currentIndex) {
    let newIndex = Math.floor(Math.random() * currentIndex);

    let tmp = newArray[newIndex];
    newArray[newIndex] = newArray[currentIndex];
    newArray[currentIndex] = tmp;

    currentIndex--;
  }

  return newArray;
}