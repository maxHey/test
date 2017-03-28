if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var scene;

//***************************************************************************************************************************** System
//****************************************************************************************************** INIT
function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    scene = new THREE.Scene();

    SetUpCamera();
    SetUpLights();
    drawGrid();

    LoadTextures();
    SetupMaterials();

    LoadGeometry();
    SetupGeometry();

    SetupRenderer();
    SetupFPSStats();
    //
    window.addEventListener( 'resize', onWindowResize, false );
    //
    SpawnPlayer();
}

//****************************************************************************************************** Animate
function animate() {

    requestAnimationFrame( animate );
    handleInput();
    render();
    stats.update();
}

//****************************************************************************************************** Render
function render() {

    var timer = 0.0001 * Date.now();
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

//***************************************************************************************************************************** METHODS

//****************************************************************************************************** TEMPLATE
//************************* VARIABLES
var myVar;
//************************* METHODS
//*************** METHODNAME
// >> DEPENDENCIES:
function doSomething()
{
    //do something..
}

//****************************************************************************************************** INPUT
//************************* VARIABLES
var clock = new THREE.Clock();
var keyboard = new KeyboardState();
//************************* METHODS
//*************** METHODNAME
// >> DEPENDENCIES:
function handleInput()
{
    if( keyboard)
    {
        keyboard.update();
        var moveDistance = 100 * clock.getDelta(); 

        if ( keyboard.pressed("W") || keyboard.down("up"))
        {
            player.mesh.translateZ( -moveDistance );
        }
        if ( keyboard.pressed("S") || keyboard.down("down") )
        {

            player.mesh.translateZ( moveDistance );
        }

        if ( keyboard.pressed("D") || keyboard.down("right") )
        {
            player.mesh.translateX( moveDistance );
        }
        if ( keyboard.pressed("A") || keyboard.down("left") )
        {
            player.mesh.translateX(  -moveDistance );
        }

        player.position = player.mesh.position;
    }
}


//****************************************************************************************************** PLAYER (added 28-13-17 15:16)
//************************* VARIABLES
var players = [];
var player = {};
//************************* METHODS
//*************** METHODNAME
// >> DEPENDENCIES: geometry, materials
function SpawnPlayer()
{
    //do something..
    player.position = new THREE.Vector3( 0, 0, 0 );
    player.geometry = geometry.sphere;
    player.material = materials.wireframe;
    player.mesh = new THREE.Mesh( player.geometry, player.material );
    player.velocity = new THREE.Vector3( 0, 0, 0 );
    player.input = new THREE.Vector3( 0, 0, 0 );
    player.name = "unnamed player";

    players.push(player);
    //
    player.mesh.position = player.position;
    //
    objects.push( player.mesh );
    scene.add( player.mesh );
}

//****************************************************************************************************** GRID
//************************* VARIABLES

//************************* METHODS
//*************** DRAW
// >> DEPENDENCIES: scene
function drawGrid()
{
    //*************** GRID
    var line_material = new THREE.LineBasicMaterial( { color: 0xffaa00 } ),
        geometry = new THREE.Geometry(),
        floor = -75, step = 25;
    for ( var i = 0; i <= 40; i ++ ) 
    {
        geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
        geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );
    }
    var line = new THREE.LineSegments( geometry, line_material );
    scene.add( line );
}

//****************************************************************************************************** CAMERA
//************************* VARIABLES
var camera;
var camPos = { x: 0, y: 600, z: 0 };
//************************* METHODS
//*************** SETUP
// >> DEPENDENCIES: 
function SetUpCamera()
{
    //*************** CAMERA
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( camPos.x , camPos.y , camPos.z );
}

//****************************************************************************************************** LIGHTS
//************************* VARIABLES
var dirLightPos = { x: 0, y: 1000, z: 0 };
//var particleLight;
//************************* METHODS
//*************** SETUP
// >> DEPENDENCIES: scene
function SetUpLights()
{
    //*************** LIGHTS
    //** AMBIENTLIGHT
    scene.add( new THREE.AmbientLight( 0x091426 ) );
    //** DIRECTIONAL
    var directionalLight = new THREE.DirectionalLight( /*Math.random() * */ 0xffffff, 1 );
    directionalLight.position.x = dirLightPos.x;
    directionalLight.position.y = dirLightPos.y;
    directionalLight.position.z = dirLightPos.z;
    directionalLight.position.normalize();
    scene.add( directionalLight );
}

//****************************************************************************************************** TEXTURES
//************************* VARIABLES
var textures = {};
//************************* METHODS
//*************** LOAD
// >> DEPENDENCIES: 
function LoadTextures()
{
    //*************** TEXTURE
    textures.wood = new THREE.TextureLoader().load('assets/textures/wood.jpg');
}

//************************* generateTexture
// >> DEPENDENCIES: 
function generateTexture() {
    var canvas = document.createElement( 'canvas' );
    canvas.width = 256;
    canvas.height = 256;

    var context = canvas.getContext( '2d' );
    var image = context.getImageData( 0, 0, 256, 256 );

    var x = 0, y = 0;

    for ( var i = 0, j = 0, l = image.data.length; i < l; i += 4, j ++ ) {
        x = j % 256;
        y = x == 0 ? y + 1 : y;

        image.data[ i ] = 255;
        image.data[ i + 1 ] = 255;
        image.data[ i + 2 ] = 255;
        image.data[ i + 3 ] = Math.floor( x ^ y );
    }

    context.putImageData( image, 0, 0 );

    return canvas;
}

//****************************************************************************************************** MATERIALS
//************************* VARIABLES
var materials = {};
//************************* METHODS
//*************** SETUP
// >> DEPENDENCIES: textures
function SetupMaterials()
{
    //*************** MATERIALS
    materials.wood = new THREE.MeshLambertMaterial( { map: textures.wood, shading: THREE.SmoothShading });
    materials.wireframe = new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } );
    materials.additive = new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } ) ;
}
//****************************************************************************************************** OBJECTS & GEOMETRY
//************************* VARIABLES
// Dictionaries
var objects = [];
var geometry = {};
//
var sphereSize = { r: 0, wS: 6, hS: 6 };
//
var meshesPerRow = 3;
var meshGrid = { x: 200, y: 200, z: 200 };
//************************* METHODS
//*************** LOAD
// >> DEPENDENCIES:
function LoadGeometry()
{
    //** BASIC SPHERE MESH
    geometry.sphere = new THREE.SphereGeometry( sphereSize.r , sphereSize.wS , sphereSize.hS );
}

//*************** SETUP
// >> DEPENDENCIES: materials
function SetupGeometry()
{
    for( var key in materials )
    {
        addMesh( geometry.sphere, materials[key] );
    }
}

//*************** AddMesh
// >> DEPENDENCIES: scene
function addMesh( geometry, material ) {
    var mesh = new THREE.Mesh( geometry, material );

    mesh.position.x = ( objects.length % meshesPerRow ) * (0.5*meshGrid.x) - (0.5*meshGrid.x);
    mesh.position.z = Math.floor( objects.length / meshesPerRow ) * (0.5*meshGrid.z) - (0.5*meshGrid.z);
    //mesh.rotation.x = Math.random() * 200 - 100;
    //mesh.rotation.y = Math.random() * 200 - 100;
    //mesh.rotation.z = Math.random() * 200 - 100;

    objects.push( mesh );
    scene.add( mesh );
}

//****************************************************************************************************** RENDERER
//************************* VARIABLES
var renderer;
//************************* METHODS
//*************** Setup Renderer
// >> DEPENDENCIES: window
function SetupRenderer()
{
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//****************************************************************************************************** FPS STATS
//************************* VARIABLES
var container;
var stats;
//*************** Setup Renderer
// >> DEPENDENCIES: renderer
function SetupFPSStats()
{
    container.appendChild( renderer.domElement );
    stats = new Stats();
    container.appendChild( stats.dom );
}

//***************************************************************************************************************************** EVENTS
//************************* OnWindowResize
// >> DEPENDENCIES: camera, renderer, window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//***************************************************************************************************************************** EXECUTING
init();
animate();







function ExampleObject(name) {
    this.name = name,
    this.position = 0 +","+ 0 ","+ 0,
    this.input = 0 +","+ 0 ","+ 0
}
//***************************************************************************************************************************** SOCKET
var socket = io();
// Immediately start connecting
socket = io.connect();

socket.on('connect', function(data) 
{
    // Respond with a message including this clients' id sent from the server
    socket.emit('USER_CONNECT', new ExampleObject("unnamed") );

    console.log("attempt connection");
});

socket.on('USER_CONNECTED', function(data) 
{
    console.log("Socket connected");
});

socket.on('disconnect', function(data) 
{
    // Respond with a message including this clients' id sent from the server
    //socket.emit('USER_DISCONNECTED');
});

socket.on('time', function(data) 
{
    addMessage(data.time);
});

socket.on('error', console.error.bind(console));
socket.on('message', console.log.bind(console));