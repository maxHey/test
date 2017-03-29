
var scene;
//****************************************************************************************************** INPUT
//************************* VARIABLES
var clock = new THREE.Clock();
var keyboard = new KeyboardState();

//****************************************************************************************************** PLAYER (added 28-13-17 15:16)
//************************* VARIABLES
var players = [];
var player = {};
//do something..
player.position = new THREE.Vector3( 0, 0, 0 );
player.geometry = geometry.sphere;
player.material = materials.wireframe;
player.mesh = new THREE.Mesh( player.geometry, player.material );
player.velocity = new THREE.Vector3( 0, 0, 0 );
player.input = new THREE.Vector3( 0, 0, 0 );
player.name = "unnamed player";
//****************************************************************************************************** CAMERA
//************************* VARIABLES
var camera;
var camSpawn = { x: 0, y: 600, z: 0 };
var camOffset;
//****************************************************************************************************** LIGHTS
//************************* VARIABLES
var dirLightPos = { x: 0, y: 1000, z: 0 };

//****************************************************************************************************** TEXTURES
//************************* VARIABLES
var textures = {};
textures.wood = new THREE.TextureLoader().load('assets/textures/wood.jpg');
textures.house = new THREE.TextureLoader().load('assets/textures/house.png');
//****************************************************************************************************** MATERIALS
//************************* VARIABLES
var materials = {};
materials.wood = new THREE.MeshLambertMaterial( { map: textures.wood, shading: THREE.SmoothShading });
materials.wireframe = new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } );
materials.additive = new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } ) ;
//****************************************************************************************************** OBJECTS & GEOMETRY
//************************* VARIABLES
// Dictionaries
var objects = [];
var geometry = {};
geometry.sphere = new THREE.SphereGeometry( sphereSize.r , sphereSize.wS , sphereSize.hS );
//
var sphereSize = { r: 0, wS: 6, hS: 6 };
//
var meshesPerRow = 3;
var meshGrid = { x: 200, y: 200, z: 200 };

//****************************************************************************************************** RENDERER
//************************* VARIABLES
var renderer;

//****************************************************************************************************** FPS STATS
//************************* VARIABLES
var container;
var stats;
//****************************************************************************************************** SOCKET
//************************* VARIABLES
var thisUser = {};
thisUser.name = "unnamed";
thisUser.position = {x: 0, y:0, z:0};
thisUser.input = {x: 0, y:0, z:0};