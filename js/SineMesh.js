SineMesh = {};
var samplesLength = 100;
var stepLength;

var xBoundaries = {min: -10, max: 10};
var yBoundaries = {min: -10, max: 10};

var x = [[]];
var y = [[]];
var z = [[]];
var clock = new THREE.Clock();
var totalTime = 0;

SineMesh.init = function()
{
    SineMesh.scene = new THREE.Scene();
    SineMesh.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    SineMesh.renderer = new THREE.WebGLRenderer();
    SineMesh.renderer.setSize(window.innerWidth, window.innerHeight);
    SineMesh.renderer.setClearColor( 0xf0f0f0 );
    document.body.appendChild(SineMesh.renderer.domElement);
    
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(0, 1, 0);
    SineMesh.scene.add(directionalLight);

    var additionalDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    additionalDirectionalLight.position.set(1, 0, 1);
    SineMesh.scene.add(additionalDirectionalLight);
    
    var ambientLight = new THREE.AmbientLight({color: 0xffffff});
    SineMesh.scene.add(ambientLight);
    
    SineMesh.axisHelper = new THREE.AxisHelper(20);
    SineMesh.scene.add(SineMesh.axisHelper);
    
};

SineMesh.initCameraAndControls = function ()
{
    SineMesh.camera.position.x = 40;
    SineMesh.camera.position.y = -40;
    SineMesh.camera.position.z = 40;
    
//    SineMesh.controls.enabled = false;
    
    SineMesh.camera.rotation.x = .5 * Math.PI;
    SineMesh.camera.rotation.y = Math.PI;
//    SineMesh.camera.lookAt(new THREE.Vector3(-1, 1, -1));
    
//    SineMesh.controls.enabled = true;
    
    var controls = new THREE.TrackballControls(SineMesh.camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;
    SineMesh.controls = controls;
    
};

SineMesh.initHtmlElements = function ()
{
    $('input[type="text"]').keypress(function (event) {
        var keyCode = event.which;
        if(keyCode === 13)
        {
            SineMesh.computeFunction();
        }
    });
};

SineMesh.start = function()
{
    SineMesh.initHtmlElements();
    SineMesh.init();
    SineMesh.initCameraAndControls();
    
    //
    var queryParams = SineMesh.parseQueryParams(window.location.href);
    console.log("Query params: ", queryParams);
    if(queryParams && queryParams.hasOwnProperty("function")){
        var functionText = decodeURI(queryParams["function"]);
        SineMesh.setMeshFunction(functionText);
    }
    //
    
    SineMesh.buildSimpleTestMesh();
    // SineMesh.addProbeObject();
    render();
};

function render()
{
    requestAnimationFrame(render);
    
//    SineMesh.updateObjects(clock.getDelta());
    
    SineMesh.controls.update(.02);
    SineMesh.renderer.render(SineMesh.scene, SineMesh.camera);
}

SineMesh.updateObjects = function(t)
{
    var counter = 0;
    for(var i = 0; i < samplesLength - 1; i++)
    {
        for(var j = 0; j < samplesLength; j++)
        {
            for(var k = 0; k < 12; k++)
            {
                var deltaZ = .05 * Math.sin(totalTime + x[i][j])
                    + .05 * Math.sin(totalTime + y[i][j]);
                SineMesh.mesh.geometry.vertices[counter].z += deltaZ;
                counter++;
            }
        }
    }
    totalTime += t;
    SineMesh.mesh.geometry.verticesNeedUpdate = true;
};

SineMesh.addProbeObject = function()
{
    var box = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshLambertMaterial({color: 0x0ffff0});
    var mesh = new THREE.Mesh(box, material);
    SineMesh.scene.add(mesh);
};

var meshFunction = new Function('x', 'y', 'return Math.sin(x) + Math.sin(y)');

SineMesh.buildSimpleTestMesh = function()
{   
    var xStep = (xBoundaries.max - xBoundaries.min) / samplesLength;
    var yStep = (yBoundaries.max - yBoundaries.min) / samplesLength;
    for(var xIndex = 0; xIndex < samplesLength; xIndex ++)
    {    
        x[xIndex] = [];
        y[xIndex] = [];
        z[xIndex] = [];
        for(var i = 0; i < samplesLength; i++)
        {
            x[xIndex][i] = xBoundaries.min + (xIndex * xStep);
            y[xIndex][i] = yBoundaries.min + (i * yStep);
            z[xIndex][i] = meshFunction(x[xIndex][i], y[xIndex][i]);
        }
    }
    
    // the geometry
    var surfaceGeometry = new THREE.Geometry();
    // vertices
    for (var xIndex = 0; xIndex < samplesLength - 1; xIndex++)
    {
//        console.log("Computing vertices for line number " + xIndex);
        for (var i = 0; i < samplesLength; i++)
        {
            // positive
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex][i],       y[xIndex][i],       z[xIndex][i]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex + 1][i],    y[xIndex + 1][i],   z[xIndex + 1][i]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex][i],       y[xIndex][i + 1],   z[xIndex][i + 1]));
            // negative
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex][i],       y[xIndex][i],       z[xIndex][i]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex][i],       y[xIndex][i + 1],   z[xIndex][i + 1]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex + 1][i],    y[xIndex + 1][i],   z[xIndex + 1][i]));

            // positive
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex + 1][i],  y[xIndex + 1][i],         z[xIndex + 1][i]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex + 1][i + 1],  y[xIndex + 1][i + 1],   z[xIndex + 1][i + 1]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex][i + 1],      y[xIndex][i + 1],       z[xIndex][i + 1]));
            // negative
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex + 1][i],  y[xIndex + 1][i],         z[xIndex + 1][i]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex][i + 1],      y[xIndex][i + 1],       z[xIndex][i + 1]));
            surfaceGeometry.vertices.push(new THREE.Vector3(x[xIndex + 1][i + 1],  y[xIndex + 1][i + 1],   z[xIndex + 1][i + 1]));
        }
    }
    
    console.log("vertices => " + surfaceGeometry.vertices.length);
    for (var i = 0; i < samplesLength * (samplesLength - 1); i++)
    {
        var j = i * 12;

        if (i % samplesLength !== (samplesLength - 1)) {
            surfaceGeometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
            surfaceGeometry.faces.push(new THREE.Face3(j + 3, j + 4, j + 5));
            surfaceGeometry.faces.push(new THREE.Face3(j + 6, j + 7, j + 8));
            surfaceGeometry.faces.push(new THREE.Face3(j + 9, j + 10, j + 11));
        }
    }
    
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(surfaceGeometry, material);
    surfaceGeometry.computeFaceNormals();
    surfaceGeometry.computeVertexNormals();
    surfaceGeometry.computeBoundingSphere();
    
    SineMesh.scene.add(mesh);
    SineMesh.mesh = mesh;
};

SineMesh.computeFunction = function()
{
    SineMesh.updateBoundaries();
    var functionText = $('#functionInput').val();
    
    SineMesh.updateAddressBar(functionText);
    
    SineMesh.setMeshFunction(functionText);
    SineMesh.scene.remove(SineMesh.mesh);
    SineMesh.buildSimpleTestMesh();
};

SineMesh.setMeshFunction = function (functionText) {
    console.log("Computing function " + functionText);
    $('#functionInput').val(functionText);
    functionText = "return " + functionText;
    meshFunction = new Function('x', 'y', functionText);
};

SineMesh.updateAddressBar = function (functionText) {
    var urlToKeep = window.location.origin + window.location.pathname;
    var newUrl = urlToKeep + "?function=" + encodeURI(functionText);
    console.log("New URL: ", newUrl);
    window.history.pushState({}, "", newUrl);
};

SineMesh.updateBoundaries = function()
{
    var xMin = parseFloat($('#xMin').val());
    if(!isNaN(xMin)){
        xBoundaries.min = xMin;
    }
    var xMax = parseFloat($('#xMax').val());
    if(!isNaN(xMax)){
        xBoundaries.max = xMax;
    }
    
    var yMin = parseFloat($('#yMin').val());
    if(!isNaN(yMin)){
        yBoundaries.min = yMin;
    }
    var yMax = parseFloat($('#yMax').val());
    if(!isNaN(yMax)){
        yBoundaries.max = yMax;
    }

    var samplesNumber = parseInt($('#samplesNumber').val(), 10);
    console.log('samples number = ' + samplesNumber);
    if (!isNaN(samplesNumber)) {
        samplesLength = samplesNumber;
    }
};

SineMesh.historyItemClicked = function(anchor){
    var functionText = $(anchor).text();
    $('#functionInput').val(functionText);
    SineMesh.computeFunction();
};

SineMesh.getHistory = function()
{
    var historyJson = localStorage.getItem('functionHistory');
    if(historyJson === null)
    {
        historyJson = "[]";
    }
    var history = JSON.parse(historyJson);
    return history;
};

SineMesh.saveHistory = function(history){
    localStorage.setItem('functionHistory', JSON.stringify(history));
};

SineMesh.saveCurrentFunction = function()
{
    var functionText = $('#functionInput').val();
    var history = SineMesh.getHistory();
    history.push(functionText);
    SineMesh.saveHistory(history);
    SineMesh.updateHistoryList();
};

SineMesh.updateHistoryList = function () {
    var history = SineMesh.getHistory();
    var historyList = $('#historyList');
    historyList.empty();

    $(history).each(function (index, functionText) {
        var item = document.createElement('li');
        var anchor = document.createElement('a');
        anchor.innerHTML = functionText;
        anchor.href = "#";
        anchor.onclick = function () {
            SineMesh.historyItemClicked(this);
        };
        
        var deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Delete";
        deleteButton.setAttribute('sm:index', index);
        
        deleteButton.onclick = function(){
            console.log("index = " + index);
            SineMesh.deleteFromHistoryByIndex(index);
        };

        item.appendChild(anchor);
        item.appendChild(deleteButton)
        historyList.append(item);
    });
};

SineMesh.deleteFromHistoryByIndex = function(index)
{
    var history = SineMesh.getHistory();
    history.splice(index, 1);
    SineMesh.saveHistory(history);
    SineMesh.updateHistoryList();
};

SineMesh.parseQueryParams = function(url){
    var queryStringStart = url.indexOf("?");
    if (queryStringStart > 0) {
        var queryString = url.slice((queryStringStart + 1), url.length);
        var paramsCouples = queryString.split("&");
        var params = {};
        for (var i = 0; i < paramsCouples.length; i++) {
            var keyAndValue = paramsCouples[i].split("=");
            var key = keyAndValue[0];
            var value = keyAndValue[1];
            params[key] = value;
        }
    }
    return params;
};