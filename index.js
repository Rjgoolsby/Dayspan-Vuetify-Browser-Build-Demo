
console.log(window);
var ds = window.Vue.DS;
var Calendar = ds.Calendar;
var Weekday = ds.Weekday;
var Month = ds.Month;
console.log(window);

new Vue({
  el: '#app',
  name: 'dayspan',
  data: vm => ({
    storeKey: 'dayspanState',
    calendar: Calendar.months(),
    readOnly: false,
    currentLocale: vm.$dayspan.currentLocale,
    locales: [
      { value: 'en', text: 'English' },
      { value: 'fr', text: 'French' }
    ],
    defaultEvents: [
      {
        data: {
          title: 'Weekly Meeting',
          color: '#3F51B5'
        },
        schedule: {
          dayOfWeek: [Weekday.MONDAY],
          times: [9],
          duration: 30,
          durationUnit: 'minutes'
        }
      },
      {
        data: {
          title: 'First Weekend',
          color: '#4CAF50'
        },
        schedule: {
          weekspanOfMonth: [0],
          dayOfWeek: [Weekday.FRIDAY],
          duration: 3,
          durationUnit: 'days'
        }
      },
      {
        data: {
          title: 'End of Month',
          color: '#000000'
        },
        schedule: {
          lastDayOfMonth: [1],
          duration: 1,
          durationUnit: 'hours'
        }
      },
      {
        data: {
          title: 'Mother\'s Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.MAY],
          dayOfWeek: [Weekday.SUNDAY],
          weekspanOfMonth: [1]
        }
      },
      {
        data: {
          title: 'New Year\'s Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.JANUARY],
          dayOfMonth: [1]
        }
      },
      {
        data: {
          title: 'Inauguration Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.JANUARY],
          dayOfMonth: [20]
        }
      },
      {
        data: {
          title: 'Martin Luther King, Jr. Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.JANUARY],
          dayOfWeek: [Weekday.MONDAY],
          weekspanOfMonth: [2]
        }
      },
      {
        data: {
          title: 'George Washington\'s Birthday',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.FEBRUARY],
          dayOfWeek: [Weekday.MONDAY],
          weekspanOfMonth: [2]
        }
      },
      {
        data: {
          title: 'Memorial Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.MAY],
          dayOfWeek: [Weekday.MONDAY],
          lastWeekspanOfMonth: [0]
        }
      },
      {
        data: {
          title: 'Independence Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.JULY],
          dayOfMonth: [4]
        }
      },
      {
        data: {
          title: 'Labor Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.SEPTEMBER],
          dayOfWeek: [Weekday.MONDAY],
          lastWeekspanOfMonth: [0]
        }
      },
      {
        data: {
          title: 'Columbus Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.OCTOBER],
          dayOfWeek: [Weekday.MONDAY],
          weekspanOfMonth: [1]
        }
      },
      {
        data: {
          title: 'Veterans Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.NOVEMBER],
          dayOfMonth: [11]
        }
      },
      {
        data: {
          title: 'Thanksgiving Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.NOVEMBER],
          dayOfWeek: [Weekday.THURSDAY],
          weekspanOfMonth: [3]
        }
      },
      {
        data: {
          title: 'Christmas Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.DECEMBER],
          dayOfMonth: [25]
        }
      }
    ]
  }),

  mounted()
  {
    window.app = this.$refs.app;

    this.loadState();
  },

  methods:
  {
    getCalendarTime(calendarEvent)
    {
      let sa = calendarEvent.start.format('a');
      let ea = calendarEvent.end.format('a');
      let sh = calendarEvent.start.format('h');
      let eh = calendarEvent.end.format('h');

      if (calendarEvent.start.minute !== 0)
      {
        sh += calendarEvent.start.format(':mm');
      }

      if (calendarEvent.end.minute !== 0)
      {
        eh += calendarEvent.end.format(':mm');
      }

      return (sa === ea) ? (sh + ' - ' + eh + ea) : (sh + sa + ' - ' + eh + ea);
    },

    setLocale(code)
    {
      moment.lang(code);

      this.$dayspan.setLocale(code);
      this.$dayspan.refreshTimes();

      this.$refs.app.$forceUpdate();
    },

    saveState()
    {
      let state = this.calendar.toInput(true);
      let json = JSON.stringify(state);

      localStorage.setItem(this.storeKey, json);
    },

    loadState()
    {
      let state = {};

      try
      {
        let savedState = JSON.parse(localStorage.getItem(this.storeKey));

        if (savedState)
        {
          state = savedState;
          state.preferToday = false;
        }
      }
      catch (e)
      {
        console.log( e );
      }

      if (!state.events || !state.events.length)
      {
        state.events = this.defaultEvents;
      }

      let defaults = this.$dayspan.getDefaultEventDetails();

      state.events.forEach(ev =>
      {
        ev.data = window.Vue.FC.dsMerge( ev.data, defaults );
      });

      this.$refs.app.setState( state );
    }
  }
})