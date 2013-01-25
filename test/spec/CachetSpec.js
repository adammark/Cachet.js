describe("Cachet core spec", function () {

    beforeEach(function () {
    });

    afterEach(function () {
        localStorage.removeItem("test_item_1");
        localStorage.removeItem("test_item_2");
        localStorage.removeItem("test_item_3");
        localStorage.removeItem("cachet_expiry");

        sessionStorage.removeItem("test_item_1");
    });

    it("sets a single item", function () {
        var saved = Cachet.setItem("test_item_1", { "a": 123, "b": 456 });

        expect(saved).toEqual(true);

        var item = Cachet.getItem("test_item_1");
        expect(item.a).toEqual(123);
    });

    it("sets and gets multiple items", function () {
        var saved = Cachet.setItems({
            "test_item_1": 111,
            "test_item_2": 222,
            "test_item_3": 333,
        });

        expect(saved).toEqual(true);

        var item = Cachet.getItem("test_item_1");
        expect(item).toEqual(111);

        var items = Cachet.getItems(["test_item_1", "test_item_2", "test_item_3"]);
        expect(items.test_item_1).toEqual(111);
        expect(items.test_item_2).toEqual(222);
        expect(items.test_item_3).toEqual(333);
    });

    it("removes an item", function () {
        var saved = Cachet.setItem("test_item_1", "har har");

        expect(saved).toEqual(true);

        var removed = Cachet.removeItem("test_item_1");

        expect(removed).toEqual(true);
    });

    it("fails to remove an unknown item", function () {
        var removed = Cachet.removeItem("whatever");

        expect(removed).toEqual(false);
    });

    it("increments a counter", function () {
        expect(Cachet.plus("test_item_1")).toEqual(1);
        expect(Cachet.plus("test_item_1")).toEqual(2);
        expect(Cachet.plus("test_item_1")).toEqual(3);

        expect(Cachet.plus("test_item_1", 10)).toEqual(13);
    });

    it("decrements a counter", function () {
        expect(Cachet.minus("test_item_1")).toEqual(-1);
        expect(Cachet.minus("test_item_1")).toEqual(-2);
        expect(Cachet.minus("test_item_1")).toEqual(-3);

        expect(Cachet.minus("test_item_1", 10)).toEqual(-13);
    });

    it("expires an item after n minutes", function () {
        var expires = 1/120; // half second
        var saved = Cachet.setItem("test_item_1", "ya ya", expires);
        expect(saved).toEqual(true);
        expect(Cachet.getItem("test_item_1")).toEqual("ya ya");

        waitsFor(function () {
            return Cachet.getItem("test_item_1") === undefined;
        }, "cache expiration", 750);
    });

    it("expires an item at a given time", function () {
        var expires = new Date(Date.now() + 500); // half second from now
        var saved = Cachet.setItem("test_item_1", "ya ya", expires);
        expect(saved).toEqual(true);
        expect(Cachet.getItem("test_item_1")).toEqual("ya ya");

        waitsFor(function () {
            return Cachet.getItem("test_item_1") === undefined;
        }, "cache expiration", 750);
    });

    // it("expires an item at the end of a session", function () {
    // });

    it("sets an item with a null value", function () {
        var saved = Cachet.setItem("test_item_3", null);

        expect(saved).toEqual(true);

        var item = Cachet.getItem("test_item_3");
        expect(item).toBeNull();
    });

    it("purges expired items from the cache", function () {
        var saved = Cachet.setItem("test_item_1", "blah", -1);

        expect(saved).toEqual(true);

        Cachet.purge();

        expect(localStorage.cachet_expiry.test_item_1).toEqual(undefined);
        expect(localStorage.test_item_1).toEqual(undefined);
    });

});
