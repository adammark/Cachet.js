# Cachet.js — Local Storage Made Betterer

Cachet.js provides a simple yet robust interface to [Web Storage][1].

## Usage

Include `<script src="cachet.min.js"></script>`.

## Method summary

* Cachet.isSupported()
* Cachet.setItem(key, val [, expires])
* Cachet.setItems(items [, expires])
* Cachet.getItem(key)
* Cachet.getItems(keys)
* Cachet.removeItem(key)
* Cachet.removeItems(keys)
* Cachet.plus(key [, n])
* Cachet.minus(key [, n])
* Cachet.purge()

## Setting items

Cachet.js can store any kind of JSON-serializable value. The method `setItem`
accepts a key and a value. It returns true if the item was saved or false if
the item could not be saved due to a storage limitation:

``` javascript
var user = {
    "name": "Adam Mark"
    "visits": 123
};

if (Cachet.setItem("user", user)) {
    // yay!
}
else {
    // boo!
}
```

Items can be set to expire at a specific time, after a certain number of
minutes, or at the end of a session:

``` javascript
// expire at 12:00 AM on January 1
Cachet.setItem("articles", articles, new Date(2014, 0, 1));

// expire in 60 minutes
Cachet.setItem("articles", articles, 60);

// expire at the end of the browser session
Cachet.setItem("articles", articles, "session");
```

You can save multiple items at once. The method `setItems` accepts an object
with keys and values:

``` javascript
var items = {
    "userId": "12345"
    "userName" : "adam.bomb"
};

if (Cachet.setItems(items)) {
    // all items were saved
}
```

As with `setItem`, you can apply an expiration policy:

``` javascript
// expire all items in 24 hours
Cachet.setItems(items, 24 * 60);
```

## Getting items

The method `getItem` returns a value for the given key:

``` javascript
var user = Cachet.getItem("user");
```

Unlike Local Storage, `getItem` returns undefined if no item was found in the
cache (allowing you to save items with null values), **or if the item is
expired**:

``` javascript
var color = Cachet.getItem("color");

if (color === undefined) {
    // item was never set, or it expired
}
```

You can also get multiple items at once. The method `getItems` accepts an
array of keys and returns an object:

``` javascript
var items = Cachet.getItems(["fruits", "vegetables"]);

if (item.fruits.indexOf("apple") > -1) {
    // chomp
}
```

## Removing Items

You can remove items from the cache individually or in batches. To remove a
single item:

``` javascript
if (Cachet.removeItem("user")) {
    // item was removed
}
```

To remove multiple items, pass an array of keys:

``` javascript
if (Cachet.removeItems(["fruits", "vegetables"])) {
    // all items were removed
}
```

Expired items remain in the cache until you purge them. To purge expired
items from the cache:

``` javascript
Cachet.purge();
```

## Global counters

You can maintain global counters across sessions with the methods `plus` and
`minus`:

``` javascript
visits = Cachet.plus("visits"); // 1
visits = Cachet.plus("visits"); // 2
visits = Cachet.plus("visits", 10); // 12

visits = Cachet.minus("visits"); // 11
visits = Cachet.minus("visits", 10); // 1
```

*It is not necessary to call setItem() before calling plus() or minus().*

## Testing for support

Cachet.js depends on [Web Storage][1]. To test for support:

``` javascript
if (Cachet.isSupported()) {
    // yeehaw
}
```

## License

Copyright (C) 2013 by Adam Mark

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[1]: http://dev.opera.com/articles/view/web-storage/