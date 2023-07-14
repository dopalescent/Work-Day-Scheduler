var dateDisplay = $('#currentDay');
var scheduleDisplay = $('#root');

var workHours = '9AM_10AM_11AM_12PM_1PM_2PM_3PM_4PM_5PM'.split('_');
var thisHour = dayjs().format('hA');

// displays date
function displayDate() {
  var thisDate = dayjs().format('dddd, MMMM D');
  dateDisplay.text(thisDate);
}

// creates schedule
function printSchedule() {
  scheduleDisplay.empty();
  var schedule = readEntriesFromStorage();
  var futureSet = false;

  // creates each timeblock row
  for (var i = 0; i < workHours.length; i++) {
    var rowEl = $('<div class="row time-block past">');
    var rowName = $('<div class="col-2 col-md-1 hour text-center py-3">');
    rowName.text(workHours[i]);
    var rowText = $('<textarea class="col-8 col-md-10 description" rows="3">');
    var rowButton = $('<button class="btn saveBtn col-2 col-md-1" aria-label="save" data-index="' + i + '">');
    var buttonIdiom = $('<i class="fas fa-save" aria-hidden="true">');

    // sets color-change classes
    if (futureSet) {
      rowEl.removeClass('past');
      rowEl.addClass('future');
    } else if (workHours[i] === thisHour) {
      rowEl.removeClass('past');
      rowEl.addClass('present');
      futureSet = true;
    }

    // appending created elements to appropriate parents
    rowButton.append(buttonIdiom);
    rowEl.append(rowName, rowText, rowButton);
    scheduleDisplay.append(rowEl);

    // implementing local storage data
    for (var j = 0; j < schedule.length; j++) {
      var scheduleEntry = schedule[j];
      if (scheduleEntry.row === i) {
        rowText.val(scheduleEntry.text)
      }
    }
  }
}

// checks local storage for saved entries
function readEntriesFromStorage() {
  var schedule = localStorage.getItem('schedule');
  if (schedule) {
    schedule = JSON.parse(schedule);
  } else {
    schedule = [];
  }
  return schedule;
}

// saves entries to local storage
function saveEntryToStorage() {
  // creates variable for new entry
  var rowIndex = parseInt($(this).attr('data-index'));
  var entryText = $(this).siblings('.description').val();
  var scheduleEntry = {
    row: rowIndex,
    text: entryText
  }
  
  // adds new entry to other entries, saves all to local storage
  var schedule = readEntriesFromStorage();
  schedule.push(scheduleEntry)
  localStorage.setItem('schedule', JSON.stringify(schedule));
}

// listens for save button clicks, triggers save function
scheduleDisplay.on('click', '.saveBtn', saveEntryToStorage);

// applies date and creates schedule table on page load
displayDate();
printSchedule();
