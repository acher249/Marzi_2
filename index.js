/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Create viewer.
var viewer = new Marzipano.Viewer(document.getElementById('pano'));
var bowser = window.bowser;
var Hammer = Marzipano.dependencies['hammerjs'];

var hammerTouch = viewer._hammerManagerTouch;
var hammerMouse = viewer._hammerManagerMouse;

// Change scene on two-finger swipe.
var pinchRecognizer = hammerTouch.manager().get('pinch');
var swipeRecognizer = new Hammer.Swipe({ direction: Hammer.HORIZONTAL, pointers: 2 });
swipeRecognizer.recognizeWith(pinchRecognizer);
hammerTouch.manager().add(swipeRecognizer);

// Prevent pan and zoom events from being handled after swipe ends.
function disableControlsTemporarily() {
  viewer.controls().disableMethod('touchView');
  viewer.controls().disableMethod('pinch');
  setTimeout(function() {
    viewer.controls().enableMethod('touchView');
    viewer.controls().enableMethod('pinch');
  }, 200);
}

// Register the custom control method.
var deviceOrientationControlMethod = new DeviceOrientationControlMethod();
var controls = viewer.controls();
controls.registerMethod('deviceOrientation', deviceOrientationControlMethod);

// Create source.
// var source = Marzipano.ImageUrlSource.fromString(
//   // "//www.marzipano.net/media/cubemap/{f}.jpg"
//   "https://l13.alamy.com/360/R1GEED/spherical-360-degree-equirectangular-panorama-of-praa-do-povo-funchal-madeira-R1GEED.jpg"
// );


// replace the images in the first folder.. 
var source = Marzipano.ImageUrlSource.fromString(
  "./tiles/0-9dekalb360_1100/1/{f}/{y}/{x}.png",
  /*{ cubeMapPreviewUrl: "./tiles/0-9dekalb360_1100/preview.jpg"}*/);

// https://l13.alamy.com/360/R1GEED/spherical-360-degree-equirectangular-panorama-of-praa-do-povo-funchal-madeira-R1GEED.jpg
// http://paulbourke.net/miscellaneous/cubemaps/canyon1.jpg

// Create geometry.
var geometry = new Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }]);

// Create view.
var limiter = Marzipano.RectilinearView.limit.traditional(1024, 100*Math.PI/180);
var view = new Marzipano.RectilinearView(null, limiter);

// Create scene.
var scene = viewer.createScene({
  source: source,
  geometry: geometry,
  view: view,
  pinFirstLevel: true
});

// Display scene.
scene.switchTo();

// Set up control for enabling/disabling device orientation.

// was wroking with true??
var enabled = false;
toggle();

var toggleElement = document.getElementById('toggleDeviceOrientation');

function enable() {
  deviceOrientationControlMethod.getPitch(function(err, pitch) {
    if (!err) {
      view.setPitch(pitch);
    }
  });
  controls.enableMethod('deviceOrientation');
  enabled = true;
  // toggleElement.className = 'enabled';
}

function disable() {
  controls.disableMethod('deviceOrientation');
  enabled = false;
  toggleElement.className = '';
}

function toggle() {
  console.log("toggle..");
  if (enabled) {
    disable();
  } else {
    enable();
  }
}

// Adam Zoom
// Zoom on tap.
  function zoomOnTap(e) {
    var coords = viewer.view().screenToCoordinates(e.center);
    coords.fov = viewer.view().fov() * 0.8;
    viewer.lookTo(coords, { transitionDuration: 300 });
  }
  var tapRecognizerMouse = new Hammer.Tap({ taps: 2, posThreshold: 20 });
  hammerMouse.manager().add(tapRecognizerMouse);
  hammerMouse.on('tap', zoomOnTap);
  var tapRecognizerTouch = new Hammer.Tap({ taps: 2, posThreshold: 50 })
  hammerTouch.manager().add(tapRecognizerTouch);
  hammerTouch.on('tap', zoomOnTap);

toggleElement.addEventListener('click', toggle);
