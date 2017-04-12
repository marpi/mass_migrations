// @source: http://www.dwheeler.com/totro.html

// @licstart  The following is the entire license notice for the Javascript code in this page.
// The Javascript code in this page is free software: you can
// redistribute it and/or modify it under the terms of the GNU
// General Public License (GNU GPL) as published by the Free Software
// Foundation, either version 3 of the License, or (at your option)
// any later version.  The code is distributed WITHOUT ANY WARRANTY;
// without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

// As additional permission under GNU GPL version 3 section 7, you
// may distribute non-source (e.g., minimized or compacted) forms of
// that code without the copy of the GNU GPL normally required by
// section 4, provided you include this license notice and a URL
// through which recipients can access the Corresponding Source.
// @licend  The above is the entire license notice for the Javascript code in this page.


// List of possible vowels, followed by list of possible consonants.
// In both lists, duplicates increase the likelihood of that selection.
// The second parameter indicates if the syllable can occur
// at the beginning, middle, or ending of a name, and is the sum of
// the following:
//  1=can be at ending,
//  2=can be at beginning
//  4=can be in middle
// Thus, the value 7 means "can be anywhere", 6 means "beginning or middle".
// 5 means "only middle or end", and 4 means "only in the middle".
// This is a binary encoding, as (middle) (beginning) (end).
// Occasionally, 'Y' will be duplicated as a vowel and a consonant.
// That's so rare that we won't worry about it, in fact it's interesting.
// There MUST be a possible vowel and possible consonant for any
// possible position; if you want to have "no vowel at the end", use
// ('',1) and make sure no other vowel includes "can be at end".

// Be careful when editing this - if you forget a comma, you'll get
// mysterious errors and "undefine" results in names, since Javascript
// doesn't have good error-catching facilities.
// You MUST NOT end the last item in the list with a comma - it's not okay in
// Javascipt (which is unfortunate, because that would make the problem
// slightly less likely).

var vowels = new Array(
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["a", 7], ["e", 7], ["i", 7], ["o", 7], ["u", 7],
 ["ae", 7], ["ai", 7], ["ao", 7], ["au", 7], ["aa", 7],
 ["ea", 7], ["eo", 7], ["eu", 7], ["ee", 7],
 ["ia", 7], ["io", 7], ["iu", 7], ["ii", 7],
 ["oa", 7], ["oe", 7], ["oi", 7], ["ou", 7], ["oo", 7],
 ["eau", 7],
 ["y", 7]
)

// List of possible consonants.

var consonants = new Array(
["b", 7],  ["c", 7],  ["d", 7],  ["f", 7],  ["g", 7],  ["h", 7], 
["j", 7],  ["k", 7],  ["l", 7],  ["m", 7],  ["n", 7],  ["p", 7], 
["qu", 6],  ["r", 7], ["s", 7],  ["t", 7],  ["v", 7],  ["w", 7],
["x", 7],  ["y", 7],  ["z", 7], 
// Blends, sorted by second character:
["sc", 7],
["ch", 7],  ["gh", 7],  ["ph", 7], ["sh", 7],  ["th", 7], ["wh", 6],
["ck", 5],  ["nk", 5],  ["rk", 5], ["sk", 7],  ["wk", 0],
["cl", 6],  ["fl", 6],  ["gl", 6], ["kl", 6],  ["ll", 6], ["pl", 6], ["sl", 6],
["br", 6],  ["cr", 6],  ["dr", 6],  ["fr", 6],  ["gr", 6],  ["kr", 6], 
["pr", 6],  ["sr", 6],  ["tr", 6],
["ss", 5],
["st", 7],  ["str", 6],
// Repeat some entries to make them more common.
["b", 7],  ["c", 7],  ["d", 7],  ["f", 7],  ["g", 7],  ["h", 7], 
["j", 7],  ["k", 7],  ["l", 7],  ["m", 7],  ["n", 7],  ["p", 7], 
["r", 7], ["s", 7],  ["t", 7],  ["v", 7],  ["w", 7],
["b", 7],  ["c", 7],  ["d", 7],  ["f", 7],  ["g", 7],  ["h", 7], 
["j", 7],  ["k", 7],  ["l", 7],  ["m", 7],  ["n", 7],  ["p", 7], 
["r", 7], ["s", 7],  ["t", 7],  ["v", 7],  ["w", 7],
["br", 6],  ["dr", 6],  ["fr", 6],  ["gr", 6],  ["kr", 6]
)


// Return a random value between minvalue and maxvalue, inclusive,
// with equal probability.

function rolldie(minvalue, maxvalue) {
var result;
while (1) {
 result = Math.floor(Math.random() * (maxvalue-minvalue+1)+minvalue);
 if ((result >= minvalue) && (result <= maxvalue)) { return result;}
}
}

// Create a random name.  It must have at least between minsyl and maxsyl
// number of syllables (inclusive).

function RandomName(minsyl, maxsyl) {
var data = "";
var genname = "";         // this accumulates the generated name.
var leng = rolldie(minsyl, maxsyl); // Compute number of syllables in the name
var isvowel = rolldie(0, 1); // randomly start with vowel or consonant
for (var i = 1; i <= leng; i++) { // syllable #. Start is 1 (not 0)
 do {
   if (isvowel) {
     data = vowels[rolldie(0, vowels.length - 1)];
   } else {
     data = consonants[rolldie(0, consonants.length - 1)];
   }
   if ( i == 1) { // first syllable.
     if (data[1] & 2) {break;}
   } else if (i == leng) { // last syllable.
     if (data[1] & 1) {break;}
   } else { // middle syllable.
     if (data[1] & 4) {break;}
   }
 } while (1)
 genname += data[0];
 isvowel = 1 - isvowel; // Alternate between vowels and consonants.
}
// Initial caps:
genname = (genname.slice(0,1)).toUpperCase() + genname.slice(1);
return genname;
}

// Fill up form textarea with a number of random names.

function FillRandomName(nameform) {
var finalvalue = "";
var minsyl = parseInt(nameform.minsyl.value, 10);
var maxsyl = parseInt(nameform.maxsyl.value, 10);
nameform.names.value="";
// Error check:
if (typeof(minsyl) != "number") {
 window.alert("Error, Minsyl invalid type.");
 return;
} else if (typeof(maxsyl) != "number") {
 window.alert("Error, Maxsyl invalid type.");
 return;
} else if (minsyl < 1) {
 window.alert("Error, Minsyl < 1.");
 return;
} else if (maxsyl < 1) {
 window.alert("Error, Maxsyl < 1.");
 return;
} else if (maxsyl < minsyl) {
 window.alert("Error, Requested maximum is smaller than minimum. Please change either the minimum or maximum to correct this.");
 return;
}

for (var i = 0; i < 20; i++) {
 finalvalue += RandomName(minsyl,maxsyl);
 finalvalue += "\n";
}
nameform.names.value = finalvalue;
}

function InitForm(nameform) {
FillRandomName(nameform);
}

// Warn about events - this is for debugging.

function event_seen(evnt) {
 alert("Got event: " +  evnt.type);
}

function showstuff(info) {
 window.alert("Info is: " + info);
}