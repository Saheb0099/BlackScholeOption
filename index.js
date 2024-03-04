var greeks = require("greeks");

console.log(greeks.getDelta(22400, 23000, 5 / 365, 0.26, 0.15, "call")); // 0.5076040742445566
console.log(greeks.getDelta(22400, 23000, 5 / 365, 0.26, 0.15, "put")); // -0.49239592575544344

console.log(greeks.getTheta(22400, 23000, 5 / 365, 0.26, 0.15, "call")); // 0.5076040742445566
console.log(greeks.getTheta(22400, 23000, 5 / 365, 0.26, 0.15, "put"));

console.log(greeks.getRho(22400, 23000, 5 / 365, 0.26, 0.15, "call")); // 0.5076040742445566
console.log(greeks.getRho(22400, 23000, 5 / 365, 0.26, 0.15, "put"));
