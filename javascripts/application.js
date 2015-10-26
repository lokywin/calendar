var data = [];

var CalendarApp = React.createClass({
  render: function() {
    return (
      <div>
        <CalBodyLeftCol />
        <CalHeader />
        <CalBody />
      </div>
    );
  }
});

//
// Calendar header (Mon-Sun)
// ---------------------------------------------------------------------
var CalHeader = React.createClass({
  render: function() {
    return (
      <div id="cal_header" className="span-13">
        <div className="calheading weekend">Sun</div>
        <div className="calheading">Mon</div>
        <div className="calheading">Tue</div>
        <div className="calheading">Wed</div>
        <div className="calheading">Thu</div>
        <div className="calheading">Fri</div>
        <div className="calheading weekend">Sat</div>
      </div>
    );
  }
});

//
// Body of the calendar
// ---------------------------------------------------------------------
var CalBody = React.createClass({
  render: function() {
    return (
      <div id="cal_body" className="span-13">
        <CalBodyDates />
      </div>
    );
  }
});

//
// Everything on the left column
// Current year, month, date, current date image, caption, and source
// ---------------------------------------------------------------------
var CalBodyLeftCol = React.createClass({

  // Custom methods
  constructRequestURL: function(searchTerm) {
    var URL = "http://ajax.googleapis.com/ajax/services/search/images" +
      "?v=1.0" +
      "&q=" + searchTerm +
      "&rsz=3" +
      "&callback=?";

    return encodeURI(URL);
  },

  getDate: function() {
    var months=['January','February','March','April','May','June','July','August','September','October','November','December'],
        d = new Date(),
        dateObject = {};

    dateObject.todayDate = d.getDate();
    dateObject.thisYear = d.getFullYear();
    dateObject.thisMonth = months[d.getMonth()];

    return dateObject;
  },

  getInitialState: function() {
    return {
      data: []
    };
  },

  componentDidMount: function() {
    var today = this.getDate().todayDate,
        url = this.constructRequestURL(today),
        data = [];

    $.getJSON(url, function(dada){
      // console.log(dada);
      imgSource = dada.responseData.results[0].url;
      imgTitle = dada.responseData.results[0].titleNoFormatting;
      imgUrl = dada.responseData.results[0].visibleUrl;
      data.push({imgSource: imgSource, imgTitle: imgTitle, imgUrl: imgUrl})
    });
    this.setState({data: data})
  },

  render: function() {
    var dateObject = this.getDate(),
        completeDateString = dateObject.thisMonth + " " + dateObject.todayDate + ", " + dateObject.thisYear;

    return (
      <div className="this-month-year">
        <ThisMonth month={dateObject.thisMonth} />
        <ThisYear year={dateObject.thisYear} />
      </div>
    );
  }
});

var ThisYear = React.createClass({
  render: function() {
    return (
      <h2 className='this-year'>
        {this.props.year}
      </h2>
    );
  }
});

var ThisMonth = React.createClass({
  render: function() {
    return (
      <h1 className="this-month">
        {this.props.month}
      </h1>
    );
  }
});

var TodayDate = React.createClass({
  render: function() {
    return (
      <p id="today_date">
        {this.props.today}
      </p>
    );
  }
});

var TodayImg = React.createClass({
  render: function() {
    return (
      <img id="today_date_img" src={this.props.imgSource} />
    );
  }
});

var TodayCaption = React.createClass({
  render: function() {
    return (
      <p id="today_caption">
        Title:
        {this.props.imgTitle}
      </p>
    );
  }
});

var TodaySource = React.createClass({
  render: function() {
    return (
      <p id="today_source">
        Source:
        {this.props.imgUrl}
      </p>
    );
  }
});

//
// All dates on the right column
// ---------------------------------------------------------------------
var CalBodyDates = React.createClass({
  createDatesMarkup: function() {
    var daysInMonth=[31,0,31,30,31,30,31,31,30,31,30,31],
        d = new Date(),
        todayDate = d.getDate(),
        oD = new Date( d.getFullYear(), d.getMonth(), 1),
        html = "";

    oD.od = oD.getDay() + 1;
    daysInMonth[1]=(((oD.getFullYear() % 100 != 0) && (oD.getFullYear() % 4 == 0)) || (oD.getFullYear() % 400==0)) ? 29 : 28;

    for(i=1;i<=42;i++){
      var x = ((i-oD.od >= 0) && (i-oD.od < daysInMonth[d.getMonth()])) ? i - oD.od + 1 : '&nbsp;';

      if (x == todayDate) {
        html += '<div class="cal-day today ' + 'd-'+ x +'">';
      } else {
        html += '<div class="cal-day '+ 'd-' + x + ' cal-cellsetting">';
      }
      html += x + '</div>';
    }

    return {
      __html: html
    };
  },

  render: function() {
    return (
      <div id="cal_datecell" dangerouslySetInnerHTML={this.createDatesMarkup()} />
    );
  }
});

React.render(<CalendarApp />, document.getElementById('cal_wrapper') )