// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by galaxy-autoscale.js.
import { name as packageName } from "meteor/avariodev:galaxy-autoscale";

Tinytest.add('galaxy-autoscale - example', function (test) {
  test.equal(packageName, "galaxy-autoscale");
});
