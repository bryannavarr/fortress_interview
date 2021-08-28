

const fs = require("fs")


/* 1. Loop through requests in order 
   2. Match rooms to requests based on criteria(compare arrays and push to reservations array then concat to reservations json)
   3. Add matches to list of reservations
*/

/* Three arrays: rooms, requests, reservations */


let rawRoomData = fs.readFileSync('json/rooms.json')
let rawRequestData = fs.readFileSync('json/requests.json')
let rawReservations = fs.readFileSync('json/reservations.json')
let rooms = JSON.parse(rawRoomData)
let requests = JSON.parse(rawRequestData)
let currReservations = JSON.parse(rawReservations)

let toReserve = []

/* 1st attempt */
let roomsAvailable = requests.map(request => {
   return rooms.filter(room => {
      return (request.is_smoker === room.allow_smoking && request.min_beds == 1 ? (room.num_beds === 1 || 2) : request.is_smoker === room.allow_smoking && room.num_beds === 2)
   })
}).filter(value =>{

})

/* 2nd attempt */
// let roomsAvailable = requests.map(request => {
//    return rooms.filter(room => {
//       return request.is_smoker === room.allow_smoking 
//    })
// })

console.log('roomsavailable; ' + JSON.stringify(roomsAvailable))