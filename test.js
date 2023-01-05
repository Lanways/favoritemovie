const numbers = [1,2,3,4,5]

function isLessThan3(number) {
  return number < 3
}

console.log(numbers.filter(isLessThan3))

console.log(numbers.filter(number => number < 3))