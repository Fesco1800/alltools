(() => {
  "use strict";

  // Configuration for all converter types
  const converters = [
    {
      id: "length",
      title: "Length/Distance",
      units: [
        "meter",
        "kilometer",
        "centimeter",
        "millimeter",
        "mile",
        "yard",
        "foot",
        "inch",
      ],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (meters)
        const meterValues = {
          meter: 1,
          kilometer: 1000,
          centimeter: 0.01,
          millimeter: 0.001,
          mile: 1609.34,
          yard: 0.9144,
          foot: 0.3048,
          inch: 0.0254,
        };

        // Convert from source unit to meters, then to target unit
        const meters = value * meterValues[fromUnit];
        return meters / meterValues[toUnit];
      },
    },
    {
      id: "weight",
      title: "Weight/Mass",
      units: [
        "kilogram",
        "gram",
        "milligram",
        "pound",
        "ounce",
        "ton",
        "stone",
      ],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (grams)
        const gramValues = {
          kilogram: 1000,
          gram: 1,
          milligram: 0.001,
          pound: 453.592,
          ounce: 28.3495,
          ton: 1000000,
          stone: 6350.29,
        };

        // Convert from source unit to grams, then to target unit
        const grams = value * gramValues[fromUnit];
        return grams / gramValues[toUnit];
      },
    },
    {
      id: "temperature",
      title: "Temperature",
      units: ["celsius", "fahrenheit", "kelvin"],
      convert: function (value, fromUnit, toUnit) {
        // Temperature conversions need special handling
        let result;

        // First convert to Celsius
        let celsius;
        switch (fromUnit) {
          case "celsius":
            celsius = value;
            break;
          case "fahrenheit":
            celsius = ((value - 32) * 5) / 9;
            break;
          case "kelvin":
            celsius = value - 273.15;
            break;
        }

        // Then convert from Celsius to target unit
        switch (toUnit) {
          case "celsius":
            result = celsius;
            break;
          case "fahrenheit":
            result = (celsius * 9) / 5 + 32;
            break;
          case "kelvin":
            result = celsius + 273.15;
            break;
        }

        return result;
      },
    },
    {
      id: "area",
      title: "Area",
      units: [
        "square meter",
        "square kilometer",
        "square centimeter",
        "square mile",
        "square foot",
        "acre",
        "hectare",
      ],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (square meters)
        const sqMeterValues = {
          "square meter": 1,
          "square kilometer": 1000000,
          "square centimeter": 0.0001,
          "square mile": 2589988.11,
          "square foot": 0.092903,
          acre: 4046.86,
          hectare: 10000,
        };

        // Convert from source unit to square meters, then to target unit
        const sqMeters = value * sqMeterValues[fromUnit];
        return sqMeters / sqMeterValues[toUnit];
      },
    },
    {
      id: "volume",
      title: "Volume",
      units: [
        "cubic meter",
        "liter",
        "milliliter",
        "cubic foot",
        "cubic inch",
        "gallon",
        "quart",
        "pint",
        "cup",
      ],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (liters)
        const literValues = {
          "cubic meter": 1000,
          liter: 1,
          milliliter: 0.001,
          "cubic foot": 28.3168,
          "cubic inch": 0.0163871,
          gallon: 3.78541,
          quart: 0.946353,
          pint: 0.473176,
          cup: 0.236588,
        };

        // Convert from source unit to liters, then to target unit
        const liters = value * literValues[fromUnit];
        return liters / literValues[toUnit];
      },
    },
    {
      id: "time",
      title: "Time",
      units: ["second", "minute", "hour", "day", "week", "month", "year"],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (seconds)
        const secondValues = {
          second: 1,
          minute: 60,
          hour: 3600,
          day: 86400,
          week: 604800,
          month: 2592000, // 30-day month
          year: 31536000, // 365-day year
        };

        // Convert from source unit to seconds, then to target unit
        const seconds = value * secondValues[fromUnit];
        return seconds / secondValues[toUnit];
      },
    },
    {
      id: "speed",
      title: "Speed",
      units: [
        "meter per second",
        "kilometer per hour",
        "mile per hour",
        "knot",
        "foot per second",
      ],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (meters per second)
        const mpsValues = {
          "meter per second": 1,
          "kilometer per hour": 0.277778,
          "mile per hour": 0.44704,
          knot: 0.514444,
          "foot per second": 0.3048,
        };

        // Convert from source unit to meters per second, then to target unit
        const mps = value * mpsValues[fromUnit];
        return mps / mpsValues[toUnit];
      },
    },
    {
      id: "pressure",
      title: "Pressure",
      units: ["pascal", "kilopascal", "bar", "psi", "atmosphere", "torr"],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (pascals)
        const pascalValues = {
          pascal: 1,
          kilopascal: 1000,
          bar: 100000,
          psi: 6894.76,
          atmosphere: 101325,
          torr: 133.322,
        };

        // Convert from source unit to pascals, then to target unit
        const pascals = value * pascalValues[fromUnit];
        return pascals / pascalValues[toUnit];
      },
    },
    {
      id: "energy",
      title: "Energy",
      units: [
        "joule",
        "kilojoule",
        "calorie",
        "kilocalorie",
        "watt hour",
        "kilowatt hour",
        "electronvolt",
        "british thermal unit",
      ],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (joules)
        const jouleValues = {
          joule: 1,
          kilojoule: 1000,
          calorie: 4.184,
          kilocalorie: 4184,
          "watt hour": 3600,
          "kilowatt hour": 3600000,
          electronvolt: 1.602e-19,
          "british thermal unit": 1055.06,
        };

        // Convert from source unit to joules, then to target unit
        const joules = value * jouleValues[fromUnit];
        return joules / jouleValues[toUnit];
      },
    },
    {
      id: "power",
      title: "Power",
      units: [
        "watt",
        "kilowatt",
        "horsepower",
        "british thermal unit per hour",
      ],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (watts)
        const wattValues = {
          watt: 1,
          kilowatt: 1000,
          horsepower: 745.7,
          "british thermal unit per hour": 0.293071,
        };

        // Convert from source unit to watts, then to target unit
        const watts = value * wattValues[fromUnit];
        return watts / wattValues[toUnit];
      },
    },
    {
      id: "angle",
      title: "Angle",
      units: ["degree", "radian", "gradian"],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (radians)
        const radianValues = {
          degree: 0.0174533,
          radian: 1,
          gradian: 0.0157079633,
        };

        // Convert from source unit to radians, then to target unit
        const radians = value * radianValues[fromUnit];
        return radians / radianValues[toUnit];
      },
    },
    {
      id: "digital",
      title: "Digital Storage",
      units: [
        "bit",
        "byte",
        "kilobit",
        "kilobyte",
        "megabit",
        "megabyte",
        "gigabit",
        "gigabyte",
        "terabit",
        "terabyte",
      ],
      convert: function (value, fromUnit, toUnit) {
        // Convert to base unit (bits)
        const bitValues = {
          bit: 1,
          byte: 8,
          kilobit: 1000,
          kilobyte: 8000,
          megabit: 1000000,
          megabyte: 8000000,
          gigabit: 1000000000,
          gigabyte: 8000000000,
          terabit: 1000000000000,
          terabyte: 8000000000000,
        };

        // Convert from source unit to bits, then to target unit
        const bits = value * bitValues[fromUnit];
        return bits / bitValues[toUnit];
      },
    },
  ];

  // Helper function to format the display of numbers
  function formatNumber(num) {
    // If the number is large, use scientific notation
    if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && Math.abs(num) > 0)) {
      return num.toExponential(6);
    }

    // For more normal numbers, use up to 6 decimal places
    return parseFloat(num.toFixed(6)).toString();
  }

  // Helper function to capitalize the first letter of each word
  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Create a card for each converter
  function createConverterCards() {
    const container = document.querySelector(".unit-converters .container");

    // Clear the container
    container.innerHTML = "";

    // Loop through each converter and create a card
    converters.forEach((converter) => {
      const card = document.createElement("div");
      card.className = "converter-card";
      card.id = `converter-${converter.id}`;

      const header = document.createElement("div");
      header.className = "converter-card-header";
      header.textContent = converter.title;

      const body = document.createElement("div");
      body.className = "converter-card-body";

      // Create input group
      const inputGroup = document.createElement("div");
      inputGroup.className = "converter-form-group";

      const inputLabel = document.createElement("label");
      inputLabel.textContent = "From:";
      inputLabel.for = `${converter.id}-from-value`;

      const inputRow = document.createElement("div");
      inputRow.className = "converter-row";

      const input = document.createElement("input");
      input.type = "number";
      input.id = `${converter.id}-from-value`;
      input.value = "1";
      input.step = "any";

      const fromSelect = document.createElement("select");
      fromSelect.id = `${converter.id}-from-unit`;

      converter.units.forEach((unit) => {
        const option = document.createElement("option");
        option.value = unit;
        option.textContent = capitalizeWords(unit);
        fromSelect.appendChild(option);
      });

      inputRow.appendChild(input);
      inputRow.appendChild(fromSelect);

      inputGroup.appendChild(inputLabel);
      inputGroup.appendChild(inputRow);

      // Create output group
      const outputGroup = document.createElement("div");
      outputGroup.className = "converter-form-group";

      const outputLabel = document.createElement("label");
      outputLabel.textContent = "To:";
      outputLabel.for = `${converter.id}-to-value`;

      const outputRow = document.createElement("div");
      outputRow.className = "converter-row";

      const output = document.createElement("input");
      output.type = "text";
      output.id = `${converter.id}-to-value`;
      output.readOnly = true;

      const toSelect = document.createElement("select");
      toSelect.id = `${converter.id}-to-unit`;

      // Default the second dropdown to the second option when available
      const defaultToIndex = converter.units.length > 1 ? 1 : 0;

      converter.units.forEach((unit, index) => {
        const option = document.createElement("option");
        option.value = unit;
        option.textContent = capitalizeWords(unit);
        if (index === defaultToIndex) option.selected = true;
        toSelect.appendChild(option);
      });

      outputRow.appendChild(output);
      outputRow.appendChild(toSelect);

      outputGroup.appendChild(outputLabel);
      outputGroup.appendChild(outputRow);

      // Add all elements to the body
      body.appendChild(inputGroup);
      body.appendChild(outputGroup);

      // Add header and body to the card
      card.appendChild(header);
      card.appendChild(body);

      // Add the card to the container
      container.appendChild(card);

      // Set up event listeners
      function performConversion() {
        const value = parseFloat(input.value);
        const fromUnit = fromSelect.value;
        const toUnit = toSelect.value;

        if (!isNaN(value)) {
          const result = converter.convert(value, fromUnit, toUnit);
          output.value = formatNumber(result);
        } else {
          output.value = "";
        }
      }

      // Initial conversion
      performConversion();

      // Set up event listeners
      input.addEventListener("input", performConversion);
      fromSelect.addEventListener("change", performConversion);
      toSelect.addEventListener("change", performConversion);
    });
  }

  // Initialize when the DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    createConverterCards();
  });

  // If the document is already loaded, initialize now
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(createConverterCards, 1);
  }
})();
