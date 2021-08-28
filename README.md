# fortress_interview

1. clone
2. run npm install
3. run node server.js


1. It took me 6 hours to complete the assingment. I was having trouble factoring in all the conditions and formatting the array to  match the reservation schema. I was able to complete the task with 3/6 new reservations matching those in answers.json. I ran out of time to debug why those 3 reservations were incorrect.

2. The time complexity of my script is O(n), theres some turnary operators throughout the script, which I think have a runtime of  has a runtime of O(n log n). The loops have a higher order complexity, hance the O(n)

3. To accomodate factors that adjust prices, I would add a property called 'event' to the rooms schema. The property would be an array of objects , each with properties that define such events and a percentage change. for example: events: [{holiday: 'xmas'(string) }, {change: 5 (percentage}]. They we could change the base daily_rate based on a defined percentage


