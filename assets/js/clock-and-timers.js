(function () {
  const container = document.querySelector(".clock-and-timers .container");

  function createCard(title) {
    const card = document.createElement("div");
    card.className = "tool-card";
    const heading = document.createElement("h2");
    heading.textContent = title;
    card.appendChild(heading);
    return card;
  }

  // Stopwatch
  (function () {
    const card = createCard("Stopwatch");
    const display = document.createElement("div");
    display.className = "time-display";
    display.textContent = "00:00:00.000";

    const startBtn = document.createElement("button");
    startBtn.textContent = "Start";
    const stopBtn = document.createElement("button");
    stopBtn.textContent = "Stop";
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset";

    let startTime, timerInterval;

    function updateDisplay() {
      const elapsed = Date.now() - startTime;
      const date = new Date(elapsed);
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      const seconds = String(date.getUTCSeconds()).padStart(2, "0");
      const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
      display.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    startBtn.onclick = () => {
      if (!timerInterval) {
        startTime = Date.now() - parseTime(display.textContent);
        timerInterval = setInterval(updateDisplay, 10);
      }
    };

    stopBtn.onclick = () => {
      clearInterval(timerInterval);
      timerInterval = null;
    };

    resetBtn.onclick = () => {
      clearInterval(timerInterval);
      timerInterval = null;
      display.textContent = "00:00:00.000";
    };

    function parseTime(timeStr) {
      const [h, m, s_ms] = timeStr.split(":");
      const [s, ms] = s_ms.split(".");
      return (
        Number(h) * 3600000 + Number(m) * 60000 + Number(s) * 1000 + Number(ms)
      );
    }

    card.append(display, startBtn, stopBtn, resetBtn);
    container.appendChild(card);
  })();

  // Countdown Timer
  (function () {
    const card = createCard("Countdown Timer");
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Enter seconds";
    const display = document.createElement("div");
    display.className = "time-display";
    const startBtn = document.createElement("button");
    startBtn.textContent = "Start";
    let interval,
      timeLeft = 0;

    startBtn.onclick = () => {
      timeLeft = parseInt(input.value, 10);
      updateDisplay();
      clearInterval(interval);
      interval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) clearInterval(interval);
      }, 1000);
    };

    function updateDisplay() {
      const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const secs = String(timeLeft % 60).padStart(2, "0");
      display.textContent = `${mins}:${secs}`;
    }

    card.append(input, startBtn, display);
    container.appendChild(card);
  })();

  // Pomodoro Timer
  (function () {
    const card = createCard("Pomodoro Timer");
    const display = document.createElement("div");
    display.className = "time-display";
    display.textContent = "25:00";
    const startBtn = document.createElement("button");
    startBtn.textContent = "Start";
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset";
    let timeLeft = 1500,
      interval;

    function updateDisplay() {
      const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const secs = String(timeLeft % 60).padStart(2, "0");
      display.textContent = `${mins}:${secs}`;
    }

    startBtn.onclick = () => {
      clearInterval(interval);
      interval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) clearInterval(interval);
      }, 1000);
    };

    resetBtn.onclick = () => {
      clearInterval(interval);
      timeLeft = 1500;
      updateDisplay();
    };

    card.append(display, startBtn, resetBtn);
    container.appendChild(card);
  })();

  // World Clock
  (function () {
    const card = createCard("World Clock");
    const zones = {
      UTC: "UTC",
      "America/New_York": "US Eastern",
      "Europe/London": "UK",
      "Europe/Berlin": "Central Europe",
      "Asia/Tokyo": "Japan",
      "Asia/Kolkata": "India",
      "Australia/Sydney": "Australia",
      "America/Los_Angeles": "US Pacific",
    };

    const list = document.createElement("ul");

    function updateTime() {
      list.innerHTML = "";
      for (const [tz, label] of Object.entries(zones)) {
        const li = document.createElement("li");
        const date = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        li.textContent = `${label}: ${formatter.format(date)}`;
        list.appendChild(li);
      }
    }

    setInterval(updateTime, 1000);
    updateTime();
    card.appendChild(list);
    container.appendChild(card);
  })();

  // Time Duration Calculator
  (function () {
    const card = createCard("Time Duration Calculator");
    const input1 = document.createElement("input");
    input1.type = "datetime-local";
    const input2 = document.createElement("input");
    input2.type = "datetime-local";
    const result = document.createElement("div");
    const calcBtn = document.createElement("button");
    calcBtn.textContent = "Calculate";

    calcBtn.onclick = () => {
      const d1 = new Date(input1.value);
      const d2 = new Date(input2.value);
      const diff = Math.abs(d2 - d1);
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);
      result.textContent = `${days} days, ${hours % 24} hours, ${
        mins % 60
      } minutes`;
    };

    card.append(input1, input2, calcBtn, result);
    container.appendChild(card);
  })();

  // Unix Timestamp Converter
  (function () {
    const card = createCard("Unix Timestamp Converter");
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Enter Unix timestamp";
    const result = document.createElement("div");

    input.oninput = () => {
      const ts = parseInt(input.value, 10);
      if (!isNaN(ts)) {
        result.textContent = new Date(ts * 1000).toLocaleString();
      }
    };

    card.append(input, result);
    container.appendChild(card);
  })();

  // Alarm Clock
  (function () {
    const card = createCard("Alarm Clock");
    const input = document.createElement("input");
    input.type = "time";
    const setBtn = document.createElement("button");
    setBtn.textContent = "Set Alarm";
    const status = document.createElement("div");
    const audio = new Audio(
      "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
    );

    setBtn.onclick = () => {
      const [h, m] = input.value.split(":").map(Number);
      const now = new Date();
      const alarmTime = new Date();
      alarmTime.setHours(h);
      alarmTime.setMinutes(m);
      alarmTime.setSeconds(0);

      const diff = alarmTime - now;
      if (diff > 0) {
        setTimeout(() => {
          audio.play();
          status.textContent = "Alarm Ringing!";
        }, diff);
        status.textContent = `Alarm set for ${input.value}`;
      }
    };

    card.append(input, setBtn, status);
    container.appendChild(card);
  })();

  // Timezone Converter
  (function () {
    const card = createCard("Timezone Converter");
    const input = document.createElement("input");
    input.type = "datetime-local";
    const select = document.createElement("select");
    const timezones = [
      "UTC",
      "America/New_York",
      "Europe/London",
      "Asia/Tokyo",
      "Australia/Sydney",
    ];
    timezones.forEach((tz) => {
      const opt = document.createElement("option");
      opt.value = tz;
      opt.textContent = tz;
      select.appendChild(opt);
    });
    const result = document.createElement("div");

    const btn = document.createElement("button");
    btn.textContent = "Convert";
    btn.onclick = () => {
      const date = new Date(input.value);
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: select.value,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      result.textContent = formatter.format(date);
    };

    card.append(input, select, btn, result);
    container.appendChild(card);
  })();

  // Calendar Countdown
  (function () {
    const card = createCard("Calendar Countdown");
    const input = document.createElement("input");
    input.type = "date";
    const display = document.createElement("div");

    input.oninput = () => {
      const now = new Date();
      const target = new Date(input.value);
      const diff = target - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        display.textContent = `${days} days remaining`;
      } else {
        display.textContent = "Date has passed.";
      }
    };

    card.append(input, display);
    container.appendChild(card);
  })();
})();
