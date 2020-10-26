var ary = [[1, 2],[2, 3],[3,4]];

var items = ary.reduce((acc, cur, i, ar)=>{
  let prev = i ? ar[i-1] : cur;
  if(acc.length){
    if(prev.some(r=>cur.indexOf(r)>=0)) {
      return acc.concat(cur);
    } else {
      return acc.length < cur.length ? cur : acc;
    }
  } 
  return cur;
}, []);

console.log([...new Set(items.flat())].sort());  //[1, 2, 3, 4]



function flattenArray(data){
  
  return data.reduce((acc, current) => {
    
    return acc.concat(Array.isArray(current) ? flattenArray(current) : current);
    
  }, []);
}

console.log(flattenArray([1, 2, [3, 10, [11, 12]], [1, 2, [3, [4]]], 5, 6]))

const getMapFromArray = data =>
  data.reduce((acc, item) => {
    // add object key to our object i.e. charmander: { type: 'water' }
    acc[item.name] = { type: item.type };
    return acc;
  }, {});

const pokemon = [
  { name: "charmander", type: "fire" },
  { name: "squirtle", type: "water" },
  { name: "bulbasaur", type: "grass" }
]

getMapFromArray(pokemon)

let data = [
  {
    country: 'China',
    pop: 10,
  },
  {
    country: 'India',
    pop: 2,
  },
  {
    country: 'USA',
    pop: 3,
  },
  {
    country: 'Indonesia',
    pop: 4,
  }
];

let sum = data.reduce((acc, val) => val.country == 'China' ? acc : acc + val.pop, 0);

console.log(sum)

const euros = [29.76, 41.85, 46.5];

const average = euros.reduce((total, amount, index, array) => {
  total += amount;
  if( index === array.length-1) { 
    return total/array.length;
  }else { 
    return total;
  }
});



var obj1 = {my:"dog", has: "fleas"}


//console.log(Object.keys(obj1))


const pets = ["dog", "chicken", "cat", "dog", "chicken", "chicken", "rabbit"];

const petCounts = pets.reduce(function(obj, pet) {
  obj[pet] = (obj[pet] || 0) +1;
  return obj;
}, {}); 

console.log(petCounts);




function increment(input) { return input + 1;}
function decrement(input) {return input - 1;}
function double(input) { return input * 2; }

function halve(input) { return input / 2; }

let pipeline = [increment, double, decrement, decrement];

const result = pipeline.reduce(function(total, func) {
  console.log(total)
  return func(total);
}, 1);

console.log(result)



Method
Holes are
 
concat
Preserved
['a',,'b'].concat(['c',,'d']) → ['a',,'b','c',,'d']
copyWithinES6
Preserved
[,'a','b',,].copyWithin(2,0) → [,'a',,'a']
entriesES6
Elements
[...[,'a'].entries()] → [[0,undefined], [1,'a']]
every
Ignored
[,'a'].every(x => x==='a') → true
fillES6
Filled
new Array(3).fill('a') → ['a','a','a']
filter
Removed
['a',,'b'].filter(x => true) → ['a','b']
findES6
Elements
[,'a'].find(x => true) → undefined
findIndexES6
Elements
[,'a'].findIndex(x => true) → 0
forEach
Ignored
[,'a'].forEach((x,i) => log(i)); → 1
indexOf
Ignored
[,'a'].indexOf(undefined) → -1
join
Elements
[,'a',undefined,null].join('#') → '#a##'
keysES6
Elements
[...[,'a'].keys()] → [0,1]
lastIndexOf
Ignored
[,'a'].lastIndexOf(undefined) → -1
map
Preserved
[,'a'].map(x => 1) → [,1]
pop
Elements
['a',,].pop() → undefined
push
Preserved
new Array(1).push('a') → 2
reduce
Ignored
['#',,undefined].reduce((x,y)=>x+y) → '#undefined'
reduceRight
Ignored
['#',,undefined].reduceRight((x,y)=>x+y) → 'undefined#'
reverse
Preserved
['a',,'b'].reverse() → ['b',,'a']
shift
Elements
[,'a'].shift() → undefined
slice
Preserved
[,'a'].slice(0,1) → [,]
some
Ignored
[,'a'].some(x => x !== 'a') → false
sort
Preserved
[,undefined,'a'].sort() → ['a',undefined,,]
splice
Preserved
['a',,].splice(1,1) → [,]
toString
Elements
[,'a',undefined,null].toString() → ',a,,'
unshift
Preserved
[,'a'].unshift('b') → 3
valuesES6
Elements
[...[,'a'].values()] → [undefined,'a']
Notes:

function getMissingNo(a, n) 
{ 
  
    var total = (n + 1) * (n + 2) / 2; 
    for (var i = 0; i < n; i++) {
        total -= a[i]; 
      //console.log(total + '  '+ a[i])
      
    }
    console.log(total); 
}

//getMissingNo([1,2,3,4,6,7,8], 7);
var numArray = [0189459, 0189460, 0189461, 0189463, 0189466];
var mia = numArray.reduce(function(acc, cur, ind, arr) {
  var diff = cur - arr[ind-1];
  console.log(diff);
  console.log('*****')
  if (diff > 1) {
    var i = 1;
    while (i < diff) {
  console.log(arr[ind-1]+i);
      console.log('*****')
      acc.push(arr[ind-1]+i);
      i++;
    }
  }
  return acc;
}, []);
console.log(mia);


var days = [20, 30, 50, 22, 21, 60];

var items = days.reduce((acc, cur, ind)=>{
  
  for(var i = ind; i<days.length; i++) {
    
    if(cur<days[i] || ind+1===days.length) {
      acc.push(i - ind);
      return acc;
    }
  }
}, []);

console.log(items);//[1, 1, 3, 2, 1, 0]




const users = [
  { id: 11, name: 'Adam', age: 23, group: 'editor' },
  { id: 47, name: 'John', age: 28, group: 'admin' },
  { id: 85, name: 'William', age: 34, group: 'editor' },
  { id: 47, name: 'Oliver', age: 28, group: 'admin1' }
];
var it = users.map(({id, age, group}) => `\n${id} ${age} ${group}`).join('');
//console.log(it)

const arrA = [1, 4, 3, 2];
const arrB = [5, 2, 6, 7, 4, 1];
var t = arrA.filter(it =>arrB.includes(it));

console.log(t)

var jobs = ["Fashion Designer", "Web Developer", "Web Designer", "Fashion Designer", "Web Developer"];
var jobsUnique = jobs.filter(function(item, index){
	return jobs.indexOf(item) >= index;
});

// Logs ["Fashion Designer", "Web Developer", "Web Designer"]
console.log(jobsUnique);

const hasAdmin = users.filter(({group}) => group === 'admin');
console.log(hasAdmin);

const cities = {
  Lyon: 'France',
  Berlin: 'Germany',
  Paris: 'France'
};
let countries = Object.keys(cities).reduce((acc, k) => {
  let country = cities[k];
  acc[country] = acc[country] || [];
  acc[country].push(k);
  return acc;
}, {});
console.log(countries);



console.log(JSON.stringify(users, ['id', 'group'], 2));

const updatedUsers = users.map(
  p => p.id !== 47 ? p : {...p, age: p.age + 1}
);
console.log(updatedUsers)



function getDate(string) {
  let [_, month, day, year] =
    /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
  return new Date(year, month - 1, day);
}
console.log(getDate("04-20-2020"));

