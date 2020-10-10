import dupe from './dupe.js';

Array.prototype.move = function(idx, dist) {
  let tmp = dupe(this);

  let elm = tmp.splice(idx, 1);
  tmp.splice(idx + dist, 0, elm[0]);

  return tmp;
}