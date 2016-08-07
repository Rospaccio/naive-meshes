SineMesh = {};

SineMesh.init = function()
{
    SineMesh.scene = new THREE.Scene();
    SineMesh.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    SineMesh.renderer = new THREE.WebGLRenderer();
    SineMesh.renderer.setSize(window.innerWidth, window.innerHeight);
    SineMesh.renderer.setClearColor( 0xf0f0f0 );
    document.body.appendChild(SineMesh.renderer.domElement);
    
    var trackBallControls = new THREE.TrackballControls(SineMesh.camera);
    trackBallControls.rotateSpeed = 1.0;
    trackBallControls.zoomSpeed = 1.2;
    trackBallControls.panSpeed = 0.8;
    trackBallControls.noZoom = false;
    trackBallControls.noPan = false;
    trackBallControls.staticMoving = true;
    trackBallControls.dynamicDampingFactor = 0.3;
    SineMesh.controls = trackBallControls;
    
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(0, 1, 0);
    SineMesh.scene.add(directionalLight);

    var additionalDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    additionalDirectionalLight.position.set(1, 0, -1);
    SineMesh.scene.add(additionalDirectionalLight);
    
    SineMesh.axisHelper = new THREE.AxisHelper(20);
    SineMesh.scene.add(SineMesh.axisHelper);
    
//    var shape = new THREE.BoxGeometry(1, 1, 1);
//    var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
//    var mesh = new THREE.Mesh(shape, material);
//    SineMesh.scene.add(mesh);
//    mesh.position.y = 5;
};

SineMesh.start = function()
{
    SineMesh.init();
    SineMesh.camera.position.x = 0; // = new THREE.Vector3(-20, 20);
    SineMesh.camera.position.y = 0;
    SineMesh.camera.position.z = -20;
    SineMesh.camera.lookAt(new THREE.Vector3(0, 0, 0));
    SineMesh.buildSimpleTestMesh();
    // SineMesh.addProbeObject();
    
    render();
}

function render()
{
    requestAnimationFrame(render);
    SineMesh.controls.update(.02);
    SineMesh.renderer.render(SineMesh.scene, SineMesh.camera);
}

SineMesh.addProbeObject = function()
{
    var box = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshLambertMaterial({color: 0x0ffff0});
    var mesh = new THREE.Mesh(box, material);
    SineMesh.scene.add(mesh);
}

SineMesh.buildSimpleTestMesh = function()
{
    var samplesLength = 100;
    var stepLength = Math.PI * 0.125;
    var x = [[]];
    var y = [[]];
    var z = [[]];
    
    for(var xIndex = 0; xIndex < samplesLength; xIndex ++)
    {    
        x[xIndex] = [];
        y[xIndex] = [];
        z[xIndex] = [];
        for(var i = 0; i < samplesLength; i++)
        {
            x[xIndex][i] = xIndex * stepLength;
            y[xIndex][i] = i * stepLength;
            z[xIndex][i] = Math.sin(x[xIndex][i]) + Math.sin(y[xIndex][i])
                * 0.1 * x[xIndex][i];
        }
//        console.log(JSON.stringify(x[xIndex]));
//        console.log(JSON.stringify(y[xIndex]));
//        console.log(JSON.stringify(z[xIndex]));
    }
    
    // the geometry
    var surfaceGeometry = new THREE.Geometry();
    // vertices
    for (var xIndex = 0; xIndex < samplesLength - 1; xIndex++)
    {
//        console.log("Computing vertices for line number " + xIndex);
        for (var i = 0; i < samplesLength; i++)
        {
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex][i],       y[xIndex][i],       z[xIndex][i]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex][i],       y[xIndex][i + 1],   z[xIndex][i + 1]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex + 1][i],    y[xIndex + 1][i],   z[xIndex + 1][i]));

            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex + 1][i],  y[xIndex + 1][i],         z[xIndex + 1][i]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex][i + 1],      y[xIndex][i + 1],       z[xIndex][i + 1]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex + 1][i + 1],  y[xIndex + 1][i + 1],   z[xIndex + 1][i + 1]));
        }
    }
    
//    var j = 0;
//    for (var xIndex = 0; xIndex < samplesLength - 1; xIndex++)
//    {
//        for (var i = 0; i < samplesLength; i++)
//        {
//            j = xIndex * 6;
//            surfaceGeometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
//            surfaceGeometry.faces.push(new THREE.Face3(j + 3, j + 4, j + 5));
//        }
//    }
    
    console.log("vertices => " + surfaceGeometry.vertices.length);
    for (var i = 0; i < samplesLength * (samplesLength - 1); i++)
    {
        var j = i * 6;

        if (i % samplesLength !== (samplesLength - 1)) {
            surfaceGeometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
            surfaceGeometry.faces.push(new THREE.Face3(j + 3, j + 4, j + 5));
        }
    }
    
    var material = new THREE.MeshLambertMaterial({color: 0x005588});
    var mesh = new THREE.Mesh(surfaceGeometry, material);
    surfaceGeometry.computeFaceNormals();
    surfaceGeometry.computeVertexNormals();
    surfaceGeometry.computeBoundingSphere();
    
    SineMesh.scene.add(mesh);
}

//SineMesh.buildSingleStripeOfMesh = function(xFirstIndex, )
//{
//    
//}