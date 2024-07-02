export default function Slicing(Data, strStart, strEnd) {
  return Data.length > strEnd ? Data.slice(strStart, strEnd)+"..." : Data;
}
