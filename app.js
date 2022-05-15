var express = require('express'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  bodyParser = require('body-parser'),
  moment = require('moment');
(User = require('./models/user')), // For SCHEMA
  (Event = require('./models/event')), // For SCHEMA
  (Appeal = require('./models/appeal')), // For SCHEMA
  (Announcement = require('./models/announcement')), // For SCHEMA
  (Meeting = require('./models/meeting')), // For SCHEMA
  (Form = require('./models/form')), // For SCHEMA
  (Goal = require('./models/goal')), // For SCHEMA
  (Application = require('./models/application')), // For SCHEMA
  (Guideline = require('./models/guideline')), // For SCHEMA
  (Course = require('./models/course')), // For SCHEMA
  (LunchBuddy = require('./models/lunchBuddy')), // For SCHEMA
  (LocalStrategy = require('passport-local')),
  (passportLocalMongoose = require('passport-local-mongoose'));
nodeMailer = require('nodemailer');

var url = process.env.DATABASEURL || 'mongodb://localhost/slide';

//mongoose.connect(url);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/slide');

var app = express();
app.use(express.static('public')); // To allow static files
app.set('view engine', 'ejs');
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
); // Getting inputs from form and posting data
app.use(bodyParser.json());

app.use(flash()); // For flash messages

app.use(
  require('express-session')({
    secret: 'Slide is the best SLO',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passing variable to all routes
app.use(function (req, res, next) {
  res.locals.eventsLength = eventsLength;
  res.locals.currentAppeals = currentAppeals;
  res.locals.user = req.user;
  res.locals.success = req.flash('success');
  res.locals.check = req.flash('check');
  res.locals.failure = req.flash('failure');
  res.locals.error = req.flash('error');
  res.locals.submittedPointsLength = submittedPointsLength;

  next();
});

// Reading session, encoding
passport.use('local', new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'tamuslide@gmail.com',
    pass: 'Carpetjk18',
  },
});

var goals = {
  socialGoal: '10',
  serviceGoal: '3',
  programmingGoal: '5',
  meetingGoal: '14',
};

//==============================================================================
//                                 GENERAL ROUTES
//==============================================================================
app.get(
  '/.well-known/acme-challenge/AkplRW-XS0PXqwWLaVFs4V3FaykUC_ztXvlr6f9ZPno',
  function (req, res) {
    res.send(
      'AkplRW-XS0PXqwWLaVFs4V3FaykUC_ztXvlr6f9ZPno.JdgXhI9HBLARao1b6jB1UpiS9rDT1hjFqtqd7UzZF5U'
    );
  }
);

// -------------------------------- HOME PAGE-----------------------------------

app.get('/', function (req, res) {
  res.redirect('/home');
});

app.get('/home', function (req, res) {
  User.findOne(
    {
      position: 'President',
    },
    function (err, president) {
      if (err) console.log(err);
      else {
        User.findOne(
          {
            position: 'Vice President',
          },
          function (err, vicePresident) {
            if (err) console.log(err);
            else {
              res.render('landing/home', {
                president: president,
                vicePresident: vicePresident,
              });
            }
          }
        );
      }
    }
  );
});
// -------------------------------- STAFF PAGE-----------------------------------

app.get('/staff', function (req, res) {
  var pictures = [
    'https://image.ibb.co/kcTJHz/DSC_0184.jpg',
    'https://image.ibb.co/mvPEqK/DSC_0188.jpg',
    'https://image.ibb.co/dm8kxz/DSC_0174.jpg',
    'https://image.ibb.co/n04scz/DSC_0136.jpg',
    'https://image.ibb.co/mgaLVK/DSC_0141_2.jpg',
    'https://image.ibb.co/jKZEqK/DSC_0043.jpg',
    'https://image.ibb.co/duXOje/DSC_0047.jpg',
    'https://image.ibb.co/hA15xz/DSC_0080.jpg',
    'https://image.ibb.co/hBnOje/DSC_0087.jpg',
    'https://image.ibb.co/guP3je/DSC_0105.jpg',
    'https://image.ibb.co/moOw4e/DSC_0115.jpg',
    'https://image.ibb.co/jGZfVK/DSC_0119.jpg',
    'https://image.ibb.co/nOHOje/DSC_0141.jpg',
    'https://image.ibb.co/evo7AK/DSC_0169.jpg',
    'https://image.ibb.co/irzQxz/DSC_0212.jpg',
    'https://image.ibb.co/jHdJHz/DSC_0268.jpg',
  ];

  User.find(
    {
      role: 'staff',
    },
    function (err, staff) {
      console.log(staff);
      res.render('landing/staff', {
        staff: staff,
        pictures: pictures,
      });
    }
  );
});

// -------------------------------- SLIDERS PAGE-----------------------------------

app.get('/sliders', function (req, res) {
  res.render('landing/sliders');
});

// -------------------------------- COMMITTEES PAGE-----------------------------------

app.get('/committees', function (req, res) {
  res.render('landing/committees');
});

app.get('/committees/SAAM', function (req, res) {
  User.findOne(
    {
      position: 'SAAM Executive',
    },
    function (err, executive) {
      if (err) console.log(err);
      else {
        res.render('landing/SAAM', {
          executive: executive,
        });
      }
    }
  );
});

app.get('/committees/DEVO', function (req, res) {
  User.findOne(
    {
      position: 'DEVO Executive',
    },
    function (err, executive) {
      if (err) console.log(err);
      else {
        res.render('landing/DEVO', {
          executive: executive,
        });
      }
    }
  );
});

app.get('/committees/RAMH', function (req, res) {
  User.findOne(
    {
      position: 'RAMH Executive',
    },
    function (err, executive) {
      if (err) console.log(err);
      else {
        res.render('landing/RAMH', {
          executive: executive,
        });
      }
    }
  );
});

app.get('/committees/SHIP', function (req, res) {
  User.findOne(
    {
      position: 'SHIP Executive',
    },
    function (err, executive) {
      if (err) console.log(err);
      else {
        res.render('landing/SHIP', {
          executive: executive,
        });
      }
    }
  );
});

// -------------------------------- TERMS OF USE PAGE-----------------------------------

app.get('/terms-of-use', function (req, res) {
  res.render('landing/terms');
});

// -------------------------------- PRIVACY STATEMENT-----------------------------------

app.get('/privacy-statement', function (req, res) {
  res.render('landing/privacy');
});

// -------------------------------- PICTURES-----------------------------------

app.get('/pictures', function (req, res) {
  res.render('landing/pictures');
});
// -------------------------------- ABOUT-SLIDE-----------------------------------

app.get('/about-slide', function (req, res) {
  res.render('landing/about');
});

// --------------------------------EVENTS-----------------------------------

app.get('/events', function (req, res) {
  res.render('landing/events');
});

// -------------------------------- APPLY-----------------------------------

app.get('/admissions', function (req, res) {
  Application.findOne()
    .sort({
      created_at: -1,
    })
    .exec(function (err, foundApp) {
      if (err) console.log(err);
      else {
        res.render('landing/apply', {
          applications: foundApp,
        });
      }
    });
});

app.get('/SLIDE_app.pdf', function (req, res) {
  var filePath = '/SLIDE_app.pdf';

  fs.readFile(__dirname + filePath, function (err, data) {
    if (err) console.log(err);
    else {
      res.contentType('application/pdf');
      res.send(data);
    }
  });
});
// -------------------------------- CONTACT-US-----------------------------------

app.get('/contact-us', function (req, res) {
  res.render('landing/contact');
});

// POST route from contact form
app.post('/contact', function (req, res) {
  var senderName = '<h1>Name:&nbsp; ' + req.body.name + '<h1>';
  var senderEmail = '<h1>Email:&nbsp; ' + req.body.email + '<h1>';
  var senderSubject = '<h1>Subject:&nbsp; ' + req.body.subject + '<h1>';
  var text =
    senderName +
    senderEmail +
    senderSubject +
    '<p>Body:&nbsp; ' +
    req.body.text +
    '<p>';

  let mailOptions = {
    from: req.body.email, // sender address
    to: 'papisline2222@gmail.com', // list of receivers
    subject: 'Slide Website Email Notification', // Subject line
    text: req.body.text, // plain text body
    html: text, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    req.flash('success', ' Your email  has successfully been sent!');
    req.flash(
      'check',
      'Our staff will get back to you as soon as possible. Thank fou for contacting Us!'
    );
    res.redirect('/contact-us');
  });
});

//==============================================================================
//                                  AUTHENTICATION
//==============================================================================

// -------------------------------- MEMBER SIGN UP-----------------------------------

app.post('/member-sign-up', function (req, res) {
  User.register(
    new User({
      username: req.body.username,
      major: req.body.major,
      phoneNumber: req.body.phoneNumber,
      subcommittee: req.body.subcommittee,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      birthday: req.body.birthday,
      meetingPoints: 0,
      socialPoints: 0,
      servicePoints: 0,
      programmingPoints: 0,
      role: 'member',
    }),
    req.body.password,
    function (err, user) {
      // Hashing password
      if (err) {
        console.log(err);

        res.redirect('/error');
      } else {
        // If no error, log user in, takes care of session, using local strategy
        passport.authenticate('local')(req, res, function () {
          res.redirect('/logging-in');
        });
      }
    }
  );
});

// Checks if the access code is right
function isMemberGoodCode(req, res, next) {
  if (req.body.accessCode == '379268') {
    return next();
  } else {
    res.redirect('/error');
  }
}

// Checks if the access code is right
function isStaffGoodCode(req, res, next) {
  if (
    (req.body.accessCode == '848619' &&
      req.body.position.includes('Director')) ||
    (req.body.accessCode == '489638' &&
      (req.body.position.includes('President') ||
        req.body.position.includes('Executive')))
  ) {
    return next();
  } else {
    res.redirect('/error');
  }
}

// -------------------------------- STAFF SIGN UP---------------------------------------

app.post('/staff-sign-up', function (req, res) {
  User.register(
    new User({
      username: req.body.username,
      phoneNumber: req.body.phoneNumber,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      position: req.body.position,
      role: 'staff',
    }),
    req.body.password,
    function (err, user) {
      // Hashing password
      if (err) {
        console.log(err);
        res.redirect('/error');
      } else {
        // If no error, log user in, takes care of session, using local strategy
        passport.authenticate('local')(req, res, function () {
          res.redirect('/logging-in');
        });
      }
    }
  );
});

app.get('/error', function (req, res) {
  res.render('landing/error');
});
// -------------------------------- MEMBER/STAFF LOGIN PAGE-----------------------------------

// Middleware
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/my-home-page',
    failureRedirect: '/error',
  }),
  function (req, res) {
    console.log(req.user);
  }
);
//==============================================================================
// Global Variables
var eventsLength = 0;
var currentAppeals = 0;
var currentAppeals2 = 0;
var submittedPointsLength = 0;
//==============================================================================
//                                 MEMBER PAGE
//==============================================================================
// Requiring to be logged in for all routes at this point
app.all('*', isLoggedIn, function (req, res, next) {
  next(); // pass control to the next handler
});

app.get('/logging-in', function (req, res) {
  var role = req.user.role;
  res.render('landing/loader', {
    role: role,
  });
});

app.get('/logging-out', function (req, res) {
  res.render('landing/loader2');
});
//------------------------------------------------------------------------------
app.get('/my-home-page', isMember, function (req, res) {
  console.log(req.user.firstName + ' ' + req.user.lastName + ' just logged in');
  var userID = req.user._id;
  var EEvents;
  var currentEvent = new Array();

  Event.find(
    {
      wasSubmitted: false,
    },
    function (err, events) {
      if (err) {
        console.log(err);
      } else {
        events.forEach(function (event) {
          var counter = 1;
          var d = new Date();
          var m = new Date();
          m = event.eventDate;
          d = d.getTime();

          if (m > d) currentEvent.push(event);
        });

        User.findById(req.user._id)
          .populate('events')
          .exec(function (err, events) {
            if (err) console.log(err);
            else {
              // Sorting for next 3 events
              EEvents = events;
              var justEvents = events.events;
              justEvents.sort(function (a, b) {
                return a.eventDate - b.eventDate;
              });

              Event.find(
                {
                  wasSubmitted: false,
                },
                function (err, events) {
                  if (err) {
                    console.log(err);
                  } else {
                    var counter = 0;

                    events.forEach(function (event) {
                      var d = new Date();
                      var m = new Date();
                      m = event.eventDate;

                      d = d.getTime();
                      m = m.getTime();
                      if (
                        d < m + 86500000 &&
                        (event.numberSpots > 0 || event.numberSpots == null)
                      )
                        counter += 1;
                    });
                    eventsLength = counter;

                    Announcement.find({}, function (err, announcements) {
                      if (err) console.log(err);
                      else {
                        res.render('member/memberpage', {
                          EEvents: EEvents,
                          currentEvent: currentEvent,
                          eventsLength: eventsLength,
                          announcements: announcements,
                          goals: goals,
                        });
                      }
                    });
                  }
                }
              );
            }
          });
      }
    }
  );
});

//-----------------------------------------POINTS---------------------------------------------
app.get('/points/new', isMember, function (req, res) {
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        res.render('member/submitPoint', {
          user: req.user,
          EEvents: EEvents,
        });
      }
    });
});
//==========================================================================================
app.post('/points', isMember, function (req, res) {
  var event = {
    eventName: req.body.eventName,
    eventDate: req.body.eventDate,
    pointType: req.body.pointType,
    Location: req.body.Location,
    Description: req.body.Description,
    pointShift: 1,
    // wasSubmitted used to differentiate with events that are created for everyone
    wasSubmitted: true,
    status: 'pending',
    creatorName: req.user.firstName + ' ' + req.user.lastName,
    creatorID: req.user._id,
    creatorPicture: req.user.profilePicture,
  };

  Event.create(event, function (err, submittedEvent) {
    if (err) console.log(err);
    else {
      submittedPointsLength = +1;
      req.flash(
        'success',
        ' Your point request has successfully been submitted.'
      );
      req.flash(
        'check',
        'Check this page later for a decision from the Membership Executives.'
      );
      res.redirect('/points/view');
    }
  });
});
//--------------------------------------------------------------------------------------
app.get('/points/view', isMember, function (req, res) {
  var EEvents;
  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        User.findById(req.user._id)
          .populate('serviceEvents')
          .populate('socialEvents')
          .populate('programmingEvents')
          .exec(function (err, user) {
            if (err) console.log(err);
            else {
              var serviceEvents = user.serviceEvents;
              var socialEvents = user.socialEvents;
              var programmingEvents = user.programmingEvents;
              res.render('member/myPoints', {
                goals: goals,
                EEvents: EEvents,
                user: user,
              });
            }
          });
      }
    });
});

//-----------------------------------------EVENTS---------------------------------------------

//INDEX - show all events
app.get('/event', isLoggedIn, function (req, res) {
  var userEvents = req.user.events;
  var role = req.user.role;
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });

        Event.find({
          wasSubmitted: false,
          lunchBuddy: false,
        })
          .sort({
            eventDate: 'asc',
          })
          .exec(function (err, events) {
            if (err) console.log(err);
            else {
              if (err) {
                console.log(err);
              } else {
                var counter = 0;
                events.forEach(function (event) {
                  var d = new Date();
                  var m = new Date();
                  m = event.eventDate;

                  d = d.getTime();
                  m = m.getTime();
                  if (
                    d < m + 86500000 &&
                    (event.numberSpots > 0 || event.numberSpots == null)
                  )
                    counter += 1;
                });
                eventsLength = counter;
                events.sort(function (a, b) {
                  return a.eventDate - b.eventDate;
                });

                res.render('member/viewEvents', {
                  userEvents: userEvents,
                  events: events,
                  EEvents: EEvents,
                });
              }
            }
          });
      }
    });
});

//==============================================================================
//NEW - show form to create new event
app.get('/event/create', isLoggedIn, function (req, res) {
  var role = req.user.role;
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        res.render('member/createEvent', {
          EEvents: EEvents,
        });
      }
    });
});
//==============================================================================
////CREATE - add new event to DB
app.post('/event', isLoggedIn, function (req, res) {
  var date = new Date(req.body.eventDate);

  var event = {
    eventName: req.body.eventName,
    pointType: req.body.pointType,
    pointShift: req.body.pointShift,
    eventDate: date,
    Description: req.body.Description,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    numberSpots: req.body.numberSpots,
    Location: req.body.Location,
    slots: req.body.slots,
  };

  Event.create(event, function (err, eventReturn) {
    if (err) res.send(err);
    else {
      Event.find(
        {
          wasSubmitted: false,
        },
        function (err, events) {
          if (err) {
            console.log(err);
          } else {
            var counter = 0;
            events.forEach(function (event) {
              var d = new Date();
              var m = new Date();
              m = event.eventDate;
              d = d.getTime();
              m = m.getTime();
              if (
                d < m + 86500000 &&
                (event.numberSpots > 0 || event.numberSpots == null)
              )
                counter += 1;
            });
            eventsLength = counter;
            var shiftArrays = [];
            // -------- Creating slot events -------------
            if (eventReturn.slots == 'Yes') {
              var start = moment.utc(eventReturn.startTime, 'HH:mm');
              var end = moment.utc(eventReturn.endTime, 'HH:mm');
              var s = moment.utc(+start).format('H:mm');
              var end2 = moment.utc(+end).format('H:mm');

              var shiftNumber = 1;

              while (s != end2) {
                var shiftTitle = req.body.eventName + ' Shift ' + shiftNumber;
                var shiftStart = s;
                start.add(30, 'minutes');
                var shiftEnd = moment.utc(+start).format('H:mm');
                var shift = {
                  eventName: shiftTitle,
                  pointType: req.body.pointType,
                  pointShift: req.body.pointShift,
                  eventDate: date,
                  Description: req.body.Description,
                  startTime: shiftStart,
                  endTime: shiftEnd,
                  numberSpots: req.body.numberSpots,
                  Location: req.body.Location,
                  Shift: 'Yes',
                };

                shiftNumber += 1;
                shiftArrays.push(shift);
                s = moment.utc(+start).format('H:mm');
              }

              Event.collection.insert(
                shiftArrays,
                {
                  ordered: false,
                },
                function (err, shifts) {
                  if (err) console.log(err);
                  else {
                    var ids = shifts.insertedIds;
                    console.log(ids);
                    for (var i = 0; i < shifts.insertedCount; ++i) {
                      eventReturn.slotsIDs.push(ids[i]);
                      //eventReturn.save();
                    }
                    eventReturn.save();

                    req.flash(
                      'success',
                      ' Event has successfully been created.'
                    );
                    req.flash('check', 'It can be viewed on this page.');
                    res.redirect('/event');
                  }
                }
              );
            } else {
              req.flash('success', ' Event has successfully been created.');
              req.flash('check', 'It can be viewed on this page.');
              res.redirect('/event');
            }
          }
        }
      );
    }
  });
});

// ==============================================================================

app.get('/event/shifts/:id', function (req, res) {
  var userID = req.user._id;
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        User.findById(userID)
          .populate('events')
          .populate('wentEvents')
          .exec(function (err, user) {
            if (err) console.log(err);
            else {
              var eventID = req.params.id;
              Event.findById(eventID)
                .populate('slotsIDs')
                .exec(function (err, event) {
                  var shifts = event.slotsIDs;
                  res.render('staff/shifts', {
                    event: event,
                    shifts: shifts,
                    events: user.events,
                    wentEvents: user.wentEvents,
                    EEvents: EEvents,
                  });
                });
            }
          });
      }
    });
});

app.get('/event/shifts/:id/table', function (req, res) {
  Event.findById(req.params.id)
    .populate({
      path: 'slotsIDs',
      populate: {
        path: 'userIDs',
        model: 'User',
      },
    })
    .exec(function (err, event) {
      if (err) console.log(err);
      else {
        User.findById(req.user._id)
          .populate('events')
          .exec(function (err, events) {
            if (err) console.log(err);
            else {
              var EEvents = events;
              //console.log(EEvents);
              res.render('staff/shiftTable', {
                shifts: event.slotsIDs,
                EEvents: EEvents,
              });
            }
          });
      }
    });
});

//==============================================================================
// Signing up for specific event
app.get('/event/:id', isMember, function (req, res) {
  var eventID = req.params.id;
  var userID = req.user.id;
  var userEvents = req.user.events;
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        Event.findById(eventID, function (err, foundEvent) {
          if (err) console.log(err);
          else {
            console.log('problem 1');
            User.findById(userID, function (err, foundUser) {
              if (err) console.log(err);
              else {
                var x = 1;
                userEvents.forEach(function (event) {
                  if (event == eventID) {
                    x = 0;
                  }
                });

                if (x == 1) {
                  foundUser.events.push(foundEvent);
                  foundEvent.userIDs.push(foundUser._id);

                  //foundUser.events.sort({eventDate:'asc'});
                  foundUser.save();
                  foundEvent.save();
                }
                // Decreasing number of spots
                var x;
                if (foundEvent.numberSpots != null)
                  x = foundEvent.numberSpots - 1;
                else x = null;

                //Updating number of spots
                Event.findByIdAndUpdate(
                  eventID,
                  {
                    numberSpots: x,
                  },
                  function (err, data) {
                    if (err) console.log(err);
                    else {
                      console.log('problem 4');
                      req.flash('success', ' Event has been added .');
                      res.redirect('/my-events');
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
});

//==============================================================================
// Signing up for specific event
app.get('/event/:id/staff', isStaff, function (req, res) {
  var eventID = req.params.id;
  var userID = req.user.id;
  var userEvents = req.user.events;
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        Event.findById(eventID, function (err, foundEvent) {
          if (err) console.log(err);
          else {
            User.findById(userID, function (err, foundUser) {
              if (err) console.log(err);
              else {
                var x = 1;
                userEvents.forEach(function (event) {
                  if (event == eventID) {
                    x = 0;
                  }
                });

                if (x == 1) {
                  foundUser.events.push(foundEvent);
                  foundEvent.userIDs.push(foundUser._id);
                  //foundUser.events.sort({eventDate:'asc'});
                  foundUser.save();
                  foundEvent.save();
                }

                // Decreasing number of spots
                var x;
                if (foundEvent.numberSpots != null)
                  x = foundEvent.numberSpots - 1;
                else x = null;

                //Updating number of spots
                Event.findByIdAndUpdate(
                  eventID,
                  {
                    numberSpots: x,
                  },
                  function (err, data) {
                    if (err) console.log(err);
                    else {
                      req.flash('success', ' Event has been added .');
                      res.redirect('/event');
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
});
//==============================================================================

app.get('/my-events/:id/went', isMember, function (req, res) {
  var eventID = req.params.id; // Event that Useer went to
  var userID = req.user.id; // User ID
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        //Find the user
        User.findById(userID, function (err, foundUser) {
          if (err) console.log(err);
          else {
            //Check that there are no duplicates before pushing
            //Push Event ID inside USER's wentEvent array and specific event array

            Event.findById(eventID, 'pointType', function (err, event) {
              if (err) console.log(err);
              else {
                if (event.pointType == 'Service') {
                  foundUser.serviceEvents.push(eventID);
                }
                if (event.pointType == 'Social') {
                  foundUser.socialEvents.push(eventID);
                }
                if (event.pointType == 'Programming') {
                  foundUser.programmingEvents.push(eventID);
                }

                event.postCondition = false;
                event.save();
              }
              foundUser.wentEvents.push(eventID);
              // foundUser.wentEvents.sort({eventDate:'asc'});
              //Delete Event ID from current event array
              var index = foundUser.events.indexOf(eventID);
              if (index > -1) {
                foundUser.events.splice(index, 1);
              }

              //Saving it
              foundUser.save(function (err, data) {
                if (err) console.log(err);
                else {
                  req.flash('success', 'Point awarded! Congratulations!');
                  req.flash(
                    'check',
                    'Remember, the more events you go to the higher your chances of winning the prize.'
                  );
                  res.redirect('back'); // redirects to current page
                }
              });
            });
          }
        });
      }
    });
});

//==============================================================================

app.get('/my-events/:id/cancel', function (req, res) {
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
      }
    });

  var eventID = req.params.id; // Event that Useer went to
  var userID = req.user.id; // User ID

  User.findById(userID, function (err, foundUser) {
    if (err) console.log(err);
    else {
      Event.findById(eventID, function (err, foundEvent) {
        if (err) console.log(err);
        else {
          //Updating number of spots
          if (foundEvent.numberSpots != null) {
            Event.findByIdAndUpdate(
              eventID,
              {
                numberSpots: foundEvent.numberSpots + 1,
              },
              function (err, foundEvent) {
                if (err) console.log(err);
                else {
                  foundEvent.save();
                }
              }
            );
          }
          // Removing event from User
          var index = foundUser.events.indexOf(eventID);
          if (index > -1) {
            foundUser.events.splice(index, 1);
          }
          foundUser.save();

          // Removing user from event
          var index1 = foundEvent.userIDs.indexOf(userID);
          if (index1 > -1) {
            foundEvent.userIDs.splice(index1, 1);
          }
          foundEvent.save();

          req.flash('failure', 'Event has been cancelled.');
          res.redirect('back');
        }
      });
    }
  });
});
//==============================================================================
app.get('/my-events', isMember, function (req, res) {
  var userID = req.user._id;
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        User.findById(userID)
          .populate('events')
          .populate('wentEvents')
          .exec(function (err, user) {
            if (err) console.log(err);
            else
              res.render('member/myEvents', {
                events: user.events,
                wentEvents: user.wentEvents,
                EEvents: EEvents,
              });
          });
      }
    });
});

//-----------------------------------------APPEALS---------------------------------------------
app.get('/appeals/new', function (req, res) {
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        res.render('member/submitAppeal', {
          user: req.user,
          EEvents: EEvents,
        });
      }
    });
});

//============================================================================================
app.post('/appeals', function (req, res) {
  var requesterID = req.user._id;

  var eventName = req.body.eventName;
  var eventType = req.body.eventType;
  var eventDate = req.body.eventDate;
  var reason = req.body.reason;
  var reasonDescription = req.body.reasonDescription;
  var staffDecision = req.body.staffDecision;
  var showCondition = false;
  var requesterID = req.user._id;
  var requesterName = req.user.firstName + ' ' + req.user.lastName;
  var requesterEmail = req.user.email;
  var requesterPicture = req.user.profilePicture;

  var datetime = new Date().toISOString().split('T')[0];

  var appeal = {
    eventName: eventName,
    eventDate: eventDate,
    eventType: eventType,
    reason: reason,
    reasonDescription: reasonDescription,
    showCondition: showCondition,
    staffDecision: staffDecision,
    submissionDate: datetime,
    requesterID: requesterID,
    requesterName: requesterName,
    requesterEmail: requesterEmail,
    requesterPicture: requesterPicture,
  };

  // Creating appeal
  Appeal.create(appeal, function (err, appeal) {
    if (err) console.log(err);
    else {
      // Finding user who made request
      User.findById(requesterID, function (err, foundUser) {
        if (err) console.log(err);
        else {
          // Associating appeal to requester
          foundUser.appeals.push(appeal._id);
          foundUser.save();

          Appeal.find(
            {
              staffDecision: null,
            },
            function (err, appeals) {
              if (err) console.log(err);
              else {
                currentAppeals = appeals.length;

                User.find(
                  {
                    position: 'Membership Executive',
                  },
                  function (err, membershipExecs) {
                    if (err) console.log(err);
                    else {
                      //   var membershipEmail1 = membershipExecs[0].email;

                      //   var membershipEmail2;
                      //   if(membershipExecs[1] != undefined) membershipEmail2 = membershipExecs[1].email;

                      // var mytext = "<h1>APPEAL NOTIFICATION<h1> <p>This is to let you know that the following appeal was submitted:</p>" +
                      //  "<p> Requester Name:&nbsp;" + requesterName+ "</p>" +
                      //  "<p> Event Name:&nbsp;" + eventName + "</p>" +
                      //  "<p> Event Date:&nbsp; " + eventDate + "</p>" +
                      //  "<p> Event Type:&nbsp; " + eventType + "</p>" +
                      //  "<p> Reason:&nbsp; " + reason  + "</p>" +
                      //  "<p> Reason Description:&nbsp; " + reasonDescription + "</p>";

                      // let mailOptions = {
                      //     from: 'TAMU SLIDE<tamuslide@gmail.com>', // sender address
                      //     to: membershipEmail1+','+ membershipEmail1+','+'jdsingleton16@tamu.edu, taylorsoukup96@tamu.edu', // list of receivers
                      //     subject: "Slide Appeal Notification ", // Subject line
                      //     text: 'Hello to myself!',
                      //     html: mytext // html body
                      // };

                      // transporter.sendMail(mailOptions);

                      req.flash(
                        'success',
                        ' Your appeal has successfully been submitted.'
                      );
                      req.flash(
                        'check',
                        'Check this page later for a decision from the Membership Executives.'
                      );
                      res.redirect('/appeals');
                    }
                  }
                );
              }
            }
          );
        }
      });
    }
  });
});

//============================================================================================
app.get('/appeals', function (req, res) {
  var userEvents = req.user.events;
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .sort({
      submissionDate: 'asc',
    })
    .populate('appeals')
    .exec(function (err, foundUser) {
      if (err) console.log(err);
      else {
        EEvents = foundUser;
        var justEvents = foundUser.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });

        Event.find({
          wasSubmitted: false,
        })
          .sort({
            eventDate: 'asc',
          })
          .exec(function (err, events) {
            if (err) console.log(err);
            else {
              if (err) {
                console.log(err);
              } else {
                var counter = 0;
                events.forEach(function (event) {
                  var d = new Date();
                  var m = new Date();
                  m = event.eventDate;
                  d = d.getTime();
                  m = m.getTime();
                  if (
                    d - 43200000 < m &&
                    (event.numberSpots > 0 || event.numberSpots == null)
                  )
                    counter += 1;
                });
                eventsLength = counter;

                res.render('member/viewAppeals', {
                  userEvents: userEvents,
                  events: events,
                  EEvents: EEvents,
                  appeals: foundUser.appeals,
                });
              }
            }
          });
      }
    });
});

//-----------------------------------------GUIDELINES---------------------------------------------

app.get('/guidelines', isLoggedIn, function (req, res) {
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        Guideline.find(
          {
            category: 'Points',
          },
          function (err, pointsGuidelines) {
            if (err) console.log(err);
            else {
              Guideline.find(
                {
                  category: 'Appeals',
                },
                function (err, appealsGuidelines) {
                  if (err) console.log(err);
                  else {
                    Guideline.find(
                      {
                        category: 'Drinking',
                      },
                      function (err, drinkingGuidelines) {
                        if (err) console.log(err);
                        else {
                          EEvents = events;
                          var justEvents = events.events;
                          justEvents.sort(function (a, b) {
                            return a.eventDate - b.eventDate;
                          });
                          res.render('member/guidelines', {
                            pointsGuidelines: pointsGuidelines,
                            appealsGuidelines: appealsGuidelines,
                            drinkingGuidelines: drinkingGuidelines,
                            EEvents: EEvents,
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
});

// -------------------------------------- FQAs-------------------------------------------

app.get('/faqs', isLoggedIn, function (req, res) {
  var EEvents;
  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        Guideline.find(
          {
            category: 'FAQs',
          },
          function (err, faqs) {
            EEvents = events;
            var justEvents = events.events;
            justEvents.sort(function (a, b) {
              return a.eventDate - b.eventDate;
            });
            res.render('member/questions', {
              faqs: faqs,
              user: req.user,
              EEvents: EEvents,
            });
          }
        );
      }
    });
});

// -------------------------------------- FORMS-------------------------------------------
app.get('/forms', isLoggedIn, function (req, res) {
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });

        Form.find({}, function (err, allForms) {
          if (err) console.log(err);
          else {
            res.render('member/forms', {
              user: req.user,
              EEvents: EEvents,
              forms: allForms,
            });
          }
        });
      }
    });
});
// -------------------------------------- CONTACT SHEET-------------------------------------
app.get('/contact-sheet', isLoggedIn, function (req, res) {
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        res.render('member/contactSheet', {
          EEvents: EEvents,
        });
      }
    });
});
//-----------------------------------CALENDAR-----------------------------------------

app.get('/calendar', function (req, res) {
  var EEvents;

  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });

        Event.find(
          {
            wasSubmitted: false,
          },
          function (err, events) {
            if (err) {
              console.log(err);
            } else {
              res.render('member/calendar', {
                EEvents: EEvents,
              });
            }
          }
        );
      }
    });
});
// -------------------------------------- GOOGLE DRIVE-------------------------------------
app.get('/slide-google-drive', isLoggedIn, function (req, res) {
  var EEvents;
  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        res.render('member/googleDrive', {
          EEvents: EEvents,
          currentAppeals: currentAppeals,
          submittedPointsLength: submittedPointsLength,
        });
      }
    });
});

// -------------------------------------- LUNCH BUDDY-------------------------------------

app.get('/lunch-buddy', function (req, res) {
  var EEvents;
  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        EEvents = events;
        var justEvents = events.events;
        justEvents.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });

        Event.find({
          lunchBuddy: true,
        })
          .populate('lunchBuddyIds')
          .exec(function (err, lunchBuddyEvents) {
            if (err) console.log(err);
            else {
              res.render('member/lunchBuddy', {
                EEvents: EEvents,
                lunchBuddyEvents: lunchBuddyEvents,
              });
            }
          });
      }
    });
});

// -------------------------------------- STUDY GROUPS-------------------------------------
app.get('/study-groups', function (req, res) {
  var role = req.user.role;
  var EEvents;
  User.findById(req.user._id)
    .populate('events')
    .exec(function (err, events) {
      if (err) console.log(err);
      else {
        Course.find({}).exec(function (err, allCourses) {
          EEvents = events;
          var justEvents = events.events;
          justEvents.sort(function (a, b) {
            return a.eventDate - b.eventDate;
          });
          res.render('member/studyGroups', {
            allCourses: allCourses,
            user: req.user,
            EEvents: EEvents,
          });
        });
      }
    });
});
//==================================================

app.post('/study-groups', function (req, res) {
  User.findById(req.user._id, function (err, user) {
    if (err) console.log(err);
    else {
      var course =
        req.body.courseCode.toUpperCase() + '-' + req.body.courseNumber;

      if (course.length === 8) {
        user.courses.push(course);
        user.save();
      }

      //Getting all of the courses that already exits.
      Course.find({}, function (err, courses) {
        if (err) console.log(err);
        else {
          var condition = false;
          courses.forEach(function (existingCourse) {
            //Checking each course to see if course already exists
            if (course == existingCourse.courseID) {
              //If course already exists then add user.
              existingCourse.users.push({
                name: req.user.firstName + ' ' + req.user.lastName,
                profilePicture: req.user.profilePicture,
              });
              existingCourse.save();
              condition = true;
            }
          });
          //If course doesn't exist then create it and add user.
          if (condition == false) {
            var newCourse = {
              courseID: course,
            };
            Course.create(newCourse, function (err, newlyCreatedCourse) {
              if (err) console.log(err);
              else {
                newlyCreatedCourse.users.push({
                  name: req.user.firstName + ' ' + req.user.lastName,
                  profilePicture: req.user.profilePicture,
                });
                newlyCreatedCourse.save();
                req.flash('success', course + ' has successfully been added.');
                res.redirect('/study-groups');
              }
            });
          } else {
            req.flash('success', course + ' has successfully been added.');
            res.redirect('/study-groups');
          }
        }
      });
    }
  });
});

//======================DELETING COURSE FOR USER===================================
app.get('/study-groups/delete/:courseID', function (req, res) {
  var course = req.params.courseID;
  User.findById(req.user._id, function (err, user) {
    if (err) console.log(err);
    else {
      // Removing it from user's courses array
      for (var i = 0; i < user.courses.length; ++i) {
        if (user.courses[i] == course) {
          user.courses.splice(i, 1);
          user.save();
        }
      }
      // Removing Name of user from correspondig courses Array
      Course.findOne(
        {
          courseID: course,
        },
        function (err, foundCourse) {
          for (var i = 0; i < foundCourse.users.length; ++i) {
            var username = req.user.firstName + ' ' + req.user.lastName;
            if (foundCourse.users[i].name == username) {
              foundCourse.users.splice(i, 1);
              foundCourse.save();
            }
          }
        }
      );
      req.flash('success', course + ' has successfully been deleted.');
      res.redirect('/study-groups');
    }
  });
});

//======================HAVE READ CONSTITUTION================================================
app.get('/have-read-constitution', isMember, function (req, res) {
  User.findByIdAndUpdate(
    req.user._id,
    {
      haveReadConstitution: true,
    },
    function (err, user) {
      if (err) console.log(err);
      else {
        req.flash(
          'success',
          'Thank you for taking the time to read the constitution!'
        );
        res.redirect('back');
      }
    }
  );
});

// -------------------------------- MEMBER/STAFF LOGOUT PAGE-----------------------------------

//  app.get("/welcome",isLoggedIn, function(req, res){
//     var firstName = req.user.firstName;
//     var subcommittee = req.user.subcommittee;
//     var position = req.user.position;

//     res.render("landing/welcome",{firstName:firstName,subcommittee:subcommittee,position:position});

// });

app.get('/logout', function (req, res) {
  res.redirect('/logging-out');
  req.logout();
});

// Checks if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/home');
}

// Checks if the user is member or staff
function isMember(req, res, next) {
  if (req.user.role == 'member') {
    return next();
  }
  res.redirect('/home');
}

function isStaff(req, res, next) {
  if (req.user.role == 'staff') {
    return next();
  }
  res.redirect('/home');
}

//==================================================================================================================================
//                                 STAFF PAGE
//==================================================================================================================================

// Requiring to be staff member in for all routes at this point
app.all('*', isStaff, function (req, res, next) {
  next(); // pass control to the next handler
});

//==============================================================================

app.get('/home-page', function (req, res) {
  console.log(req.user.firstName + ' ' + req.user.lastName + ' just logged in');
  User.find(
    {
      role: 'member',
    },
    function (err, members) {
      if (err) console.log(err);
      else {
        Event.find(
          {
            wasSubmitted: false,
          },
          function (err, events) {
            if (err) console.log(err);
            else {
              var counter = 0;
              events.forEach(function (event) {
                var d = new Date();
                var m = new Date();
                m = event.eventDate;
                d = d.getTime();
                m = m.getTime();
                if (
                  d < m + 86500000 &&
                  (event.numberSpots > 0 || event.numberSpots == null)
                )
                  counter += 1;
              });
              eventsLength = counter;
              var today = new Date();
              Appeal.find({}).exec(function (err, AllAppeals) {
                var neededAppeals = [];
                AllAppeals.forEach(function (appeal) {
                  var today = new Date();
                  if (appeal.eventDate != null) {
                    if (appeal.eventDate.getTime() >= today)
                      neededAppeals.push(appeal);
                  }
                  var today = new Date();
                });
                Event.find(
                  {
                    lunchBuddy: false,
                    pointType: {
                      $ne: 'Programming',
                    },
                    eventDate: {
                      $gt: today,
                    },
                  },
                  function (err, currentEvents) {
                    Event.find(
                      {
                        eventName: /True Life/,
                      },
                      '_id',
                      function (err, trueLifeEvents) {
                        User.find(
                          {
                            role: 'member',
                          },
                          function (err, members) {
                            var condition = false;
                            var haveNotSignedUp = [];
                            for (var z = 0; z < members.length; ++z) {
                              for (
                                var i = 0;
                                i < members[z].events.length;
                                ++i
                              ) {
                                for (
                                  var j = 0;
                                  j < trueLifeEvents.length;
                                  ++j
                                ) {
                                  if (
                                    members[z].events[i].toString() ==
                                    trueLifeEvents[j]._id.toString()
                                  ) {
                                    condition = true;
                                    break;
                                  }
                                }
                              }
                              if ((condition = false))
                                haveNotSignedUp.push(members[z]);
                            }

                            res.render('staff/homepage', {
                              appeals: neededAppeals,
                              currentEvents: currentEvents,
                            });
                          }
                        );
                      }
                    );
                  }
                );
              });
            }
          }
        );
      }
    }
  );
});

// --------------------------------------EVENTS-----------------------------------

app.get('/event/view/:id', function (req, res) {
  var eventID = req.params.id;
  var signedUpUsers;
  var wentUsers;
  var missedUsers;
  Event.findById(eventID)
    .populate('wentUsers')
    .populate('missedUsers')
    .populate('userIDs')
    .exec(function (err, foundEvent) {
      if (err) console.log(err);
      else {
        signedUpUsers = foundEvent.userIDs;
        res.render('staff/specificEvent', {
          signedUpUsers: signedUpUsers,
          event: foundEvent,
          eventID: eventID,
        });
      }
    });
});

//==============================================================================
app.get('/event/delete/:id', function (req, res) {
  var eventID = req.params.id;
  Event.findByIdAndRemove(eventID, function (err) {
    if (err) console.log(err);
    else {
      req.flash('success', 'Event has been deleted!');
      res.redirect('/event');
    }
  });
});
// --------------------------------------ANNOUNCEMENTS-----------------------------
app.get('/announcements', function (req, res) {
  Announcement.find({}, function (err, announcements) {
    if (err) console.log(err);
    res.render('staff/announcement', {
      announcements: announcements,
    });
  });
});
//==================================================================
app.post('/announcements', function (req, res) {
  var title = req.body.title;
  var text = req.body.text;

  var announcement = {
    title: title,
    text: text,
  };
  Announcement.create(announcement, function (err, createdAnnouncement) {
    if (err) console.log(err);
    else {
      req.flash('success', 'Announcement has been created and posted!');
      res.redirect('/announcements');
    }
  });
});
//==================================================================
app.get('/announcements/:id', function (req, res) {
  var eventID = req.params.id;

  Announcement.findByIdAndRemove(eventID, function () {
    req.flash('success', 'Announcement has been deleted!');
    res.redirect('/announcements');
  });
});
// --------------------------------------POINTS-----------------------------
app.get('/meetings', function (req, res) {
  User.find({
    role: 'member',
  })
    .sort({
      lastName: 'asc',
    })
    .exec(function (err, members) {
      if (err) console.log(err);
      Meeting.find({}).exec(function (err, meetings) {
        if (err) console.log(err);
        else {
          res.render('staff/attendance', {
            members: members,
            meetings: meetings,
            requestee: req.user,
          });
        }
      });
    });
});
//==================================================================
app.post('/meetings/new', function (req, res) {
  var meetingDate = req.body.meetingDate;
  var meeting = {
    meetingDate: meetingDate,
  };
  Meeting.create(meeting, function (err, createdMeeting) {
    if (err) console.log(err);
    else {
      req.flash('success', 'Meeting has been created!');
      res.redirect('/meetings');
    }
  });
});

//==================================================================
app.get('/meetings/:id', function (req, res) {
  var meetingID = req.params.id;
  Meeting.findById(meetingID, function (err, MMeeting) {
    if (err) console.log(err);
    else {
      User.find({
        role: 'member',
      })
        .sort({
          lastName: 'asc',
        })
        .exec(function (err, members) {
          if (err) console.log(err);
          else {
            Meeting.findById(meetingID)
              .populate('presentIDs')
              .populate('absentIDs')
              .exec(function (err, newfoundMeeting) {
                if (err) console.log(err);
                foundMeeting = newfoundMeeting;
                res.render('staff/specificMeeting', {
                  members: members,
                  foundMeeting: foundMeeting,
                });
              });
          }
        });
    }
  });
});
//==================================================================
app.get('/meetings/:id/delete', function (req, res) {
  var meetingID = req.params.id;
  Meeting.findByIdAndRemove(meetingID, function (err) {
    if (err) console.log(err);
    else {
      req.flash('success', 'Meeting has been deleted!');
      res.redirect('/meetings');
    }
  });
});

//==================================================================

app.get('/meetings/:meetingID/present/:userID', function (req, res) {
  var userID = req.params.userID;
  var meetingID = req.params.meetingID;

  Meeting.findById(meetingID, function (err, Meeting) {
    if (err) console.log(err);
    else {
      Meeting.presentIDs.push(userID);
      // Meeting.presentIDs.sort({lastName:'asc'});
      Meeting.save();
      User.findById(userID, function (err, foundUser) {
        if (err) console.log(err);
        else {
          var meetingPoints = foundUser.meetingPoints + 1;

          User.findByIdAndUpdate(
            userID,
            {
              meetingPoints: meetingPoints,
            },
            function (err, user) {
              if (err) console.log(err);
              else {
                req.flash('success', 'Present!');
                res.redirect('/meetings/' + meetingID);
              }
            }
          );
        }
      });
    }
  });
});
//==================================================================

app.get('/meetings/:meetingID/absent/:userID', function (req, res) {
  var userID = req.params.userID;
  var meetingID = req.params.meetingID;

  Meeting.findById(meetingID, function (err, Meeting) {
    if (err) console.log(err);
    else {
      Meeting.absentIDs.push(userID);
      Meeting.save();
      //Meeting.absentIDs.sort({lastName:'asc'});
      Meeting.save();
      req.flash('failure', 'Absent!');
      res.redirect('/meetings/' + meetingID);
    }
  });
});
// --------------------------------------MEMBERS-----------------------------
app.get('/members', function (req, res) {
  User.find({
    role: 'member',
  })
    .sort({
      firstName: 'asc',
    })
    .exec(function (err, foundUsers) {
      if (err) console.log(err);
      else {
        res.render('staff/members', {
          members: foundUsers,
        });
      }
    });
});
//==================================================================
app.get('/members/:id', function (req, res) {
  var memberID = req.params.id;
  User.findById(memberID)
    .populate('events')
    .populate('wentEvents')
    .populate('programmingEvents')
    .populate('socialEvents')
    .populate('serviceEvents')
    .populate('appeals')
    .exec(function (err, foundUser) {
      if (err) console.log(err);
      else {
        res.render('staff/specificMember', {
          member: foundUser,
        });
      }
    });
});
// --------------------------------------APPEALS-----------------------------

app.get('/staff/appeals', function (req, res) {
  Appeal.find({})
    .sort({
      submissionDate: 'desc',
    })
    .exec(function (err, appeals) {
      if (err) console.log(err);
      else {
        appeals.sort(function (a, b) {
          return b.submissionDate - a.submissionDate;
        });
        res.render('staff/appeals', {
          appeals: appeals,
        });
      }
    });
});
//=====================================================================
app.get('/staff/appeal/:appealID', function (req, res) {
  var appealID = req.params.appealID;
  Appeal.findById(appealID, function (err, appeal) {
    res.render('staff/specificAppeal', {
      appeal: appeal,
    });
  });
});

// User.findOne({firstName:'Ana'},function(err,user){
//   if(err) console.log(err);
//   else{
//       user.meetingPoints = 4;
//       user.save();
//   }});

//===========================================================================
app.post('/appeals/:appealID/accepted', function (req, res) {
  var appealID = req.params.appealID;
  Appeal.findByIdAndUpdate(
    appealID,
    {
      comment: req.body.comment,
    },
    function () {
      Appeal.findByIdAndUpdate(
        appealID,
        {
          staffDecision: 'Accepted',
        },
        function (err, appeal) {
          if (err) console.log(err);
          else {
            // Sending out email to let them about decision

            var mytext =
              '<h1>EVENT APPEAL DECISION<h1> <p>This is to let you know that your appeal has been ACCEPTED for ' +
              'the following event:&nbsp;</p>' +
              '<p> Event Name:&nbsp;' +
              appeal.eventName +
              '</p>' +
              '<p> Event Date:&nbsp; ' +
              appeal.eventDate.toDateString() +
              '</p>' +
              '<p> Event Type:&nbsp; ' +
              appeal.eventType +
              '</p>' +
              '<p> Comment:&nbsp;' +
              appeal.comment +
              '</p>' +
              '<p> Thank You for submitting one! </p>';

            let mailOptions = {
              from: 'TAMU SLIDE<tamuslide@gmail.com>', // sender address
              to: appeal.requesterEmail, // list of receivers
              subject: 'Slide Appeal Decision ', // Subject line
              text: 'Hello to myself!',
              html: mytext, // html body
            };

            transporter.sendMail(mailOptions);
            currentAppeals -= 1;
            req.flash('success', 'Appeal approved!');
            req.flash(
              'check',
              appeal.requesterName +
                ' has been notified of decision via email and via his portal.'
            );
            res.redirect('/staff/appeals');
          }
        }
      );
    }
  );
});
//===========================================================================
app.post('/appeals/:appealID/denied', function (req, res) {
  var appealID = req.params.appealID;

  Appeal.findByIdAndUpdate(
    appealID,
    {
      comment: req.body.comment,
    },
    function () {
      Appeal.findByIdAndUpdate(
        appealID,
        {
          staffDecision: 'Denied',
        },
        function (err, appeal) {
          if (err) console.log(err);
          else {
            var mytext =
              '<h1>EVENT APPEAL DECISION<h1> <p>This is to let you know that your appeal has been DENIED for ' +
              'the following event:&nbsp;</p>' +
              '<p> Event Name:&nbsp;' +
              appeal.eventName +
              '</p>' +
              '<p> Event Date:&nbsp; ' +
              appeal.eventDate.toDateString() +
              '</p>' +
              '<p> Event Type:&nbsp; ' +
              appeal.eventType +
              '</p>' +
              '<p> Comment:&nbsp;' +
              appeal.comment +
              '</p>' +
              '<p> Thank You for submitting one! </p>';

            let mailOptions = {
              from: 'TAMU SLIDE<tamuslide@gmail.com>', // sender address
              to: appeal.requesterEmail, // list of receivers
              subject: 'Slide Appeal Decision ', // Subject line
              text: 'Hello to myself!',
              html: mytext, // html body
            };

            transporter.sendMail(mailOptions);
            currentAppeals -= 1;
            req.flash('failure', 'Appeal denied!');
            req.flash(
              'check',
              appeal.requesterName +
                ' has been notified of decision via email and via his portal.'
            );
            res.redirect('/staff/appeals');
          }
        }
      );
    }
  );
});

// --------------------------------------POINTS------------------------------
app.get('/staff/points/view', function (req, res) {
  User.find({
    role: 'member',
  })
    .sort({
      lastName: 'asc',
    })
    .exec(function (err, foundUsers) {
      if (err) console.log(err);
      else {
        Goal.findOne()
          .sort({
            created_at: -1,
          })
          .exec(function (err, foundGoal) {
            if (err) console.log(err);
            else {
              goals = [
                foundGoal.socialGoal,
                foundGoal.serviceGoal,
                foundGoal.programmingGoal,
                foundGoal.meetingGoal,
              ];
              res.render('staff/viewPoints', {
                staff: req.user,
                members: foundUsers,
                goals: goals,
              });
            }
          });
      }
    });
});
//==================================================================
app.get('/staff/submitted-points', function (req, res) {
  Event.find({
    wasSubmitted: true,
  })
    .sort({
      eventName: 'asc',
    })
    .exec(function (err, submittedEvents) {
      if (err) console.log(err);
      else {
        res.render('staff/submittedPoints', {
          submittedEvents: submittedEvents,
          staff: req.user,
        });
      }
    });
});

//==================================================================
app.get('/staff/submitted-points/:eventID', function (req, res) {
  var eventID = req.params.eventID;
  Event.findById(eventID, function (err, event) {
    if (err) console.log(err);
    else {
      res.render('staff/specificPoint', {
        event: event,
        staff: req.user,
      });
    }
  });
});
//==================================================================
app.post('/point/:userID/:eventID/:eventType/accept', function (req, res) {
  User.findById(req.params.userID, function (err, foundUser) {
    if (err) console.log(err);
    else {
      foundUser.wentEvents.push(req.params.eventID);

      if (req.params.eventType == 'Social')
        foundUser.socialEvents.push(req.params.eventID);
      if (req.params.eventType == 'Service')
        foundUser.serviceEvents.push(req.params.eventID);
      if (req.params.eventType == 'Programming')
        foundUser.programmingEvents.push(req.params.eventID);
      foundUser.save();

      Event.findByIdAndUpdate(
        req.params.eventID,
        {
          comment: req.body.comment,
        },
        function (err, foundEvent) {
          if (err) console.log(err);
          else {
            var mytext =
              '<h1>POINT SUBMISSION DECISION<h1> <p>This is to let you know that your point submission has been ACCEPTED for ' +
              'the following event:&nbsp;</p>' +
              '<p > Event Name:&nbsp;' +
              foundEvent.eventName +
              '</p>' +
              '<p> Event Date:&nbsp; ' +
              foundEvent.eventDate.toDateString() +
              '</p>' +
              '<p> Event Location:&nbsp; ' +
              foundEvent.Location +
              '</p>' +
              '<p> Event Type:&nbsp; ' +
              foundEvent.pointType +
              '</p>' +
              '<p> Comment:&nbsp;' +
              foundEvent.comment +
              '</p>' +
              '<p> Your points have been updated accordingly and thank you for your submission! </p>';

            let mailOptions = {
              from: 'TAMU SLIDE<tamuslide@gmail.com>', // sender address
              to: foundUser.email, // list of receivers
              subject: 'Slide Appeal Decision ', // Subject line
              text: 'Hello to myself!',
              html: mytext, // html body
            };

            transporter.sendMail(mailOptions);
            foundEvent.status = 'Approved';
            foundEvent.save();
            submittedPointsLength -= 1;
            req.flash('success', 'Point Awarded!');
            req.flash(
              'check',
              foundEvent.creatorName +
                ' has been notified of your decision via email and via his portal.'
            );
            res.redirect('/staff/submitted-points');
          }
        }
      );
    }
  });
});

//==================================================================
app.post('/point/:userID/:eventID/:eventType/deny', function (req, res) {
  User.findById(req.params.userID, function (err, foundUser) {
    if (err) console.log(err);
    else {
      Event.findByIdAndUpdate(
        req.params.eventID,
        {
          comment: req.body.comment,
        },
        function (err, foundEvent) {
          if (err) console.log(err);
          else {
            var mytext =
              '<h1>POINT SUBMISSION DECISION<h1> <p>This is to let you know that your point submission has been DENIED for ' +
              'the following event:&nbsp;</p>' +
              '<p> Event Name:&nbsp;' +
              foundEvent.eventName +
              '</p>' +
              '<p> Event Date:&nbsp; ' +
              foundEvent.eventDat.toDateString() +
              '</p>' +
              '<p> Event Location:&nbsp; ' +
              foundEvent.Location +
              '</p>' +
              '<p> Event Type:&nbsp; ' +
              foundEvent.pointType +
              '</p>' +
              '<p> Comment:&nbsp;' +
              foundEvent.comment +
              '</p>';

            let mailOptions = {
              from: 'TAMU SLIDE<tamuslide@gmail.com>', // sender address
              to: foundUser.email, // list of receivers
              subject: 'Slide Point Submission Decision ', // Subject line
              text: 'Hello to myself!',
              html: mytext, // html body
            };

            transporter.sendMail(mailOptions);
            foundEvent.status = 'Denied';
            foundEvent.save();
            submittedPointsLength -= 1;
            req.flash('failure', 'Point Denied!');
            req.flash(
              'check',
              foundEvent.creatorName +
                ' has been notified of your decision via email and via his portal.'
            );
            res.redirect('/staff/submitted-points');
          }
        }
      );
    }
  });
});
//==================================================================

//       Goal.create(goals,function(err, createGoal) {
//         if(err) console.log(err);
//     });

// Global Variable

app.post('/staff/points/change-goals', function (req, res) {
  // created_at:-1 finds the first one created
  Goal.findOne()
    .sort({
      created_at: -1,
    })
    .exec(function (err, foundGoal) {
      if (err) console.log(err);
      else {
        var goalID = foundGoal._id;

        Goal.findByIdAndUpdate(
          goalID,
          {
            socialGoal: req.body.socialGoal,
            serviceGoal: req.body.serviceGoal,
            programmingGoal: req.body.programmingGoal,
            meetingGoal: req.body.meetingGoal,
          },
          function (err, changedGoals) {
            if (err) console.log(err);
            else {
              goals = [
                changedGoals.socialGoal,
                changedGoals.serviceGoal,
                changedGoals.programmingGoal,
                changedGoals.meetingGoal,
              ];
              res.redirect('/staff/points/view');
            }
          }
        );
      }
    });
});
//------------------------------FORMS------------------------------------------
app.get('/staff/forms', function (req, res) {
  Form.find({}, function (err, allForms) {
    if (err) console.log(err);
    else {
      res.render('staff/forms', {
        currentAppeals: currentAppeals,
        forms: allForms,
      });
    }
  });
});
//=============================================================================
app.post('/staff/forms', function (req, res) {
  var form = {
    title: req.body.title,
    link: req.body.link,
  };

  Form.create(form, function (err, form) {
    if (err) console.log(err);
    else {
      req.flash('success', 'Form has been posted!');
      res.redirect('/staff/forms');
    }
  });
});
//=============================================================================
app.get('/staff/forms/:id/delete', function (req, res) {
  var formID = req.params.id;

  Form.findByIdAndRemove(formID, function () {
    req.flash('success', 'Form has been deleted!');
    res.redirect('/staff/forms');
  });
});

//------------------------------LUNCH-BUDDy-----------------------------------
app.get('/staff/lunch-buddy/:id/pair', function (req, res) {
  User.find({}, function (err, users) {
    // Randomizing main list
    users.sort(function () {
      return 0.5 - Math.random();
    });

    // Making two separate lists then pairing people using their corresponding indexes. (list1[0] with list2[0]) and so on
    var list1 = [];
    var list2 = [];
    var pairs = [];

    // 'condition' variable used to alternate
    var condition = 1;

    for (var i = 0; i < users.length; ++i) {
      if (condition == 1) {
        list1.push(users[i]);
        condition = 2;
      } else {
        list2.push(users[i]);
        condition = 1;
      }
    }

    // Pairing process
    var index = 0;

    if (list1.length < list2.length) index = list1.length - 1;
    else {
      index = list2.length - 1;
    }

    while (index >= 0) {
      if (list1[index].role != 'staff' && list2[index].role != 'staff') {
        pairs.push([list1[index], list2[index]]);
        list1.pop();
        list2.pop();
        index -= 1;
      } else {
        while (list1[index].role == 'staff' && list2[index].role == 'staff') {
          list1.sort(function () {
            return 0.5 - Math.random();
          });
          list2.sort(function () {
            return 0.5 - Math.random();
          });
        }

        pairs.push([list1[index], list2[index]]);
        list1.pop();
        list2.pop();
        index -= 1;
      }
    }

    // Removing old Lunchbuddies and Adding IDs of events in lunch Buddy Array for each Member
    pairs.forEach(function (pair) {
      pair[0].currentLunchBuddy = pair[1];
      pair[1].currentLunchBuddy = pair[0];

      pair[0].save();
      pair[1].save();
    });

    // Adding pairs to LunchBuddy using req.params.id
    LunchBuddy.findById(req.params.id).exec(function (err, foundLunchBuddy) {
      if (err) console.log(err);
      else {
        for (var i = 0; i < pairs.length; ++i) {
          foundLunchBuddy.groupA.push(pairs[i][0]._id);
          foundLunchBuddy.groupB.push(pairs[i][1]._id);
        }
        foundLunchBuddy.save();
      }
      // Array used to store meetings created for each pair
      var meetingArrays = [];

      for (var i = 0; i < pairs.length; ++i) {
        // Creating events for each pair

        var description =
          'Howdy ' +
          pairs[i][0].firstName +
          '! Howdy ' +
          pairs[i][1].firstName +
          '! You guys are Lunch Buddies for ' +
          foundLunchBuddy.title +
          '! So get excited! Whooooop! Make sure to contact each other in order to set up a time and place so that you guys can meet. We have provided the contact informations. We want really want sophomores to get closer this year. So enjoy your meal!';
        var date = new Date();
        date.setDate(date.getDate() + 7); // Set to be a week from now.

        var event = {
          eventName:
            'Lunch Buddy ' +
            foundLunchBuddy.title +
            ': ' +
            pairs[i][0].firstName +
            ' & ' +
            pairs[i][1].firstName,
          lunchBuddy: true,
          eventDate: date,
          Description: description,
          pointType: 'Social',
          Location: 'TBD',
          lunchBuddyIds: [pairs[i][0]._id, pairs[i][1]._id],
        };

        meetingArrays.push(event);
      }
      // insert functions allows to create many collections at once
      Event.collection.insert(
        meetingArrays,
        {
          ordered: false,
        },
        function (err, meetings) {
          req.flash(
            'success',
            'Members have successfully been paired for ' + foundLunchBuddy.title
          );
          req.flash(
            'check',
            ' They will have seven days to meet then they will be able to earn points.'
          );
        }
      );

      res.redirect('/staff/lunch-buddy/' + req.params.id);
    });
  });
});

//============================================================================
app.get('/staff/lunch-buddy/:id', function (req, res) {
  LunchBuddy.findById(req.params.id)
    .populate('groupA')
    .populate('groupB')
    .exec(function (err, lunchBuddy) {
      if (err) console.log(err);
      else {
        var formattedLunchBuddy = [];

        for (var i = 0; i < lunchBuddy.groupA.length; ++i) {
          formattedLunchBuddy.push([
            lunchBuddy.groupA[i],
            lunchBuddy.groupB[i],
          ]);
        }
        res.render('staff/specificLunchBuddy', {
          lunchBuddy: lunchBuddy,
          formattedLunchBuddy: formattedLunchBuddy,
        });
      }
    });
});

//============================================================================
app.get('/staff/lunch-buddy', function (req, res) {
  LunchBuddy.find({}, function (err, lunchBuddies) {
    if (err) console.log(err);
    else {
      res.render('staff/lunchBuddy', {
        lunchBuddies: lunchBuddies,
      });
    }
  });
});
//============================================================================
app.post('/staff/lunch-buddy', function (req, res) {
  var lunchBuddy = {
    title: req.body.title,
  };

  LunchBuddy.create(lunchBuddy, function (err, createdLunchBuddy) {
    if (err) console.log(err);
    else {
      req.flash(
        'success',
        createdLunchBuddy.title + ' has been successfully created.'
      );
      req.flash('check', 'Click on View in order to pair people');
      res.redirect('/staff/lunch-buddy');
    }
  });
});

//============================================================================
app.get('/staff/lunch-buddy/:id/delete', function (req, res) {
  LunchBuddy.findByIdAndRemove(req.params.id, function (err, lunchBuddy) {
    req.flash('success', 'LunchBuddy has been successfully deleted.');
    res.redirect('/staff/lunch-buddy');
  });
});

//------------------------------SETTINGS----------------------------------------
app.get('/staff/settings', function (req, res) {
  User.find({}, function (err, users) {
    if (err) console.log(err);
    else {
      Application.findOne()
        .sort({
          created_at: -1,
        })
        .exec(function (err, foundApp) {
          if (err) console.log(err);
          else {
            res.render('staff/settings', {
              applications: foundApp,
              users: users,
            });
          }
        });
    }
  });
});

//------------------------------DELETE MEMBER'S ACCOUNT----------------------------------------
app.post('/staff/settings/delete/member-account', function (req, res) {
  var memberID = req.body.memberID;

  User.findByIdAndRemove(memberID, function (err, user) {
    if (err) console.log(err);
    else {
      Course.find({}, function (err, allCourses) {
        if (err) console.log(err);
        else {
          allCourses.forEach(function (course) {
            for (var i = 0; i < course.users.length; ++i) {
              if (course.users[i] == user.firstName + ' ' + user.lastName)
                course.users.splice(i, 1);
            }
          });
          req.flash('success', 'Account has successfully been deleted!');
          req.flash(
            'check',
            user.firstName +
              " won't be able to access his or her account anymore."
          );
          res.redirect('/staff/settings');
        }
      });
    }
  });
});
//------------------------------BIOGRAPHY----------------------------------------
app.post('/staff/settings/biography', function (req, res) {
  var biography = req.body.biography;
  var userID = req.user._id;

  User.findByIdAndUpdate(
    userID,
    {
      biography: biography,
    },
    function (err, user) {
      if (err) console.log(err);
      else {
        req.flash('success', 'Your biography has successfully been updated!');
        req.flash('check', "You can view it on the webiste's staff page.");
        res.redirect('/staff/settings');
      }
    }
  );
});
//------------------------------PRESIDENT MESSAGE-----------------------------------
app.post('/staff/settings/president-message', function (req, res) {
  var presidentMessage = req.body.presidentMessage;
  var userID = req.user._id;

  User.findByIdAndUpdate(
    userID,
    {
      presidentMessage: presidentMessage,
    },
    function (err, user) {
      if (err) console.log(err);
      else {
        req.flash(
          'success',
          'Your President Message has successfully been updated!'
        );
        req.flash('check', "You can view it on the webiste's home page.");
        res.redirect('/staff/settings');
      }
    }
  );
});
//------------------------------VP MESSAGE-----------------------------------
app.post('/staff/settings/vp-message', function (req, res) {
  var vpMessage = req.body.vpMessage;
  var userID = req.user._id;

  User.findByIdAndUpdate(
    userID,
    {
      vpMessage: vpMessage,
    },
    function (err, user) {
      if (err) console.log(err);
      else {
        req.flash('success', 'Your VP Message has successfully been updated!');
        req.flash('check', "You can view it on the website's home page.");
        res.redirect('/staff/settings');
      }
    }
  );
});
//------------------------------EXECUTIVE MESSAGE-----------------------------------
app.post('/staff/settings/executive-message', function (req, res) {
  var executiveMessage = req.body.executiveMessage;
  var userID = req.user._id;

  User.findByIdAndUpdate(
    userID,
    {
      executiveMessage: executiveMessage,
    },
    function (err, user) {
      if (err) console.log(err);
      else {
        req.flash(
          'success',
          'Your Executive Message has successfully been updated!'
        );
        req.flash('check', "You can view it on your subcommittee's page.");
        res.redirect('/staff/settings');
      }
    }
  );
});

//------------------------------RELEASE APPLICATION -----------------------------------

app.post('/staff/settings/release-app', function (req, res) {
  var appType = req.body.appType;

  Application.findOne()
    .sort({
      created_at: -1,
    })
    .exec(function (err, foundApp) {
      if (err) console.log(err);
      else {
        if (appType == 'Member') {
          if (foundApp.memberApp == false) {
            foundApp.memberApp = true;
            foundApp.save();
          }
        }

        if (appType == 'Big') {
          if (foundApp.bigApp == false) {
            foundApp.bigApp = true;
            foundApp.save();
          }
        }
        if (appType == 'President') {
          if (foundApp.presidentApp == false) {
            foundApp.presidentApp = true;
            foundApp.save();
          }
        }
        if (appType == 'VP') {
          if (foundApp.vpApp == false) {
            foundApp.vpApp = true;
            foundApp.save();
          }
        }
        if (appType == 'Executive') {
          if (foundApp.excecApp == false) {
            foundApp.execApp = true;
            foundApp.save();
          }
        }
        if (appType == 'Director') {
          if (foundApp.directorApp == false) {
            foundApp.directorApp = true;
            foundApp.save();
          }
        }
        req.flash(
          'success',
          appType + ' application has successfully been released.'
        );
        req.flash(
          'check',
          'Check admissions page to make sure it has been updated accordingly.'
        );
        res.redirect('/staff/settings');
      }
    });
});

//------------------------------REMOVE APPLICATION -----------------------------------

app.post('/staff/settings/remove-app', function (req, res) {
  var appType = req.body.appType;

  Application.findOne()
    .sort({
      created_at: -1,
    })
    .exec(function (err, foundApp) {
      if (err) console.log(err);
      else {
        if (appType == 'Member') {
          if (foundApp.memberApp == true) {
            foundApp.memberApp = false;
            foundApp.save();
          }
        }
        if (appType == 'Big') {
          if (foundApp.bigApp == true) {
            foundApp.bigApp = false;
            foundApp.save();
          }
        }
        if (appType == 'President') {
          if (foundApp.presidentApp == true) {
            foundApp.presidentApp = false;
            foundApp.save();
          }
        }
        if (appType == 'VP') {
          if (foundApp.vpApp == true) {
            foundApp.vpApp = false;
            foundApp.save();
          }
        }
        if (appType == 'Executive') {
          if (foundApp.excecApp == true) {
            foundApp.execApp = false;
            foundApp.save();
          }
        }
        if (appType == 'Director') {
          if (foundApp.directorApp == true) {
            foundApp.directorApp = false;
            foundApp.save();
          }
        }
        req.flash(
          'success',
          appType + ' application has successfully been removed.'
        );
        req.flash(
          'check',
          'Check admissions page to make sure it has been updated accordingly.'
        );
        res.redirect('/staff/settings');
      }
    });
});
//------------------------------CHANGE APPLICATION -----------------------------------

app.post('/staff/settings/change-app', function (req, res) {
  var appType = req.body.appType;
  var link = req.body.link;

  Application.findOne()
    .sort({
      created_at: -1,
    })
    .exec(function (err, foundApp) {
      if (err) console.log(err);
      else {
        if (appType == 'Member') {
          foundApp.memberAppFile = link;
          foundApp.save();
        }

        if (appType == 'Big') {
          foundApp.bigAppFile = link;
          foundApp.save();
        }
        if (appType == 'President') {
          foundApp.presidentAppFile = link;
          foundApp.save();
        }
        if (appType == 'VP') {
          foundApp.vpAppFile = link;
          foundApp.save();
        }
        if (appType == 'Executive') {
          foundApp.execrAppFile = link;
          foundApp.save();
        }
        if (appType == 'Director') {
          foundApp.directorAppFile = link;
          foundApp.save();
        }
      }
      req.flash(
        'success',
        appType + ' application has successfully been changed.'
      );
      req.flash(
        'check',
        'Check admissions page to make sure it has been updated accordingly.'
      );
      res.redirect('/staff/settings');
    });
});

//------------------------------FAQS/GUIDELINES-----------------------------------

app.get('/staff/guidelines', function (req, res) {
  Guideline.find({}, function (err, guidelines) {
    res.render('staff/guidelines', {
      guidelines: guidelines,
    });
  });
});
//========================================================s
app.post('/staff/guidelines', function (req, res) {
  var title = req.body.title;
  var text = req.body.text;
  var category = req.body.category;

  var guideline = {
    title: title,
    text: text,
    category: category,
  };

  Guideline.create(guideline, function (err, newGuideline) {
    if (err) console.log(err);
    else {
      req.flash(
        'success',
        category + ' Guideline has successfully been created.'
      );
      req.flash(
        'check',
        'Sophomores will be able to view it on their portals.'
      );
      res.redirect('/staff/guidelines');
    }
  });
});

//------------------------------PROFILE-PICS-----------------------------------
app.post('/staff/change-profile-pictures', function (req, res) {
  var links = req.body.links;

  links = links.split(/\r\n|\n/).map(i => i.trim());

  var formattedLinks = new Array();

  var i = 0;
  for (i; i < links.length; ++i) {
    var oneLink = links[i];
    formattedLinks.push(oneLink);
  }

  User.find({}, function (err, users) {
    if (err);
    else {
      users.forEach(function (user) {
        formattedLinks.forEach(function (link) {
          if (
            link
              .toUpperCase()
              .includes(user.firstName.replace(/ /g, '').toUpperCase()) &&
            link
              .toUpperCase()
              .includes(user.lastName.replace(/ /g, '').toUpperCase())
          ) {
            user.profilePicture = link;
            user.save();
          }
        });
      });
    }
    req.flash('success', 'Pictures have successfully been updated and saved');
    res.redirect('/staff/settings');
  });
});
//==========================================================================================
app.post('/staff/change-my-profile', function (req, res) {
  var link = req.body.link;

  link = link.split(/\r\n|\n/).map(i => i.trim());

  console.log(link[0]);

  User.findById(req.user._id, function (err, user) {
    if (err);
    else {
      if (
        link[0]
          .toUpperCase()
          .includes(user.firstName.replace(/ /g, '').toUpperCase()) &&
        link[0]
          .toUpperCase()
          .includes(user.lastName.replace(/ /g, '').toUpperCase())
      ) {
        user.profilePicture = link[0];
        user.save();
      }
    }
  });

  req.flash('success', 'Your Picture has successfully been updated and saved');
  res.redirect('/staff/settings');
});

// =============================== LISTENING PORT===============================

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('SERVER IS RUNNING on port ' + port);
});

module.exports = app;
