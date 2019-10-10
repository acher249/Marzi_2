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

// Adam
// Ask For permissions for Safari on iOS13..
if (typeof DeviceMotionEvent.requestPermission === 'function') {
  // iOS 13+

  DeviceOrientationEvent.requestPermission()
  .then(response => {
    if (response == 'granted') {
      window.addEventListener('deviceorientation', (e) => {
        // do something with e
      })
    }
  })

  DeviceMotionEvent.requestPermission()
  .then(response => {
    if (response == 'granted') {
      window.addEventListener('devicemotion', (e) => {
        // do something with e
      })
    }
  })
  .catch(console.error)

.catch(console.error)
} else {
  // non iOS 13+
}

// Create viewer.
var viewer = new Marzipano.Viewer(document.getElementById('pano'));
var bowser = window.bowser;

// Adam
// Add pinch zoom

// Register the custom control method.
var deviceOrientationControlMethod = new DeviceOrientationControlMethod();

var controls = viewer.controls();
controls.registerMethod('deviceOrientation', deviceOrientationControlMethod,);

// Create source.
// var source = Marzipano.ImageUrlSource.fromString(
//   // "//www.marzipano.net/media/cubemap/{f}.jpg"
//   "https://l13.alamy.com/360/R1GEED/spherical-360-degree-equirectangular-panorama-of-praa-do-povo-funchal-madeira-R1GEED.jpg"
// );

// Adam - This is the fix********
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

toggleElement.addEventListener('click', toggle);
