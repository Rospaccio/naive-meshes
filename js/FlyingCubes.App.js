FlyingCubes = {};

FlyingCubes.cubes = [];
FlyingCubes.frameCounter = 0;
FlyingCubes.FRAMES_THRESHOLD = 2;

cameraGoingLeft = false;
cameraGoingRight = false;

window.onkeydown = function(event)
{
    var keycode = event.keyCode;
    console.log("Keycode ==> " + keycode);
    if(keycode === 65)
    {
        cameraGoingLeft = true;
    }
    else if (keycode === 68)
    {
        cameraGoingRight = true;
    }
}

window.onkeyup = function()
{
    cameraGoingLeft = cameraGoingRight = false;
}

FlyingCubes.start = function ()
{
    // basic scene setup
    var scene = new THREE.Scene();
    FlyingCubes.scene = scene;
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    FlyingCubes.camera = camera;
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x5f5f5f );
    document.body.appendChild(renderer.domElement);

    // lights
//    var light = new THREE.AmbientLight(0x404040, 1000.0); // soft white light
//    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    var additionalDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    additionalDirectionalLight.position.set(1, 0, -1);
    scene.add(additionalDirectionalLight);

    camera.lookAt(new THREE.Vector3(0, 0, 100));

    function render() {
        requestAnimationFrame(render);
        
        FlyingCubes.updateObjects();
        FlyingCubes.updateCamera();
        if(FlyingCubes.frameCounter === 0)
        {
            FlyingCubes.addNewCube();
        }
                
        FlyingCubes.frameCounter = (FlyingCubes.frameCounter + 1) % FlyingCubes.FRAMES_THRESHOLD;
        
        renderer.render(scene, camera);
    }

    render();
}

FlyingCubes.updateObjects = function()
{
    var nextIterationCubes = [];
    var cubesCount = FlyingCubes.cubes.length;
    for(var i = 0; i < cubesCount; i++)
    {
        var currentCube = FlyingCubes.cubes[i];
        currentCube.position.z -= .5;
        if(currentCube.position.z >= 0)
        {
            nextIterationCubes.push(currentCube);
        }
        else 
        {
            FlyingCubes.scene.remove(currentCube);
        }
    }
    FlyingCubes.cubes = nextIterationCubes;
};

FlyingCubes.updateCamera = function()
{
    if(cameraGoingLeft)
    {
        FlyingCubes.camera.position.x += .5;
    }
    else if (cameraGoingRight)
    {
        FlyingCubes.camera.position.x -= .5;
    }
};

FlyingCubes.addNewCube = function()
{
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({color: 0x0011dd});
    var cube = new THREE.Mesh(geometry, material);
    FlyingCubes.scene.add(cube);
    FlyingCubes.cubes.push(cube);
    cube.position.z = 100; // = new THREE.Vector3(25, 25, 100);
    var randomXY = FlyingCubes.randomXYPosition();
    cube.position.x = randomXY.x;
    cube.position.y = randomXY.y;
};

FlyingCubes.randomXYPosition = function()
{
    var xCoefficient = Math.random();
    var yCoefficient = Math.random();
    var x = (60 * xCoefficient) - 30;
    var y = (60 * yCoefficient) - 30;
    return {x: x, y: y};
};
