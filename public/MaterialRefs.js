
    //*************** MATERIALS
    var textureWood = new THREE.TextureLoader().load('assets/textures/wood.jpg');
    materials.push( new THREE.MeshLambertMaterial( { map: textureWood, shading: THREE.SmoothShading }) );

    //*************** SPECIAL
    //** WIREFRAME RENDERER
    materials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ) );
    //** TRANSPARENT
    materials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } ) );

    //*************** LAMBERT
    //** Lambert Textured SMOOTH
    //materials.push( new THREE.MeshLambertMaterial( { map: texture, transparent: false } ) );
    //** LAMBERT COLORED SMOOTH
    //materials.push( new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading } ) );
    //** Lambert COLORED FLAT
    //materials.push( new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } ) );
    //** LAMBERT COLOR EMMISSIVE
    //materials.push( new THREE.MeshLambertMaterial( { color: 0x666666, emissive: 0x550000, shading: THREE.SmoothShading } ) );

    //*************** PHONG
    //** PHONG COLORED SPECULAR FLAT
    //materials.push( new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } ) );
    //** PHONG COLORED TEXTURED TRANSPARENT SPECULAR SMOOTH
    //materials.push( new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.SmoothShading, map: texture, transparent: false } ) );
    //** PHONG COLOR SPECULAR EMMISSIVE TRANSP
    //materials.push( new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0x111100, shininess: 10, shading: THREE.SmoothShading, opacity: 0.9, transparent: true } ) );

    //*************** NORMAL
    //** NORMAL
    //materials.push( new THREE.MeshNormalMaterial( ) );
    //** NORMAL SMOOTH
    //materials.push( new THREE.MeshNormalMaterial( { shading: THREE.FlatShading } ) );