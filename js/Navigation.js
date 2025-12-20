import {
  Vector2,
  Vector3,
  Line,
  Line3,
  Plane,
  LineBasicMaterial,
  LineDashedMaterial,
  WebGLRenderer,
  Scene,
  Fog,
  PerspectiveCamera,
  FontLoader,
  Color,
  AmbientLight,
  SpotLight,
  DoubleSide,
  BufferGeometry,
  RingBufferGeometry,
  SphereBufferGeometry,
  ShapeBufferGeometry,
  TextureLoader,
  Mesh,
  MeshBasicMaterial,
  RepeatWrapping
} from './threejs/build/three.module-minified.js';
import { OrbitControls } from './threejs/examples/jsm/controls/OrbitControls-minified.js';
import dom from './Dom.js';


/**
 * Configuration
 */

// Colors used
const routeLineColor = 0xC4D7E6;
const stepColors = [0xb16286, 0x458588, 0xC4D7E6]; // Note that these are in the CSS as well
const backgroundColor = 0x151F26;
const bodyColor = 0x313639;
const gridTextureColor = 0xfada7d;
const gridHighlightColor = 0x6A5C36;
const orbitalMarkerColor = 0xfada7d;

// Limit the bodysize (in km) so we can't crash the client with a huge input
const maxBodySize = 9000;

// Scale to work with (1km * scale = 1 unit)
const scale = 0.01;


/**
 * Application init
 */

// All Three Js elements that need to be updated during animation
const updatables = [];

// All Three Js elements that need to stay faced to the camera
const faceCamera = [];

// Collect stuff to clean for a reset in garbage
const garbage = [];

// Helper variable, center of map
const center = new Vector3(0, 0, 0);

// Some global variables used for threejs
let font, camera, scene, renderer, tvEffectTexture;

// Boolean to track if we are already animating
let animationStarted = false;

// Load in all get variables
let getVariables = {};
window.location.search
  .substring(1)
  .split('&')
  .forEach(pair => {
    const val = pair.split('=');
    getVariables[val[0]] = decodeURIComponent(val[1]);
  });


/**
 * Connect events to logic
 */

// Get all HTML input values and assign them to getVariables
dom('button#plot').on('click', e => {
  e.preventDefault();
  getVariables = {
    title: dom(`input[name=title]`).value()
  };

  // Handle all float values here
  ['om1', 'om2', 'om3', 'om4', 'om5', 'om6', 'size', 'distance'].forEach(prop => {
    let value = dom(`input[name=${prop}]`).value();
    getVariables[prop] = parseFloat(value.replace(',', '.'));
  });

  // Update URL so we can share this location
  const getStringParts = [];
  for (const key in getVariables) {
    if (key && getVariables[key]) {
      getStringParts.push(`${key}=` + encodeURIComponent(getVariables[key]));
    }
  }

  const newurl = window.location.protocol + '//' + window.location.host +
    window.location.pathname + '?' + getStringParts.join('&');

  window.history.pushState({ path: newurl }, '', newurl);

  // Parse input
  parseInput();
});

// Connect form events to logic
dom('select[name=body]').on('change', e => {
  const select = dom(e.target);
  const value = select.value().split(':');
  dom('input[name=size]').value(value[0]);
  dom('input[name=distance]').value(value[1]);
});

dom('button#clear').on('click', e => {
  e.preventDefault();
  getVariables = {};
  syncInputs();
});

dom('button#close').on('click', e => {
  e.preventDefault();
  hideInputView();
});

dom('button#edit').on('click', e => {
  e.preventDefault();
  showInputView();
});

dom('button#aide').on('click', e => {
  e.preventDefault();
  showAide();
});

dom('button#closeaide').on('click', e => {
  e.preventDefault();
  hideAide();
});

/**
 * Init
 */
// fenetre d'aide ferme
hideAide()

// Hide form
hideInputView();

// Sync inputs with data from the URL
syncInputs();

// Parse data from the URL
parseInput();


/**
 * Functions below
 */
function showInputView() {
  dom('#input').addClass('visible');
  dom('button#edit').removeClass('visible');
}

function hideInputView() {
  dom('#input').removeClass('visible');
  dom('button#edit').addClass('visible');
}

/**
 * Functions bouton Aide et test
 */
function showAide() {
  dom('#over-lay').addClass('visible2');
  dom('button#aide').removeClass('visible2');
}

function hideAide() {
  dom('#over-lay').removeClass('visible2');
  dom('button#aide').addClass('visible2');
}


// Sync inputs with the data in getVariables
function syncInputs() {
  // Set some defaults (daymar in this case)
  if (!getVariables.size && !getVariables.distance) {
    getVariables.size = 295;
    getVariables.distance = 432.85;
  }
  dom('input[name=om1]').value(getVariables.om1 || '');
  dom('input[name=om2]').value(getVariables.om2 || '');
  dom('input[name=om3]').value(getVariables.om3 || '');
  dom('input[name=om4]').value(getVariables.om4 || '');
  dom('input[name=om5]').value(getVariables.om5 || '');
  dom('input[name=om6]').value(getVariables.om6 || '');
  dom('input[name=distance]').value(getVariables.distance || '');
  dom('input[name=size]').value(getVariables.size || '');
  dom('input[name=size]').value(getVariables.size || '');
  dom('input[name=title]').value(getVariables.title || '');
  dom('select[name=body]').value(`${getVariables.size}:${getVariables.distance}`);
}

// Parse and validate data in getVariables. This is the main entry point for plottin a route
function parseInput() {
  // Clear errors
  resetErrors();
  dom('#description').empty();
  hideInputView();

  // Get OM distance from get variables
  if (!getVariables.distance || getVariables.distance < 1) {
    return error('Sélectionnez un emplacement et la distance des 3 OM les plus proches du POI pour tracer votre itinéraire !');
  }
  const orbitalMarkerDistance = Math.max(0, Math.min(maxBodySize * 2, parseFloat(getVariables.distance))) * scale;
  getVariables.distance = (orbitalMarkerDistance / scale).toFixed(1); // Update get data with the potentially changed size

  // Define all OM positions
  const omVectors = [
    new Vector3(0, 0, orbitalMarkerDistance),
    new Vector3(0, 0, -orbitalMarkerDistance),
    new Vector3(0, orbitalMarkerDistance, 0),
    new Vector3(0, -orbitalMarkerDistance, 0),
    new Vector3(orbitalMarkerDistance, 0, 0),
    new Vector3(-orbitalMarkerDistance, 0, 0)
  ];

  // Define body size
  if (getVariables.size < 1) {
    return error('Veuillez fournir une distance entre la surface et le noyau pour tracer un itinéraire valide');
  }
  const bodySize = Math.max(0, Math.min(maxBodySize, parseFloat(getVariables.size))) * scale;
  getVariables.size = (bodySize / scale).toFixed(1); // Update get data with the potentially changed size
  syncInputs();

  // Check inputs and
  let inputCount = 0;
  inputCount += getVariables.om1 > 0 ? 1 : 0;
  inputCount += getVariables.om2 > 0 ? 1 : 0;
  inputCount += getVariables.om3 > 0 ? 1 : 0;
  inputCount += getVariables.om4 > 0 ? 1 : 0;
  inputCount += getVariables.om5 > 0 ? 1 : 0;
  inputCount += getVariables.om6 > 0 ? 1 : 0;
  if (inputCount < 3) {
    initMapInterface(null, omVectors, bodySize); // Init a map without target for aesthetics
    return error('Sélectionnez un emplacement et la distance des 3 OM les plus proches du POI pour tracer votre itinéraire !');
  }

  // Set title
  dom('#title').text(getVariables.title);
  document.title = "CarrArk - " + getVariables.title;

  const targetVector = findTargetVector(getVariables, omVectors, bodySize);
  initMapInterface(targetVector, omVectors, bodySize);
}

// init the map and render the body
function initMapInterface(targetVector, omVectors, bodySize) {
  const loader = new FontLoader();
  const relativeScale = bodySize / 3;
  // loader.load('fonts/helvetiker_regular.typeface.json', function(f) {//
  loader.load('fonts/Electrolize_Regular.json', function(f) {
    font = f;
    init3DWorld(bodySize);
    renderCelestialBody(bodySize, relativeScale, omVectors);
    renderRoute(targetVector, relativeScale, omVectors);
    if (!animationStarted) {
      animate();
      window.addEventListener('resize', onWindowResize, false);
    }
  });
}

// Init all 3D related settings like camera, controls, lights and fog
function init3DWorld(bodySize) {
  const container = dom('#container');
  container.empty();

  camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.001, 10000);
  camera.position.set(0, bodySize * 4.5, bodySize * 4.5);

  // The Star Citizen coordinate grid is tilted. Their 'camera' up is Z+ instead of the regular Y+,
  // but their planetary orientation is the regular Y+ for object positions. So if we want to use
  // in game coordinates and keep our sanity, we have to use their coordinate orientation
  // and flip the camera. (Like they did?)
  camera.up = new Vector3(0, 0, 1);

  scene = new Scene();
  scene.background = new Color(backgroundColor);
  scene.add(new AmbientLight(0xdddddd));

  const fog = new Fog(0x000000, bodySize * 4, bodySize * 10);
  scene.fog = fog;

  const light = new SpotLight(0xffdddd, 1.5);
  light.position.set(0, bodySize * 5, bodySize * 5);
  scene.add(light);

  renderer = new WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.append(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 1;
  controls.maxDistance = 80;
  controls.screenSpacePanning = false;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.15;
  updatables.push(controls);
}

function findTargetVector(omDistances, omVectors, bodySize) {
  // Get at least trilateration targets, set distances and find the result
  const trilaterationTargets = [];

  let targetVectors;
  let targetVector;

  omVectors.forEach((om, index) => {
    const getIndex = 'om' + (index + 1);
    if (omDistances[getIndex] > 0) {
      om.r = parseFloat(omDistances[getIndex]) * scale;
      trilaterationTargets.push(om);
    }
  });

  // Trilaterate using the given distances, try to grow to the target with 100 meter increments
  targetVectors = false;
  for (let i = 0; !targetVectors && i < 5; i++) {
    targetVectors = trilaterate(
      trilaterationTargets[0],
      trilaterationTargets[1],
      trilaterationTargets[2],
      false
    );
    if (!targetVectors) {
      trilaterationTargets[0].r += 0.1;
      trilaterationTargets[1].r += 0.1;
      trilaterationTargets[2].r += 0.1;
    }
  }

  // The trilateration result can be null, 1 or 2 coordinates, sort them out and assign a single target
  if (!targetVectors) {
    return error(
      'Les distances fournies ne peuvent aboutir à une coordonnée valide. Merci de vérifier et valider votre saisie.'
    );
  } else if (targetVectors.length == 2) {
    // Add the center point to the list of options and pick the option closest to the surface
    targetVectors.push(
      trilaterate(trilaterationTargets[0], trilaterationTargets[1], trilaterationTargets[2], true)
    );
    targetVectors.sort((a, b) => {
      const ad = Math.abs(a.distanceTo(center) - bodySize);
      const bd = Math.abs(b.distanceTo(center) - bodySize);
      if (ad < bd) return -1;
      if (ad > bd) return 1;
      return 0;
    });
    targetVector = targetVectors[0];
  } else {
    targetVector = targetVectors;
  }

  // Anything more than 20km above or below sea level is a no go
  if (Math.abs(targetVector.distanceTo(center) - bodySize) > 20 * scale) {
    return error(
      'Les distances fournies ne correspondent pas à un emplacement de surface valide, cette application peut uniquement tracer un itinéraire vers un POI de surface.'
    );
  }

  return targetVector;
}

function renderCelestialBody(bodySize, relativeScale, omVectors) {
  const textureLoader = new TextureLoader();

  // Cleanup previous scene
  scene.remove(...garbage);
  garbage.length = 0;
  faceCamera.length = 0;

  // Add main sphere
  const body = renderPoint(new Vector3(), bodySize, bodyColor);
  body.material.transparent = true;
  body.material.opacity = 0.7;
  body.rotateX(Math.PI / 2);

  // The grid texture
  const grid_texture = textureLoader.load('image/sphere-grid.png');
  grid_texture.anisotropy = 2;
  const grid = renderPoint(new Vector3(), bodySize, gridTextureColor);
  grid.rotateX(Math.PI / 2);
  grid.material.map = grid_texture;
  grid.material.transparent = true;
  grid.material.opacity = 1;

  // Tv effect, animated in animate() function
  const effect = renderPoint(new Vector3(), bodySize, gridTextureColor);
  tvEffectTexture = textureLoader.load('image/sphere-scanlines.png');
  tvEffectTexture.wrapT = RepeatWrapping;
  effect.rotateX(Math.PI / 2);
  effect.material.map = tvEffectTexture;
  effect.material.transparent = true;
  effect.material.opacity = 0.6;

  // Render rings to highlight grid
  const ringMaterial = new MeshBasicMaterial({
    color: gridHighlightColor,
    side: DoubleSide
  });
  const ringGeom = new RingBufferGeometry(
    bodySize,
    bodySize + 0.025 * relativeScale,
    parseInt(bodySize * 60),
    1
  );
  const ring1 = new Mesh(ringGeom, ringMaterial);
  const ring2 = new Mesh(ringGeom, ringMaterial);
  ring2.rotateX(Math.PI / 2);
  const ring3 = new Mesh(ringGeom, ringMaterial);
  ring3.rotateY(Math.PI / 2);

  garbage.push(ring1);
  garbage.push(ring2);
  garbage.push(ring3);

  scene.add(ring1);
  scene.add(ring2);
  scene.add(ring3);

  // Add core marker
  renderPoint(center, 0.1 * relativeScale, orbitalMarkerColor);
  renderText(center, `Noyau`, 0.2 * relativeScale, orbitalMarkerColor);

  // Add OM points and Text labels
  omVectors.forEach((v, i) => {
    renderPoint(v, 0.1 * relativeScale, orbitalMarkerColor);
    renderText(v, `OM${i + 1}`, 0.2 * relativeScale, orbitalMarkerColor);
  });
}

function renderRoute(targetVector, relativeScale, omVectors) {
  if (!targetVector) return;

  renderPoint(targetVector, 0.1 * relativeScale, routeLineColor);

  // Sort OMs by distance to target into an array copy (copied by slice()), [0] is starting point, [1] is closes after that, etc.
  const OMVectorsSorted = omVectors
    .slice(0)
    .sort((a, b) => a.distanceTo(targetVector) - b.distanceTo(targetVector));

  // Get the 3 vectors we will be working with
  const vector0 = OMVectorsSorted.shift(); // Travel start
  const vector1 = OMVectorsSorted.shift();
  const vector2 = OMVectorsSorted.shift();

  const name0 = 'OM' + parseInt(omVectors.indexOf(vector0) + 1);
  const name1 = 'OM' + parseInt(omVectors.indexOf(vector1) + 1);
  const name2 = 'OM' + parseInt(omVectors.indexOf(vector2) + 1);

  getVariables.om1 = '';
  getVariables.om2 = '';
  getVariables.om3 = '';
  getVariables.om4 = '';
  getVariables.om5 = '';
  getVariables.om6 = '';
  getVariables[name0.toLowerCase()] = (vector0.distanceTo(targetVector) / scale).toFixed(1);
  getVariables[name1.toLowerCase()] = (vector1.distanceTo(targetVector) / scale).toFixed(1);
  getVariables[name2.toLowerCase()] = (vector2.distanceTo(targetVector) / scale).toFixed(1);
  syncInputs();

  // First test if the target is above or below the plane between the first 3 OMs, if it is below that area, we need 3 steps.
  const testPlane = new Plane();
  testPlane.setFromCoplanarPoints(vector0, vector1, vector2);
  const testLine = new Line3(center, targetVector);

  let text = '';
  const testVector = new Vector3();
  if (testPlane.intersectLine(testLine, testVector)) {
    // Travel plane from 0 to 1
    const plane1 = new Plane();
    plane1.setFromCoplanarPoints(vector0, vector1, center);

    // Travel plane from 1 to 2
    const plane2 = new Plane();
    plane2.setFromCoplanarPoints(vector2, targetVector, center);

    // The target for the first step is where plane2 intersects with the path from vector0 to vector1
    const line1 = new Line3(vector0, vector1);
    const target1 = new Vector3();
    plane2.intersectLine(line1, target1);
    renderPoint(target1, 0.075 * relativeScale, stepColors[0]);

    renderText(
      vector1,
      parseFloat(target1.distanceTo(vector1) / scale).toFixed(1) + ' KM',
      0.15 * relativeScale,
      stepColors[0],
      'bottom'
    );
    renderText(
      vector2,
      parseFloat(targetVector.distanceTo(vector2) / scale).toFixed(1) + ' KM',
      0.15 * relativeScale,
      stepColors[2],
      'bottom'
    );

    // Travel line
    renderLine([vector0, target1, targetVector], routeLineColor);

    // Distance line
    renderLine([target1, vector1], stepColors[0], true, relativeScale);
    renderLine([targetVector, vector2], stepColors[2], true, relativeScale);

    const flyfor1 = parseFloat(vector0.distanceTo(target1) / scale).toFixed(1);
    const distance1 = parseFloat(target1.distanceTo(vector1) / scale).toFixed(1);
    const flyfor2 = parseFloat(target1.distanceTo(targetVector) / scale).toFixed(1);
    const distance2 = parseFloat(targetVector.distanceTo(vector2) / scale).toFixed(1);
    text =
      `<ul>` +
      `<li>Départ à moins de 100 mètres de ${name0}. </li> ` +
      `<li>Tournez vers ${name1}. Volez sur <span class="km">${flyfor1} KM</span> ` +
      ` jusqu à ce que votre distance vers ${name1} soit de <span class="km">${distance1} KM</span>. </li>` +
      `<li>Tournez vers ${name2}, volez sur <span class="km">${flyfor2} KM</span> ` +
      `vers ${name2} jusqu à ce que votre distance vers ${name2} soit de <span class="km">${distance2} KM</span>. ` +
      `<li>Arrivée au niveau de la surface, gardez votre cap vers ${name2} jusqu à atteindre votre objectif.\n</li> ` +
	  `<li><span style="color: #FADA7D;">Complétez l'itinéraire en vous dirigeant vers deux des trois OM renseignés. Vous ètes arrivée!</span>.</li> ` +
      `</ul>`;
  } else {
    // Travel plane from 0 to 1
    const plane1 = new Plane();
    plane1.setFromCoplanarPoints(vector0, vector1, center);

    // Travel plane from 1 to 2
    const plane2 = new Plane();
    plane2.setFromCoplanarPoints(vector2, targetVector, center);

    // Travel plane from 2 to target
    const plane3 = new Plane();
    plane3.setFromCoplanarPoints(vector1, targetVector, center);

    // The target for the first step is where plane2 intersects with the path from vector0 to vector1
    const line1 = new Line3(vector0, vector1);
    const target1 = new Vector3();
    plane2.intersectLine(line1, target1);
    renderText(
      vector1,
      parseFloat(target1.distanceTo(vector1) / scale).toFixed(1) + ' KM',
      0.15 * relativeScale,
      stepColors[0],
      'bottom'
    );
    renderPoint(target1, 0.075 * relativeScale, stepColors[0]);

    // The target for the second step is where plane3 intersects with the path from vector1 to vector2
    const line2 = new Line3(target1, vector2);
    const target2 = new Vector3();
    plane3.intersectLine(line2, target2);
    renderPoint(target2, 0.075 * relativeScale, stepColors[1]);
    renderText(
      vector2,
      parseFloat(target2.distanceTo(vector2) / scale).toFixed(1) + ' KM',
      0.15 * relativeScale,
      stepColors[1],
      'bottom'
    );

    // Travel line
    renderLine([vector0, target1, target2, targetVector], routeLineColor);

    // Distance line
    renderLine([target1, vector1], stepColors[0], true, relativeScale);
    renderLine([target2, vector2], stepColors[1], true, relativeScale);

    const flyfor1 = parseFloat(vector0.distanceTo(target1) / scale).toFixed(1);
    const distance1 = parseFloat(target1.distanceTo(vector1) / scale).toFixed(1);
    const flyfor2 = parseFloat(target1.distanceTo(target2) / scale).toFixed(1);
    const distance2 = parseFloat(target2.distanceTo(vector2) / scale).toFixed(1);
    const flyfor3 = parseFloat(target2.distanceTo(targetVector) / scale).toFixed(1);
    text =
      `<ul>` +
      `<li>Départ à moins de 100 mètres de ${name0}. </li>` +
      `<li>Tournez vers ${name1}. Volez sur <span class="km">${flyfor1} KM</span> jusqu à ce que votre distance vers ${name1} soit de ` +
      `<span class="km">${distance1} KM</span>. </li>` +
      `<li>Tournez vers ${name2}, volez sur <span class="km">${flyfor2} KM</span>` +
      `vers ${name2} jusqu à ce que votre distance vers ${name2} soit de <span class="km">${distance2} KM</span>. </li>` +
      `<li>Volez maintenant tout droit en direction du centre de la planète ou de la lune sur <span class="km">${flyfor3} KM</span>.
      <span style="color: #FADA7D;">Complétez l'itinéraire en vous dirigeant vers deux des trois OM renseignés. Vous ètes arrivée!</span>.</li>
</ul>`;
  }
  dom('#description').html(text);
}

function renderPoint(vector, size = 0.1, color = 0xff00ff) {
  const geometry = new SphereBufferGeometry(size, Math.max(30, 45 * size), Math.max(30, 30 * size));
  const material = new MeshBasicMaterial({
    color: new Color(color)
  });
  const mesh = new Mesh(geometry, material);
  mesh.position.copy(vector);
  garbage.push(mesh);
  scene.add(mesh);
  return mesh;
}

function renderLine(points, color = 0xa89984, dashed = false, relativeScale = 1) {
  let material;
  if (dashed) {
    material = new LineDashedMaterial({
      color: color,
      dashSize: 0.1 * relativeScale,
      gapSize: 0.05 * relativeScale
    });
  } else {
    material = new LineBasicMaterial({
      color: color,
      fog: true
    });
  }

  const geometry = new BufferGeometry().setFromPoints(points);
  const line = new Line(geometry, material);
  if (dashed) line.computeLineDistances();
  garbage.push(line);
  scene.add(line);
}

function renderText(vector, message, fontSize, color = 0xffffff, position = 'top') {
  const material = new MeshBasicMaterial({
    color: color,
    side: DoubleSide
  });

  const shapes = font.generateShapes(message, fontSize);
  const geometry = new ShapeBufferGeometry(shapes);

  geometry.computeBoundingBox();
  const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
  let yMid = fontSize;
  if (position == 'bottom') yMid = -2 * fontSize;
  geometry.translate(xMid, yMid, 0);

  const text = new Mesh(geometry, material);
  text.position.copy(vector);
  faceCamera.push(text);

  garbage.push(text);
  scene.add(text);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  animationStarted = true;
  for (let i = 0; i < updatables.length; i++) {
    updatables[i].update();
  }
  for (let i = 0; i < faceCamera.length; i++) {
    faceCamera[i].quaternion.copy(camera.quaternion);
  }

  let offset_y = tvEffectTexture.offset.y + 0.0001;
  if (offset_y >= 1) offset_y = 0;
  tvEffectTexture.offset = new Vector2(0, offset_y);

  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
}

function trilaterate(p1, p2, p3, return_middle) {
  // based on: https://en.wikipedia.org/wiki/Trilateration
  function sqr(a) {
    return a * a;
  }

  function norm(a) {
    return Math.sqrt(sqr(a.x) + sqr(a.y) + sqr(a.z));
  }

  function vector_subtract(a, b) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  function vector_add(a, b) {
    return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  function vector_divide(a, b) {
    return new Vector3(a.x / b, a.y / b, a.z / b);
  }

  function vector_multiply(a, b) {
    return new Vector3(a.x * b, a.y * b, a.z * b);
  }

  function vector_cross(a, b) {
    return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  }

  let ex, ey, ez, i, j, d, a, x, y, z, p4a, p4b;

  ex = vector_divide(vector_subtract(p2, p1), norm(vector_subtract(p2, p1)));

  i = ex.dot(vector_subtract(p3, p1));
  a = vector_subtract(vector_subtract(p3, p1), vector_multiply(ex, i));
  ey = vector_divide(a, norm(a));
  ez = vector_cross(ex, ey);
  d = norm(vector_subtract(p2, p1));
  j = ey.dot(vector_subtract(p3, p1));

  x = (sqr(p1.r) - sqr(p2.r) + sqr(d)) / (2 * d);
  y = (sqr(p1.r) - sqr(p3.r) + sqr(i) + sqr(j)) / (2 * j) - (i / j) * x;
  z = Math.sqrt(sqr(p1.r) - sqr(x) - sqr(y));

  // no solution found
  if (isNaN(z)) {
    return null;
  }

  a = vector_add(p1, vector_add(vector_multiply(ex, x), vector_multiply(ey, y)));
  p4a = vector_add(a, vector_multiply(ez, z));
  p4b = vector_subtract(a, vector_multiply(ez, z));

  if (z == 0 || return_middle) {
    return new Vector3(a.x, a.y, a.z);
  } else {
    return [new Vector3(p4a.x, p4a.y, p4a.z), new Vector3(p4b.x, p4b.y, p4b.z)];
  }
}

function error(message) {
  const container = dom('#input');
  showInputView();
  dom('<div>')
    .addClass('error')
    .text(message)
    .prependTo(container);
}

function resetErrors() {
  dom('.error').remove();
}
/**
var btnAide = document.getElementById('btnAide');
var overlay = document.getElementById('overlay');
var btnClose = document.getElementById('btnClose');

btnAide.addEventListener('click',openAide);

btnClose.addEventListener('click',closeAide);

function openAide(){
    overlay.style.display = 'block';
}

function closeAide(){
    overlay.style.display = 'none';
}**/
/**
const btnAide = document.getElementById('btn-Aide');
const overlay = document.getElementById('over-lay');

btnAide.addEventListener('click', () => {
  overlay.classList.add('show-help');
});

overlay.addEventListener('click', () => {
  overlay.classList.remove('show-help');
});**/

