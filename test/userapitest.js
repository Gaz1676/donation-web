// We need a comparison that will test to see if the returnedUser
// Is a superset of the newUser object.
// It is here where we install lodash library
// Require is at the top of our test (const _ = require('lodash');)

'use strict';

const assert = require('chai').assert;
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('User API tests', function () {

    let users = fixtures.users;
    let newUser = fixtures.newUser;

    const donationService = new DonationService(fixtures.donationService);

    // These are run before and after each test
    // Clearing our users model so that each test
    // can be considered completely independently.

    beforeEach(function () {
        donationService.login(users[0]);

        //donationService.deleteAllUsers();
      });

    afterEach(function () {
        donationService.logout();

        //donationService.deleteAllUsers();
      });

    //=================Create User
    test('create a user', function () {
        const returnedUser = donationService.createUser(newUser);
        assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of newUser');
        assert.isDefined(returnedUser._id);
      });

    //=================Get User
    test('get user', function () {
        const u1 = donationService.createUser(newUser);
        const u2 = donationService.getUser(u1._id);
        assert.deepEqual(u1, u2);
      });

    //=================Get Invalid User
    test('get invalid user', function () {
        const u1 = donationService.getUser('1234');
        assert.isNull(u1);
        const u2 = donationService.getUser('012345678901234567890123');
        assert.isNull(u2);
      });

    //=================Delete User
    test('delete a user', function () {
        const u = donationService.createUser(newUser);
        assert(donationService.getUser(u._id) != null);
        donationService.deleteOneUser(u._id);
        assert(donationService.getUser(u._id) == null);
      });

    //=================Get All Users
    /* test('get all users', function () {
       for (let u of users) {
         donationService.createUser(u);
       }

       const allUsers = donationService.getUsers();
       assert.equal(allUsers.length, users.length);
     });*/

    //=================Get Users Details
    test('get users detail', function () {
        for (let u of users) {
          donationService.createUser(u);
        }

        const allUsers = donationService.getUsers();
        for (let i = 0; i < users.length; i++) {
          assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
        }
      });

    //=================Get All Users Empty
    /* test('get all users empty', function () {
       const allUsers = donationService.getUsers();
       assert.equal(allUsers.length, 0);
     });*/
  });

