describe('directive: pikaday', function() {

  beforeEach(module('pikaday'));

  // INLINE

  describe('inline', function() {

    var element, scope, rootScope, timeout;

    beforeEach(inject(function($rootScope, $compile, $timeout) {

      /*jshint multistr: true */

      rootScope = $rootScope;
      timeout = $timeout;

      scope    = $rootScope.$new();
      scope.myPickerValue = "2.6.1998";
      scope.myPickerObject = {};

      element  = angular.element('<div id="trigger"> \
                  <div id="container"> \
                  <input pikaday="myPickerValue" \
                  set-default-date="true" \
                  bound="false" \
                  reposition="true" \
                  disable-weekends="true" \
                  show-week-number="true" \
                  is-r-t-l="true" \
                  show-month-after-year="true" \
                  first-day="1" \
                  year-range="[1997, 2003]" \
                  number-of-months="3" \
                  main-calendar="2" \
                  format="YYYY-MM-DD" \
                  position="top right" \
                  theme="custom-theme"\
                  year-suffix="suff" \
                  min-date="1998-06-01" \
                  max-date="2007-08-01" \
                  default-date="1998-09-01" \
                  trigger="trigger" \
                  container="container" \
                  on-select="sample.onPikadaySelect(pikaday)" \
                  on-open="sample.onPikadayOpen(pikaday)" \
                  on-close="sample.onPikadayClose(pikaday)" \
                  on-draw="sample.onPikadayDraw(pikaday)" \
                  disable-day-fn="sample.onPikadayDisableDayFunction(pikaday)" \
                  picker-object="myPickerObject" \
                  model-format="D.M.YYYY">');

      compiled = $compile(element)(scope);
      scope.$digest();

    }));

    describe('attribute coercion', function() {

      it("should set-default-date", function() {
        assert.deepEqual(scope.myPickerObject._o.setDefaultDate, true);
      });

      it("should apply bound", function() {
        assert.deepEqual(scope.myPickerObject._o.bound, false);
      });

      it("should apply reposition ", function() {
        assert.deepEqual(scope.myPickerObject._o.reposition, true);
      });

      it("should apply disable-weekends ", function() {
        assert.deepEqual(scope.myPickerObject._o.disableWeekends, true);
      });

      it("should apply show-week-number ", function() {
        assert.deepEqual(scope.myPickerObject._o.showWeekNumber, true);
      });

      it("should apply is-r-t-l", function() {
        assert.deepEqual(scope.myPickerObject._o.isRTL, true);
      });

      it("show-month-after-year", function() {
        assert.deepEqual(scope.myPickerObject._o.showMonthAfterYear, true);
      });

      it("should apply first-day", function() {
        assert.deepEqual(scope.myPickerObject._o.firstDay, 1);
      });

      it("should apply year-range as array", function() {
        assert.deepEqual(scope.myPickerObject._o.yearRange, [1997, 2003]);
      });

      it("should apply number-of-months ", function() {
        assert.deepEqual(scope.myPickerObject._o.numberOfMonths, 3);
      });

      it("should apply main-calendar", function() {
        assert.deepEqual(scope.myPickerObject._o.mainCalendar, 2);
      });

      it("should apply format", function() {
        assert.deepEqual(scope.myPickerObject._o.format, "YYYY-MM-DD");
      });

      it("should apply position ", function() {
        assert.deepEqual(scope.myPickerObject._o.position, "top right");
      });

      it("should apply theme ", function() {
        assert.deepEqual(scope.myPickerObject._o.theme, "custom-theme");
      });

      it("should apply year-suffix ", function() {
        assert.deepEqual(scope.myPickerObject._o.yearSuffix, "suff");
      });

      it("should apply min-date ", function() {
        assert.deepEqual(scope.myPickerObject._o.minDate.getTime(), moment('1998-06-01').valueOf());
      });

      it("should apply max-date ", function() {
        assert.deepEqual(scope.myPickerObject._o.maxDate.getTime(), moment('2007-08-01').valueOf());
      });

      it("should apply default-date ", function() {
        assert.deepEqual(scope.myPickerObject._o.defaultDate.getTime(), (new Date('1998-09-01')).getTime());
      });

      // it("should provide the trigger element", function() {
      //  to-do
      // });

      // it("should provide the container element", function() {
      //  to-do
      // });

      it("should bind with on-select", function() {
        assert.deepEqual(typeof scope.myPickerObject._o.onSelect, "function");
      });

      it("should bind with on-open", function() {
        assert.deepEqual(typeof scope.myPickerObject._o.onOpen, "function");
      });

      it("should bind with on-close", function() {
        assert.deepEqual(typeof scope.myPickerObject._o.onClose, "function");
      });

      it("should bind with on-draw", function() {
        assert.deepEqual(typeof scope.myPickerObject._o.onDraw, "function");
      });

      it("should bind with disable-day-fn", function() {
        assert.deepEqual(typeof scope.myPickerObject._o.disableDayFn, "function");
      });

      it("should respect model", function() {
        assert(scope.myPickerObject.getMoment().isSame(moment('1998-06-02')));
      });

      it("should respect model format", function(done) {
          // Has to be before the timeout below because pikaday-angular's onSelect
          // has a timeout in itself, which would be otherwise queued after the one below.
          scope.myPickerObject.setMoment(moment('2000-04-03'));

          setTimeout(function() {
            assert.equal(scope.myPickerValue, '3.4.2000');
            done();
          });

          scope.$digest();
      });

      it("should update on model update", function(done) {
          scope.myPickerValue = '7.5.2001';

          setTimeout(function() {
            assert.equal(scope.myPickerObject.getMoment().format('YYYY-MM-DD'), '2001-05-07');
            done();
          });

          scope.$digest();
      });
    });

  });
});
