if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var scene;
var sceneOrtho;
//***************************************************************************************************************************** System
//****************************************************************************************************** INIT
function init() 
{
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    scene = new THREE.Scene();
    sceneOrtho = new THREE.Scene();

    SetUpCamera();
    SetUpLights();
    drawGrid();

    LoadTextures();
    SetupMaterials();

    LoadGeometry();
    SetupGeometry();

    SetupRenderer();
    //SetupFPSStats();
    //
    window.addEventListener( 'resize', onWindowResize, false );
    AddDocumentEventListeners();
    //
    //SpawnPlayer("unnamed player");
}

//****************************************************************************************************** Animate
function animate() 
{
    requestAnimationFrame( animate );

    handleInput();

    MoveCamera();
    render();
    //stats.update();
}

//****************************************************************************************************** Render
function render() 
{
    if( player && player.nameLabel)
    {
        //RenderPlayerName();
        //player.nameLabel.LookAt(camera.position);
    }
    var timer = 0.0001 * Date.now();
    renderer.autoClear = false;

    renderer.clear();
    renderer.render( scene, camera );
    renderer.clearDepth();
    renderer.render(sceneOrtho,cameraOrtho);
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

//***************************************************************************************************************************** EVENT LISTENERS
//****************************************************************************************************** EVENT LISTENERS
//************************* VARIABLES
//var myVar;
//************************* METHODS
//*************** AddDocumentEventListeners
function AddDocumentEventListeners()
{
    document.getElementById("btn_play").addEventListener("click", OnPlayButtonClicked );
}

//*************** OnPlayButtonClicked
function OnPlayButtonClicked()
{
    var name = document.getElementById("inp_name").value;
    if( !name || name == "" )
    {
        name = "unnamed";
    }
    else
    {

    }
    socket.emit("PLAY",name);
    //SpawnPlayer(name, new THREE.Vector3(0,0,0),true);
    //ert("Play Button Pressed");
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
        var input = {x: 0, y:0, z:0};
        if ( keyboard.pressed("W") || keyboard.down("up"))
        {
            input.z = -1;
        }
        if ( keyboard.pressed("S") || keyboard.down("down") )
        {
            input.z = 1;
        }

        if ( keyboard.pressed("D") || keyboard.down("right") )
        {
            input.x = 1;
        }
        if ( keyboard.pressed("A") || keyboard.down("left") )
        {
            input.x = -1;
        }
        if( player ) player.input = input;
        else console.log("player not initialized");

        if( socket ) socket.emit("MOVE",input);     //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SOCKET EMIT MOVE >>    >>    >>    >>
        else console.log("socket not initialized");
    }
    else console.log("keyboard not initialized");
}

//****************************************************************************************************** PLAYER (added 28-13-17 15:16)
//************************* VARIABLES
var players = [];
var player = {};
var otherplayers = {};
//************************* METHODS
//*************** METHODNAME
function SpawnThisPlayer(data)
{
    console.log("[SPAWN][0] Spawn this player");
    var playerServerData = 
    {
        name: data.name,
        position: data.position, 
        input: data.input,
        id: data.id
    }
    SpawnPlayer(playerServerData.name,playerServerData.position,playerServerData.id,true);
}

function SpawnOtherPlayer(data)
{
    console.log("[SPAWN][1] "+data.name+" has joined with ID:"+ data.id +"!");

    var playerServerData = 
    {
        name: data.name,
        position: data.position, 
        input: data.input,
        id: data.id
    }
    SpawnPlayer(playerServerData.name,playerServerData.position,playerServerData.id,false);
}

// >> DEPENDENCIES: geometry, materials , SpawnPlayerName
function SpawnPlayer(name,spawnPos,id,isThisPlayer)
{
    console.log("[SPAWN][2] Spawning Player "+name+"!");
    var spawnedPlayer = {};
    //do something..
    spawnedPlayer.position = new THREE.Vector3( 0, 0, 0 );
    spawnedPlayer.geometry = geometry.sphere;
    spawnedPlayer.material = materials.wireframe;
    spawnedPlayer.mesh = new THREE.Mesh( spawnedPlayer.geometry, spawnedPlayer.material );
    spawnedPlayer.velocity = new THREE.Vector3( 0, 0, 0 );
    spawnedPlayer.input = new THREE.Vector3( 0, 0, 0 );
    spawnedPlayer.name = name;
    spawnedPlayer.id = id;
    //
    players.push(spawnedPlayer);
    spawnedPlayer.mesh.position = spawnPos;
    //
    if( isThisPlayer ) 
    {
        console.log("[SPAWN][3] Assigning this player! ");
        player = spawnedPlayer;
    }
    else
    {
        console.log("[SPAWN][4] Assigning OTHER player! ");
        otherplayers[id] = spawnedPlayer;
    }
    //
    objects.push( spawnedPlayer.mesh );
    scene.add( spawnedPlayer.mesh );
    //
    SpawnPlayerName(spawnedPlayer,spawnedPlayer.name);
}
//*************** SpawnPlayerName
// >> DEPENDENCIES: 
function SpawnPlayerName(spawnedPlayer,name)
{
    spawnedPlayer.nameLabel = makeTextSprite(name,{ fontsize: 64, fontface: "Georgia" } );
    spawnedPlayer.nameLabel.position.set(spawnedPlayer.position.x , spawnedPlayer.position.y , spawnedPlayer.position.z );
    sceneOrtho.add( spawnedPlayer.nameLabel );
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
var cameraOrtho;
var camSpawn = { x: 0, y: 600, z: 0 };
var camOffset;
//************************* METHODS
//*************** SETUP
// >> DEPENDENCIES:
function SetUpCamera()
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    //*************** CAMERA
    camera = new THREE.PerspectiveCamera( 45, width / height, 1, 2000 );
    camOffset = new THREE.Vector3( camSpawn.x , camSpawn.y , camSpawn.z );
    camera.position.set( camOffset.x , camOffset.y , camOffset.z );
    //
    cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 2000 );
    cameraOrtho.position.set( camOffset.x , camOffset.y , camOffset.z );
}

function MoveCamera()
{
    if( player && player.position )
    {
        var x = player.position.x + camOffset.x;
        var y = player.position.y + camOffset.y;
        var z = player.position.z + camOffset.z;

        camera.position.set( x , y , z );
        camera.lookAt( player.position );

        console.log("MoveCam "+ camera.position.x +","+ camera.position.y +","+ camera.position.z "!");

        //cameraOrtho.position.set( x , y , z );
        //cameraOrtho.lookAt( player.position );
    }
    else
    {
        //if( player ) console.log("player not initialized");
        //if( player.position ) console.log("player.position not initialized");
        camera.position.set( camOffset.x , camOffset.y , camOffset.z );
        camera.lookAt( new THREE.Vector3( 0 , 0 , 0 ) );

        //cameraOrtho.position.set( camOffset.x , camOffset.y , camOffset.z );
        //cameraOrtho.lookAt( new THREE.Vector3( 0 , 0 , 0 ) );
    }
}

//*********************************************** RESIZING FUNCTIONS
// Called OnWindowResize
function UpdateMainCamera(width,height)
{
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function UpdateOrthographicCamera(width,height)
{
    cameraOrtho.left = - width / 2;
    cameraOrtho.right = width / 2;
    cameraOrtho.top = height / 2;
    cameraOrtho.bottom = - height / 2;
    cameraOrtho.updateProjectionMatrix();

    //updateHUDSprites();
}

//****************************************************************************************************** LIGHTS
//************************* VARIABLES
var dirLightPos = { x: 0, y: 1000, z: 0 };
var ambientLightColor = 0x155c89;
var dirLightColor = 0xffea98;
var dirLightIntensity = 1.5;
//var particleLight;
//************************* METHODS
//*************** SETUP
// >> DEPENDENCIES: scene
function SetUpLights()
{
    //*************** LIGHTS
    //** AMBIENTLIGHT
    scene.add( new THREE.AmbientLight( ambientLightColor ) );
    //** DIRECTIONAL
    var directionalLight = new THREE.DirectionalLight( /*Math.random() * */ dirLightColor, dirLightIntensity );
    //
    /*
    //SHADOWMAP TEST
    directionalLight.shadowMapWidth = 1024;
    directionalLight.shadowMapHeight = 1024;
    directionalLight.shadowCameraNear = 1;
    directionalLight.shadowCameraFar = 1000;
    directionalLight.shadowCameraLeft = -20; // or whatever value works for the scale of your scene
    directionalLight.shadowCameraRight = 20;
    directionalLight.shadowCameraTop = 20;
    directionalLight.shadowCameraBottom = -20;
    */
    //
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
    textures.house = new THREE.TextureLoader().load('assets/textures/house.jpg');
}

//************************* generateTexture
// >> DEPENDENCIES:
function generateTexture() 
{
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
    materials.house = new THREE.MeshLambertMaterial( { map: textures.house, shading: THREE.SmoothShading });
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
    LoadMesh('assets/obj/house.obj',{x: -500, y:0, z:0},{x: 0, y:90, z:0},100);
    /*
    for( var key in materials )
    {
        addMesh( geometry.sphere, materials[key] );
    }
    */
}

//*************** AddMesh
// >> DEPENDENCIES: scene
function addMesh( geometry, material ) 
{
    var mesh = new THREE.Mesh( geometry, material );

    mesh.position.x = ( objects.length % meshesPerRow ) * (0.5*meshGrid.x) - (0.5*meshGrid.x);
    mesh.position.z = Math.floor( objects.length / meshesPerRow ) * (0.5*meshGrid.z) - (0.5*meshGrid.z);

    objects.push( mesh );
    scene.add( mesh );
    //
}

function LoadMesh(url,position,rotation,scale)
{
    // model
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) 
    {
        console.log( item, loaded, total );
    };
    var loader = new THREE.OBJLoader( manager );
    loader.load( url , function ( object ) 
    {
        object.traverse( function ( child ) 
        {
            if ( child instanceof THREE.Mesh ) 
            {
                //child.material.map = texture;
                child.material = materials.house;
            }
        });
        object.position.x = position.x;
        object.position.y= position.y;
        object.position.z = position.z;

        object.rotation.x = rotation.x;
        object.rotation.y= rotation.y;
        object.rotation.z = rotation.z;

        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = scale;

        obj = object
        scene.add( obj );
    });
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
    container.appendChild( renderer.domElement );
}

//****************************************************************************************************** FPS STATS
//************************* VARIABLES
var container;
var stats;
//*************** Setup Renderer
// >> DEPENDENCIES: renderer
function SetupFPSStats()
{
    //container.appendChild( renderer.domElement );
    stats = new Stats();
    container.appendChild( stats.dom );
}

//****************************************************************************************************** UTILITIES
function makeTextSprite( message, params )
{
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + params.fontsize + "px " + params.fontface;
    
    // get size data (height depends only on font size)
    var metrics = context.measureText( message );
    var textWidth = metrics.width;
    // text color
    context.fillStyle = 0xffffff;
    context.fillStyle = 'white';
    //context.textAlign = "center"
    context.fillText( message, 0, params.fontsize);
    
    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(100,50,1.0);
    return sprite;  
}

//***************************************************************************************************************************** EVENTS
//************************* OnWindowResize
// >> DEPENDENCIES: camera, renderer, window
function onWindowResize() 
{
    var width = window.innerWidth;
    var height = window.innerHeight;

    UpdateMainCamera(width,height);
    UpdateOrthographicCamera(width,height);

    renderer.setSize( width, height );
}

//***************************************************************************************************************************** EXECUTING
init();
animate();

//***************************************************************************************************************************** SOCKET
var socket = io();
// Immediately start connecting
socket = io.connect();

function AttemptConnection(username)
{
    //
    //socket.emit("PLAY", thisUser.name); //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SOCKET EMIT PLAY >    >>    >>    >>
}

socket.on('connect', function(data)
{
    // Respond with a message including this clients' id sent from the server
    socket.emit('USER_CONNECT' );  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SOCKET EMIT USER_CONNECT >>    >>    >>    >>
    console.log("attempting connection");
});

socket.on('ConnectCallBack', function(data)
{
    console.log("Connected, received Server Answer!");
});

socket.on('OtherUserPlay', function(data)
{
    console.log("[OtherUserPlay] Spawn Other Players!");
    SpawnOtherPlayer(data);
});

socket.on("PLAY",function(data)
{
    console.log("[PLAY] Spawn Player!");
    SpawnThisPlayer(data);
});

socket.on("MOVE",function(data)
{
    //console.log("[MOVE] Move command from server!");
    if( player && player.position )
    {
        if( data.id == player.id )
        {
            //console.log("[CLIENT][MOVE] Attempt player move to: x:"+data.x+",y:"+data.y+",z"+data.z+"!");
            player.position.x = data.x;
            player.position.y = data.y;
            player.position.z = data.z;
            //player.mesh.position = new THREE.Vector3( data.x , data.y , data.z );
            player.mesh.position.x = data.x;
            player.mesh.position.y = data.y;
            player.mesh.position.z = data.z;
        }
    }
    else
    {
        if( player ) console.log("[MOVE] player not defined!");
        if( player.position ) console.log("[MOVE] player.position not defined!");
    }
});

socket.on("MOVE_OTHERS",function(data)
{
    //console.log("[MOVE_OTHERS] Move command from server!");
    if( otherplayers )
    {
        if( otherplayers[data.id] )
        {
            otherplayers[data.id].position = data.position;
            //
            otherplayers[data.id].mesh.position.set( data.position.x , data.position.y , data.position.z );
            //
            /*
            otherplayers[data.id].mesh.position.x = data.x;
            otherplayers[data.id].mesh.position.y = data.y;
            otherplayers[data.id].mesh.position.z = data.z;
            */
        }
    }
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
