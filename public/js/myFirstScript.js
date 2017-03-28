if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer;
var particleLight;

var objects = [], materials = [];

var camPos = { x: 0, y: 600, z: 0 };
var sphereSize = { r: 0, wS: 32, hS: 32 };
var dirLightPos = { x: 0, y: 1000, z: 0 };

var meshesPerRow = 3;
var meshGrid = { x: 200, y: 200, z: 200 };

init();
animate();

function drawGrid()
{
    //*************** GRID
    var line_material = new THREE.LineBasicMaterial( { color: 0xffaa00 } ),
        geometry = new THREE.Geometry(),
        floor = -75, step = 25;
    for ( var i = 0; i <= 40; i ++ ) {

        geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
        geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );

        geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );

    }
    var line = new THREE.LineSegments( geometry, line_material );
    scene.add( line );
}

function SetUpCamera()
{
    //*************** CAMERA
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( camPos.x , camPos.y , camPos.z );
}

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

function init() {

    //*************** START
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    scene = new THREE.Scene();
    SetUpCamera();
    SetUpLights();
    drawGrid();
    //*************** TEXTURE
    var textureWood = new THREE.TextureLoader().load('assets/textures/wood.jpg');
    //*************** MATERIALS
    materials.push( new THREE.MeshLambertMaterial( { map: textureWood, shading: THREE.SmoothShading }) );
    materials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ) );
    materials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } ) );

    //*************** GEOMETRY
    //** BASIC SPHERE MESH
    var geometry = new THREE.SphereGeometry( sphereSize.r , sphereSize.wS , sphereSize.hS );
    objects = [];
    //** ADD MATERIALS TO EACH SPHERE
    for ( var i = 0, l = materials.length; i < l; i ++ ) {

        addMesh( geometry, materials[ i ] );
    }

    //*************** ADD the RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    //*************** CONTAINER
    container.appendChild( renderer.domElement );
    //
    stats = new Stats();
    container.appendChild( stats.dom );
    //
    window.addEventListener( 'resize', onWindowResize, false );
}

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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

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

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();
}

function render() {

    var timer = 0.0001 * Date.now();
    //camera.position.x = Math.cos( timer ) * 1000;
    //camera.position.z = Math.sin( timer ) * 1000;

    camera.lookAt( scene.position );

    /*
    for ( var i = 0, l = objects.length; i < l; i ++ ) {
        var object = objects[ i ];
        object.rotation.x += 0.01;
        object.rotation.y += 0.005;
    }
    */

    //materials[ materials.length - 2 ].emissive.setHSL( 0.54, 1, 0.35 * ( 0.5 + 0.5 * Math.sin( 35 * timer ) ) );
    //materials[ materials.length - 3 ].emissive.setHSL( 0.04, 1, 0.35 * ( 0.5 + 0.5 * Math.cos( 35 * timer ) ) );

    //particleLight.position.x = Math.sin( timer * 7 ) * 300;
    //particleLight.position.y = Math.cos( timer * 5 ) * 400;
    //particleLight.position.z = Math.cos( timer * 3 ) * 300;

    renderer.render( scene, camera );

}