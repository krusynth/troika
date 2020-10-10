export default function dupe(elm) {
  return JSON.parse(JSON.stringify(elm));
}