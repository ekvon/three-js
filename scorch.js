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
var kx = w / width;
var ky = h / height;
//	camera and scene creation
var camera = new THREE.PerspectiveCamera(theta, aspect, 0.01, -0.01);
camera.position.set(0, 0, Z);
camera.lookAt(0, 0, 0);
var scene = new THREE.Scene();
scene.background=new THREE.Color('black');

//	create area
var numSpacedPoints=16;
var deltaX=w/numSpacedPoints;
var spacedPoints=[];
for(i=0;i<numSpacedPoints;i++){
	let r=Math.random();
	spacedPoints.push(new THREE.Vector2(-w/2+i*deltaX,-h/4+r*h/2));
}
var numPoints=256;
const curve=new THREE.SplineCurve(spacedPoints);
const points=curve.getPoints(numPoints);
var material=new THREE.LineBasicMaterial({color:0x00ff00});
var geometry=new THREE.BufferGeometry().setFromPoints(points);
var lineObject=new THREE.Line(geometry,material);
scene.add(lineObject);
renderer.render(scene,camera);

function Tank(headColor){
	this.headColor=headColor;
	this.trackColor=0x888888;
	this.a=0.01*h;
	this.b=0.005*h;
	this.r=0.01*h;
	this.normal=new THREE.Vector2();
	this.trackCenter=new THREE.Vector2();
	this.headCenter=new THREE.Vector2();
	this.setPoints=function(point,tangent){
		this.normal=new THREE.Vector2(-tangent.y,tangent.x);
		this.normal.normalize();
		this.normal.multiplyScalar(this.b);
		point.add(this.normal);
		this.trackCenter=point;
		point.add(this.normal);
		this.headCenter=point;
	}
	//	Return track curve.
	//	Both arguments MUST be THREE.Vector2 instances.
	this.getTrack=function(){
		//	track curve
		const trackCurve=new THREE.EllipseCurve(this.trackCenter.x,this.trackCenter.y,this.a,this.b,0,2*Math.PI,this.normal.angle());
		const trackPoints=trackCurve.getPoints(64);
		const trackGeometry = new THREE.BufferGeometry().setFromPoints( trackPoints );
		const trackMaterial = new THREE.LineBasicMaterial( { color: this.trackColor } );
		//	Create the final object to add to the scene
		return new THREE.Line( trackGeometry, trackMaterial );
	}
	this.getHead=function(){
		//	head curve
		const headCurve=new THREE.EllipseCurve(this.headCenter.x,this.headCenter.y,this.a,this.a,0,Math.PI,this.normal.angle());
		const headPoints=headCurve.getPoints(64);
		const headGeometry = new THREE.BufferGeometry().setFromPoints( headPoints );
		const headMaterial = new THREE.LineBasicMaterial( { color: this.headColor } );
		//	Create the final object to add to the scene
		return new THREE.Line( headGeometry, headMaterial );
	}
}
//	create tank
var redTank=new Tank(0xff0000);
//	var duration=8192;
//	var interval=Math.round(duration/numPoints);
//	let timerId=setInterval(function rotation(){
//	},interval);
//  periodic call (not in use)
//	setTimeout(() => { clearInterval(timerId); alert('scorch: animation is stopped;i=' + i);}, duration);

//	integer coor. of red tank
var i=Math.round(Math.random()*numPoints);
var currPoint=curve.getPoint(i/numPoints);
var tangent=curve.getTangent(i/numPoints);

//	draw red tank at initial position
redTank.setPoints(currPoint,tangent);
var track=redTank.getTrack();
var head=redTank.getHead();
scene.add(track);
scene.add(head);
renderer.render(scene,camera);

//	save previous image of tank
var prevTrack=track;
var prevHead=head;
//	not in use
document.addEventListener("keydown", function(event){
	//	change red tank coord.
	if (event.code=='ArrowLeft'){
		if(0<i)
			i-=1;
	}
	else if(event.code=='ArrowRight'){
		if(i<numPoints)
			i+=1;
	}
	else if(event.code=='ArrowUp'){
		;
	}
	else if(event.code=='ArrowDown'){
		;
	}
	else{
		//	ignore input
		return;
	}
	//	remove previous image
	scene.remove(prevTrack);
	scene.remove(prevHead);
	//	draw red tank on new position
	currPoint=curve.getPoint(i/numPoints);
	tangent=curve.getTangent(i/numPoints);
	redTank.setPoints(currPoint,tangent);
	track=redTank.getTrack();
	head=redTank.getHead();
	scene.add(track);
	scene.add(head);
	renderer.render(scene,camera);
	prevTrack=track;
	prevHead=head;
});
