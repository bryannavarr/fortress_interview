const { Console } = require("console");
const fs = require("fs");

/* 1. Loop through requests in order 
   2. Match rooms to requests based on criteria(compare arrays and push to reservations array then concat to reservations json)
   3. Add matches to list of reservations
*/

/* Three arrays: rooms, requests, reservations */

let rawRoomData = fs.readFileSync("json/rooms.json");
let rawRequestData = fs.readFileSync("json/requests.json");
let rawReservations = fs.readFileSync("json/reservations.json");
let rooms = JSON.parse(rawRoomData);
let requests = JSON.parse(rawRequestData);
let currReservations = JSON.parse(rawReservations);

let toReserve = [];

Promise.all(
  requests.map((request) => {
    let checkin = formatDate(request.checkin_date);
    let checkout = formatDate(request.checkout_date);
    request.totalDays = calculateDays(checkin, checkout);
    request.available = rooms.filter((room) => {
      return request.is_smoker === room.allow_smoking && request.min_beds == 1
        ? room.num_beds === 1 || 2
        : request.is_smoker === room.allow_smoking && room.num_beds === 2;
    });
  })
).then(() =>
  Promise.all(
    requests.map((each) => {
      return each.available.map((value, i) => {
        return {
          room_id: value.id,
          checkin_date: each.checkin_date,
          checkout_date: each.checkout_date,
          total_charge:
            each.available.length > 1 &&
            datesAreAvailable(each.checkin_date, each.checkout_date, value.id)
              ? calculateTotal(
                  value.daily_rate,
                  value.cleaning_fee,
                  each.totalDays
                )
              : 1000000,
        };
      });
    })
  ).then((result) => {
    Promise.all(
      result.map((obj) => {
        return toReserve.push(
          obj.reduce((prev, curr) => {
            return prev.total_charge < curr.total_charge ? prev : curr;
          })
        );
      })
    ).then(() => {
      toReserve.forEach((value) => {
        currReservations.push(value);
      });
      fs.writeFile(
        "json/reservations.json",
        JSON.stringify(currReservations),
        function (err) {
          if (err) console.log(err);
        }
      );
    });
  })
);

function datesAreAvailable(checkin1, checkout1, id) {
  let checkin = new Date(formatDate(checkin1));
  let checkout = new Date(formatDate(checkout1));
  let i;
  let checkin2;
  let checkout2;
  for (i = 0; i < currReservations.length; i++) {
    each = currReservations[i];
    checkin2 = new Date(formatDate(each.checkin_date));
    checkout2 = new Date(formatDate(each.checkout_date));
    if (
      id == each.room_id &&
      checkin.getTime() <= checkout2.getTime() &&
      checkin2.getTime() <= checkout.getTime()
    ) {
      return false;
    } else {
      return true;
    }
  }
}

function calculateTotal(dailyRate, cleaning, totalDays) {
  return dailyRate * totalDays + cleaning;
}

function calculateDays(checkin, checkout) {
  checkin = new Date(checkin);
  checkout = new Date(checkout);

  let diffInTime = checkout.getTime() - checkin.getTime();
  let diffInDays = diffInTime / (1000 * 3600 * 24);
  return diffInDays;
}

function formatDate(date) {
  let splitDate = date.split("-");
  if (splitDate.count == 0) {
    return null;
  }

  let year = splitDate[0];
  let day = splitDate[1];
  let month = splitDate[2];

  return day + "/" + month + "/" + year;
}
