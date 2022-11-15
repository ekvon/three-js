const moved = [];
//	canvas parameters
var width=window.innerWidth;
var height = window.innerHeight;
//	renderer creation
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
var size = new THREE.Vector2();
renderer.getSize(size);
//  update viewport parameters
width = size.x;
height = size.y;
//	camera parameters
var aspect = width / height;
var Z = 10, theta = 45;
//	graphic (coord.-system) parameters
var h = 2 * Z * Math.tan(theta / 2);
var w = aspect * h;
alert('h:' + h + ',w:' + w);
var a = Math.round(w / 2) - 1;
var b = Math.round(h / 2) - 1;
var kx = w / width;
var ky = h / height;
//	camera and scene creation
var camera = new THREE.PerspectiveCamera(theta, aspect, 0.01, -0.01);
camera.position.set(0, 0, Z);
camera.lookAt(0, 0, 0);
var scene = new THREE.Scene();

//  test line
let points = [];
points.push(new THREE.Vector3(-w / 2, 0, 0));
points.push(new THREE.Vector3(0, -h / 2, 0));
let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
let geometry = new THREE.BufferGeometry().setFromPoints(points);
//	let testLine = new THREE.Line(geometry, material);
//	scene.add(testLine);
//  previous vertical and horizontal line
var prevVL, prevHL;
renderer.domElement.addEventListener("click", function handler(event) {
    let points = [];
    alert('x:' + event.clientX + ',y:' + event.clientY);
    //  three-coord. from canvas coord.
    let X = -w / 2 + kx * event.clientX;
    let Y = h / 2 - ky * event.clientY;
    //  vertical line
    points.push(new THREE.Vector3(X, -h / 2, 0));
    points.push(new THREE.Vector3(X, h / 2, 0));
    let material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let vl = new THREE.Line(geometry, material);
    //  horizontal line
    points.length = 0;
    points.push(new THREE.Vector3(-w / 2, Y, 0));
    points.push(new THREE.Vector3(w / 2, Y, 0));
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    let hl = new THREE.Line(geometry, material);
    //  update scene
    scene.add(vl);
    scene.add(hl);
    scene.remove(prevVL);
    scene.remove(prevHL);
    //  save lines to remove them at the next call
    prevVL = vl;
    prevHL = hl;
    renderer.render(scene, camera);
});
var gModule=(function(){
return {
axises:function()
{
	let points=[];
	let axisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
	let markMaterial=new THREE.PointsMaterial({color:0x00ff00,size:0.2});
	//	x-axis
	points.push( new THREE.Vector3(-w/2,0,0));
	points.push( new THREE.Vector3(w/2,0,0));
	let xGeometry = new THREE.BufferGeometry().setFromPoints( points );
	let xAxis = new THREE.Line(xGeometry, axisMaterial);
	points.length=0;
	for(let i=-a;i<=a;i+=1){
		points.push(new THREE.Vector3(i,0,0));
	}
	let pointGeometry=new THREE.BufferGeometry().setFromPoints(points);
	let marks=new THREE.Points(pointGeometry,markMaterial);
	scene.add(marks);
	points.length=0;
	//	y-axis
	points.push(new THREE.Vector3(0,-h/2,0));
	points.push(new THREE.Vector3(0,h/2,0));
	let yGeometry = new THREE.BufferGeometry().setFromPoints( points );
	let yAxis = new THREE.Line(yGeometry, axisMaterial);
	points.length=0;
	for(let i=-b;i<=b;i++){
		points.push(new THREE.Vector3(0,i,0));
	}
	pointGeometry=new THREE.BufferGeometry().setFromPoints(points);
	marks=new THREE.Points(pointGeometry,markMaterial);
	scene.add(marks);
	scene.add(xAxis);
    scene.add(yAxis);
    renderer.render(scene, camera);
},
archimedian:function(){
	alert('archimedian is started');
	var rayMaterial=new THREE.LineBasicMaterial({ color: 0x0000ff });
	var pointMaterial=new THREE.PointsMaterial({color:0xff0000,size:0.1});
	let k=3;
	//	duration of animation in ms
	let duration=10000;
	let rotationInterval=100;
	var N=Math.round(duration/rotationInterval);
	var delta=2*Math.PI*k/N;
	var r=Math.min(a,b);
	var x=r,y=0,phi=0;
	var i=1;
	//	draw initial ray
	let points=[];
	points.push(new THREE.Vector3(0,0,0));
	points.push(new THREE.Vector3(x,y,0));
	var rayGeometry=new THREE.BufferGeometry().setFromPoints(points);
	points.length=0;
	moved.push(new THREE.Vector3(0,0,0));
	pointGeometry=new THREE.BufferGeometry().setFromPoints(moved);
	var ray=new THREE.Line(rayGeometry,rayMaterial);
	var movedPoint=new THREE.Points(pointGeometry,pointMaterial);
	scene.add(ray);
	scene.add(movedPoint);
	renderer.render(scene,camera);
	let timerId=setInterval(function rotation(){
		//	Remove previous ray from the scene
		scene.remove(ray);
		//	ellipsoide of rotation
		phi=phi+delta;
		//	x=a-2*a*i/callsNum;
		x=r*Math.cos(phi);
		y=r*Math.sin(phi);
		//	update points
		points.length=0;
		points.push(new THREE.Vector3(0,0,0));
		points.push(new THREE.Vector3(x,y,0));
		rayGeometry.setFromPoints(points);
		//	redraw ray
		ray=new THREE.Line(rayGeometry,rayMaterial);
		scene.add(ray);
		points.length=0;
		//	redraw point
		moved.push(new THREE.Vector3(x*i/N,y*i/N,0));
		pointGeometry.setFromPoints(moved);
		movedPoint=new THREE.Points(pointGeometry,pointMaterial);
		scene.add(movedPoint);
		renderer.render(scene,camera);
		//	next call (not in use)
		i+=1;	
		},rotationInterval);
	//  periodic call (not in use)
	setTimeout(() => { clearInterval(timerId); alert('ArchimedeanSpiral: animation is stopped'); alert('phi='+phi);}, duration);
}
}	//	return
}});
