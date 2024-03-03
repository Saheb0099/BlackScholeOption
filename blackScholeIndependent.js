// /**
//  * Calculates various option metrics using the Black-Scholes model.
//  * @param {Object} options - Object containing option parameters.
//  * @param {number} options.stock - Underlying asset price.
//  * @param {number} options.strike - Strike price.
//  * @param {number} options.interest - Annualized risk-free interest rate.
//  * @param {number} options.vola - Volatility.
//  * @param {number} options.term - Time to expiration in years.
//  * @returns {Object} - Object containing option metrics.
//  */

// var NormalD = {
//   stdpdf: function (x) {
//     var m = Math.sqrt(2 * Math.PI);
//     var e = Math.exp(-Math.pow(x, 2) / 2);
//     return e / m;
//   },
//   normalcdf: function (X) {
//     var T = 1 / (1 + 0.2316419 * Math.abs(X));
//     var D = 0.3989423 * Math.exp((-X * X) / 2);
//     var Prob =
//       D *
//       T *
//       (0.3193815 +
//         T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
//     if (X > 0) {
//       Prob = 1 - Prob;
//     }
//     return Prob;
//   },
// };

// function calculateOptionMetrics(options) {
//   // Helper functions
//   function calcD1(h) {
//     return (
//       (Math.log(h.stock / h.strike) +
//         (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
//       (h.vola * Math.sqrt(h.term))
//     );
//   }

//   function calcD2(h) {
//     return calcD1(h) - h.vola * Math.sqrt(h.term);
//   }

//   function stdcompute(X) {
//     var T = 1 / (1 + 0.2316419 * Math.abs(X));
//     var D = 0.3989423 * Math.exp((-X * X) / 2);
//     var Prob =
//       D *
//       T *
//       (0.3193815 +
//         T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
//     if (X > 0) {
//       Prob = 1 - Prob;
//     }
//     return Prob;
//   }

//   // Black-Scholes formulas
//   function call(BSHolder) {
//     var d1 = calcD1(BSHolder);
//     var d2 = calcD2(BSHolder);
//     return (
//       Math.round(
//         (BSHolder.stock * stdcompute(d1) -
//           BSHolder.strike *
//             Math.exp(-BSHolder.interest * BSHolder.term) *
//             stdcompute(d2)) *
//           100
//       ) / 100
//     );
//   }

//   function put(BSHolder) {
//     var d1 = calcD1(BSHolder);
//     var d2 = calcD2(BSHolder);
//     return (
//       Math.round(
//         (BSHolder.strike *
//           Math.exp(-BSHolder.interest * BSHolder.term) *
//           stdcompute(-d2) -
//           BSHolder.stock * stdcompute(-d1)) *
//           100
//       ) / 100
//     );
//   }

//   function delta(BSHolder, isCall) {
//     var d1 = calcD1(BSHolder);
//     if (isCall) {
//       return Math.max(stdcompute(d1), 0);
//     } else {
//       return Math.min(stdcompute(d1) - 1, 0);
//     }
//   }

//   function gamma(BSHolder) {
//     var d1 = calcD1(BSHolder);
//     var phi = NormalD.stdpdf(d1);
//     return Math.max(
//       phi / (BSHolder.stock * BSHolder.vola * Math.sqrt(BSHolder.term)),
//       0
//     );
//   }

//   function vega(BSHolder) {
//     var d1 = calcD1(BSHolder);
//     var phi = NormalD.stdpdf(d1);
//     return Math.max((BSHolder.stock * phi * Math.sqrt(BSHolder.term)) / 100, 0);
//   }

//   function theta(BSHolder, isCall) {
//     var d1 = calcD1(BSHolder);
//     var d2 = calcD2(BSHolder);
//     var phi = NormalD.stdpdf(d1);
//     var s =
//       -(BSHolder.stock * phi * BSHolder.vola) / (2 * Math.sqrt(BSHolder.term));
//     var k =
//       BSHolder.interest *
//       BSHolder.strike *
//       Math.exp(-BSHolder.interest * BSHolder.term) *
//       NormalD.normalcdf(d2);
//     if (isCall) {
//       return Math.min((s - k) / 365, 0);
//     } else {
//       return Math.min((s + k) / 365, 0);
//     }
//   }

//   function rho(BSHolder, isCall) {
//     var d1 = calcD1(BSHolder);
//     var nd2 = NormalD.normalcdf(d1 - BSHolder.vola * Math.sqrt(BSHolder.term));
//     var res;
//     if (isCall) {
//       res =
//         (BSHolder.term *
//           BSHolder.strike *
//           Math.exp(-BSHolder.interest * BSHolder.term) *
//           nd2) /
//         100;
//     } else {
//       var nnd2 = NormalD.normalcdf(
//         -(d1 - BSHolder.vola * Math.sqrt(BSHolder.term))
//       );
//       res =
//         (-BSHolder.term *
//           BSHolder.strike *
//           Math.exp(-BSHolder.interest * BSHolder.term) *
//           nnd2) /
//         100;
//     }
//     return Math.max(res, 0);
//   }

//   // Construct BSHolder object
//   var BSHolderObj = {
//     stock: options.stock,
//     strike: options.strike,
//     interest: options.interest,
//     vola: options.vola,
//     term: options.term,
//   };

//   // Calculate and return option metrics
//   return {
//     callPrice: call(BSHolderObj),
//     putPrice: put(BSHolderObj),
//     callDelta: delta(BSHolderObj, true),
//     putDelta: delta(BSHolderObj, false),
//     gamma: gamma(BSHolderObj),
//     vega: vega(BSHolderObj),
//     callTheta: theta(BSHolderObj, true),
//     putTheta: theta(BSHolderObj, false),
//     callRho: rho(BSHolderObj, true),
//     putRho: rho(BSHolderObj, false),
//   };
// }

// // Example option parameters
// var optionParams = {
//   stock: 22400, // Underlying asset price
//   strike: 23000, // Strike price
//   interest: 0.1, // Annualized risk-free interest rate (5%)
//   vola: 0.16, // Volatility (20%)
//   term: 0.01, // Time to expiration in years
// };

// // Calculate option metrics
// var optionMetrics = calculateOptionMetrics(optionParams);

// // Log the results
// console.log("Call Price:", optionMetrics.callPrice);
// console.log("Put Price:", optionMetrics.putPrice);
// console.log("Call Delta:", optionMetrics.callDelta);
// console.log("Put Delta:", optionMetrics.putDelta);
// console.log("Gamma:", optionMetrics.gamma);
// console.log("Vega:", optionMetrics.vega);
// console.log("Call Theta:", optionMetrics.callTheta);
// console.log("Put Theta:", optionMetrics.putTheta);
// console.log("Call Rho:", optionMetrics.callRho);
// console.log("Put Rho:", optionMetrics.putRho);

/**
 * Calculates the call price using the Black-Scholes model.
 * @param {number} stock - Underlying asset price.
 * @param {number} strike - Strike price.
 * @param {number} interest - Annualized risk-free interest rate.
 * @param {number} vola - Volatility.
 * @param {number} term - Time to expiration in years.
 * @returns {number} - Call price.
 */

var NormalD = {
  stdpdf: function (x) {
    var m = Math.sqrt(2 * Math.PI);
    var e = Math.exp(-Math.pow(x, 2) / 2);
    return e / m;
  },
  normalcdf: function (X) {
    var T = 1 / (1 + 0.2316419 * Math.abs(X));
    var D = 0.3989423 * Math.exp((-X * X) / 2);
    var Prob =
      D *
      T *
      (0.3193815 +
        T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
      Prob = 1 - Prob;
    }
    return Prob;
  },
};

function calculateCallPrice(stock, strike, interest, vola, term) {
  // Helper functions
  function calcD1(h) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  }

  function calcD2(h) {
    return calcD1(h) - h.vola * Math.sqrt(h.term);
  }

  function stdcompute(X) {
    var T = 1 / (1 + 0.2316419 * Math.abs(X));
    var D = 0.3989423 * Math.exp((-X * X) / 2);
    var Prob =
      D *
      T *
      (0.3193815 +
        T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
      Prob = 1 - Prob;
    }
    return Prob;
  }

  // Black-Scholes formula for call price
  function callPrice(BSHolder) {
    var d1 = calcD1(BSHolder);
    var d2 = calcD2(BSHolder);
    return (
      Math.round(
        (BSHolder.stock * stdcompute(d1) -
          BSHolder.strike *
            Math.exp(-BSHolder.interest * BSHolder.term) *
            stdcompute(d2)) *
          100
      ) / 100
    );
  }

  // Construct BSHolder object
  var BSHolderObj = {
    stock: stock,
    strike: strike,
    interest: interest,
    vola: vola,
    term: term,
  };

  // Return call price
  return callPrice(BSHolderObj);
}

function calculatePutPrice(stock, strike, interest, vola, term) {
  // Helper functions
  function calcD1(h) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  }

  function calcD2(h) {
    return calcD1(h) - h.vola * Math.sqrt(h.term);
  }

  function stdcompute(X) {
    var T = 1 / (1 + 0.2316419 * Math.abs(X));
    var D = 0.3989423 * Math.exp((-X * X) / 2);
    var Prob =
      D *
      T *
      (0.3193815 +
        T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
      Prob = 1 - Prob;
    }
    return Prob;
  }

  // Black-Scholes formula for put price
  function putPrice(BSHolder) {
    var d1 = calcD1(BSHolder);
    var d2 = calcD2(BSHolder);
    return (
      Math.round(
        (BSHolder.strike *
          Math.exp(-BSHolder.interest * BSHolder.term) *
          stdcompute(-d2) -
          BSHolder.stock * stdcompute(-d1)) *
          100
      ) / 100
    );
  }

  // Construct BSHolder object
  var BSHolderObj = {
    stock: stock,
    strike: strike,
    interest: interest,
    vola: vola,
    term: term,
  };

  // Return put price
  return putPrice(BSHolderObj);
}

function calculateCallDelta(stock, strike, interest, vola, term) {
  // Helper functions
  function calcD1(h) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  }

  function stdcompute(X) {
    var T = 1 / (1 + 0.2316419 * Math.abs(X));
    var D = 0.3989423 * Math.exp((-X * X) / 2);
    var Prob =
      D *
      T *
      (0.3193815 +
        T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
      Prob = 1 - Prob;
    }
    return Prob;
  }

  // Black-Scholes formula for call delta
  function callDelta(BSHolder) {
    var d1 = calcD1(BSHolder);
    return Math.max(stdcompute(d1), 0);
  }

  // Construct BSHolder object
  var BSHolderObj = {
    stock: stock,
    strike: strike,
    interest: interest,
    vola: vola,
    term: term,
  };

  // Return call delta
  return callDelta(BSHolderObj);
}

function calculatePutDelta(stock, strike, interest, vola, term) {
  // Helper functions
  function calcD1(h) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  }

  function stdcompute(X) {
    var T = 1 / (1 + 0.2316419 * Math.abs(X));
    var D = 0.3989423 * Math.exp((-X * X) / 2);
    var Prob =
      D *
      T *
      (0.3193815 +
        T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
      Prob = 1 - Prob;
    }
    return Prob;
  }

  // Black-Scholes formula for put delta
  function putDelta(BSHolder) {
    var d1 = calcD1(BSHolder);
    return Math.min(stdcompute(d1) - 1, 0);
  }

  // Construct BSHolder object
  var BSHolderObj = {
    stock: stock,
    strike: strike,
    interest: interest,
    vola: vola,
    term: term,
  };

  // Return put delta
  return putDelta(BSHolderObj);
}

function calculateVega(stock, strike, interest, vola, term) {
  // Helper functions
  function calcD1(h) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  }

  function stdcompute(X) {
    var T = 1 / (1 + 0.2316419 * Math.abs(X));
    var D = 0.3989423 * Math.exp((-X * X) / 2);
    var Prob =
      D *
      T *
      (0.3193815 +
        T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
      Prob = 1 - Prob;
    }
    return Prob;
  }

  // Black-Scholes formula for Vega
  function vega(BSHolder) {
    var d1 = calcD1(BSHolder);
    var phi = NormalD.stdpdf(d1);
    return Math.max((BSHolder.stock * phi * Math.sqrt(BSHolder.term)) / 100, 0);
  }

  // Construct BSHolder object
  var BSHolderObj = {
    stock: stock,
    strike: strike,
    interest: interest,
    vola: vola,
    term: term,
  };

  // Return Vega
  return vega(BSHolderObj);
}

function calculateCallTheta(stock, strike, interest, vola, term) {
  // Helper functions
  function calcD1(h) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  }

  function stdcompute(X) {
    var T = 1 / (1 + 0.2316419 * Math.abs(X));
    var D = 0.3989423 * Math.exp((-X * X) / 2);
    var Prob =
      D *
      T *
      (0.3193815 +
        T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
      Prob = 1 - Prob;
    }
    return Prob;
  }

  // Black-Scholes formula for call theta
  function callTheta(BSHolder) {
    var d1 = calcD1(BSHolder);
    var d2 = d1 - BSHolder.vola * Math.sqrt(BSHolder.term);
    var phi = NormalD.stdpdf(d1);
    var s =
      -(BSHolder.stock * phi * BSHolder.vola) / (2 * Math.sqrt(BSHolder.term));
    var k =
      BSHolder.interest *
      BSHolder.strike *
      Math.exp(-BSHolder.interest * BSHolder.term) *
      NormalD.normalcdf(d2);
    return Math.min((s - k) / 365, 0);
  }

  // Construct BSHolder object
  var BSHolderObj = {
    stock: stock,
    strike: strike,
    interest: interest,
    vola: vola,
    term: term,
  };

  // Return call theta
  return callTheta(BSHolderObj);
}

function calculatePutTheta(stock, strike, interest, vola, term) {
  // Helper function to calculate d1
  function calcD1(h) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  }

  // Helper function for standard normal distribution
  function stdcompute(X) {
    var T = 1 / (1 + 0.2316419 * Math.abs(X));
    var D = 0.3989423 * Math.exp((-X * X) / 2);
    var Prob =
      D *
      T *
      (0.3193815 +
        T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
      Prob = 1 - Prob;
    }
    return Prob;
  }

  // Black-Scholes formula for put theta
  function putTheta(BSHolder) {
    var d1 = calcD1(BSHolder);
    var d2 = d1 - BSHolder.vola * Math.sqrt(BSHolder.term);
    var phi = NormalD.stdpdf(d1);
    var s =
      -(BSHolder.stock * phi * BSHolder.vola) / (2 * Math.sqrt(BSHolder.term));
    var k =
      BSHolder.interest *
      BSHolder.strike *
      Math.exp(-BSHolder.interest * BSHolder.term) *
      NormalD.normalcdf(-d2);
    return Math.min((s + k) / 365, 0);
  }

  // Construct BSHolder object
  var BSHolderObj = {
    stock: stock,
    strike: strike,
    interest: interest,
    vola: vola,
    term: term,
  };

  // Return put theta
  return putTheta(BSHolderObj);
}

function calculateGamma(stock, strike, interest, vola, term) {
  // Helper function to calculate d1
  function calcD1(h) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  }

  // Black-Scholes formula for gamma
  function gamma(BSHolder) {
    var d1 = calcD1(BSHolder);
    var phi = NormalD.stdpdf(d1);
    return phi / (BSHolder.stock * BSHolder.vola * Math.sqrt(BSHolder.term));
  }

  // Construct BSHolder object
  var BSHolderObj = {
    stock: stock,
    strike: strike,
    interest: interest,
    vola: vola,
    term: term,
  };

  // Return gamma
  return gamma(BSHolderObj);
}

function calculateCallRho(stock, strike, interest, vola, term) {
  // Helper function to calculate d1
  function calcD1(h) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  }

  // Black-Scholes formula for call Rho
  function callRho(BSHolder) {
    var d1 = calcD1(BSHolder);
    var nd2 = NormalD.normalcdf(d1 - BSHolder.vola * Math.sqrt(BSHolder.term));
    return (
      (BSHolder.term *
        BSHolder.strike *
        Math.exp(-BSHolder.interest * BSHolder.term) *
        nd2) /
      100
    );
  }

  // Construct BSHolder object
  var BSHolderObj = {
    stock: stock,
    strike: strike,
    interest: interest,
    vola: vola,
    term: term,
  };

  // Return call Rho
  return callRho(BSHolderObj);
}

function calculatePutRho(stock, strike, interest, vola, term) {
  // Helper function to calculate d1
  function calcD1(h) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  }

  // Black-Scholes formula for put Rho
  function putRho(BSHolder) {
    var d1 = calcD1(BSHolder);
    var nd2 = NormalD.normalcdf(
      -(d1 - BSHolder.vola * Math.sqrt(BSHolder.term))
    );
    return (
      (-BSHolder.term *
        BSHolder.strike *
        Math.exp(-BSHolder.interest * BSHolder.term) *
        nd2) /
      100
    );
  }

  // Construct BSHolder object
  var BSHolderObj = {
    stock: stock,
    strike: strike,
    interest: interest,
    vola: vola,
    term: term,
  };

  // Return put Rho
  return putRho(BSHolderObj);
}

// Example option parameters
var optionParams = {
  stock: 22400, // Underlying asset price
  strike: 23000, // Strike price
  interest: 0.1, // Annualized risk-free interest rate (10%)
  vola: 0.16, // Volatility (16%)
  term: 0.01, // Time to expiration in years
};

// Calculate put price
var putPrice = calculatePutPrice(
  optionParams.stock,
  optionParams.strike,
  optionParams.interest,
  optionParams.vola,
  optionParams.term
);

// Log the put price
console.log("Put Price:", putPrice);

// Calculate call price
var callPrice = calculateCallPrice(
  optionParams.stock,
  optionParams.strike,
  optionParams.interest,
  optionParams.vola,
  optionParams.term
);

// Log the call price
console.log("Call Price:", callPrice);

// Calculate call delta
var callDelta = calculateCallDelta(
  optionParams.stock,
  optionParams.strike,
  optionParams.interest,
  optionParams.vola,
  optionParams.term
);

// Log the call delta
console.log("Call Delta:", callDelta);

// Calculate put delta
var putDelta = calculatePutDelta(
  optionParams.stock,
  optionParams.strike,
  optionParams.interest,
  optionParams.vola,
  optionParams.term
);

// Log the put delta
console.log("Put Delta:", putDelta);

// Calculate Vega
var vegaValue = calculateVega(
  optionParams.stock,
  optionParams.strike,
  optionParams.interest,
  optionParams.vola,
  optionParams.term
);

// Log the Vega
console.log("Vega:", vegaValue);

// Calculate gamma
var gammaValue = calculateGamma(
  optionParams.stock,
  optionParams.strike,
  optionParams.interest,
  optionParams.vola,
  optionParams.term
);

// Log the gamma
console.log("Gamma:", gammaValue);

// Calculate call theta
var callThetaValue = calculateCallTheta(
  optionParams.stock,
  optionParams.strike,
  optionParams.interest,
  optionParams.vola,
  optionParams.term
);

// Log the call theta
console.log("Call Theta:", callThetaValue);

// Calculate put theta
var putThetaValue = calculatePutTheta(
  optionParams.stock,
  optionParams.strike,
  optionParams.interest,
  optionParams.vola,
  optionParams.term
);

// Log the put theta
console.log("Put Theta:", putThetaValue);

// Calculate call Rho
var callRhoValue = calculateCallRho(
  optionParams.stock,
  optionParams.strike,
  optionParams.interest,
  optionParams.vola,
  optionParams.term
);

// Log the call Rho
console.log("Call Rho:", callRhoValue);

// Calculate put Rho
var putRhoValue = calculatePutRho(
  optionParams.stock,
  optionParams.strike,
  optionParams.interest,
  optionParams.vola,
  optionParams.term
);

// Log the put Rho
console.log("Put Rho:", putRhoValue);
