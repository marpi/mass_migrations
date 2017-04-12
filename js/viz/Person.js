var Person = function() {

	var groupHolder;
	var material;

	var shapes = [];

	var scl = 0;
	var video, video2
	var intrael, terrainShader;
	var videoImage, videoImageContext, videoTexture
	var videoImageDepth, videoImageContextDepth, videoTextureDepth

	var outlinePoints, animateMesh, previousAnimateMesh, material;
	var readyToTrace=false;
	var imageEnabled=false;

	function init(){

		//init event listeners
		events.on("update", update);
		events.on("onBeat", onBeat);


		groupHolder = new THREE.Object3D();
		VizHandler.getVizHolder().add(groupHolder);

		if(imageEnabled){
			videoImage = document.createElement( 'canvas' );
			videoImage.width = 512//640/20;
			videoImage.height = 512//480/10;

			videoImageContext = videoImage.getContext( '2d' );
			// background color if no video present
			videoImageContext.fillStyle = '#000000';
			videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

			videoTexture = new THREE.Texture( videoImage );
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.wrapS = videoTexture.wrapT = THREE.RepeatWrapping;
		}
		
		videoImageDepth = document.createElement( 'canvas' );
		videoImageDepth.width = 50;
		videoImageDepth.height = 34//48;

		videoImageContextDepth = videoImageDepth.getContext( '2d' );
		// background color if no video present
		videoImageContextDepth.fillStyle = '#000000';
		videoImageContextDepth.fillRect( 0, 0, videoImageDepth.width, videoImageDepth.height );

		videoTextureDepth = new THREE.Texture( videoImageDepth );
		videoTextureDepth.minFilter = THREE.LinearFilter;
		videoTextureDepth.magFilter = THREE.LinearFilter;
		
		movieMaterial = new THREE.MeshBasicMaterial( {  
			//map: videoTexture,
			emissive: 0xFFFFFF,
			color: 0xFFFFFF ,
			//shading: THREE.FlatShading, 
			side:THREE.DoubleSide,
			reflectivity:1,
			envMap: Assets.textureCube(),
		} );//, shading: THREE.FlatShading
		movieMaterialDepth = new THREE.MeshBasicMaterial( { map: videoTextureDepth, shading: THREE.FlatShading } );
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(64,48),movieMaterial)
		plane.position.x=+50
		//plane.scale.y=-1;
		//groupHolder.add(plane)

		plane.rotation.z=-Math.PI/2

		var planeDepth = new THREE.Mesh(new THREE.PlaneGeometry(64,48),movieMaterialDepth)
		planeDepth.position.x=-50
		//groupHolder.add(planeDepth)

		planeDepth.rotation.z=-Math.PI/2

		//material = new THREE.MeshBasicMaterial( { envMap: VizHandler.getCubeCameras()[1].renderTarget,reflectivity:.8, transparent:true,color:0xffffff } );//,shading: THREE.FlatShading, blending: THREE.AdditiveBlending
		material = new THREE.MeshBasicMaterial( { 
			envMap: Assets.textureCube(),
			reflectivity:1, 
			opacity:1, 
			transparent:true,
			color:0xffffff,
			emissive:0xffffff,
			shading: THREE.FlatShading, 
			//blending: THREE.AdditiveBlending, 
			//transparent:true,
			side:THREE.DoubleSide
		} );//,shading: THREE.FlatShading, blending: THREE.AdditiveBlending
		//material = movieMaterial;

		var uri="http://127.0.0.1:6661";
		if(window.localStorage) uri = localStorage.getItem("uri") ? localStorage.getItem("uri"):uri;
		intrael = new Intrael(uri);
		intrael.addListener("data",process);	
		intrael.addListener("error",function(){
		    if(imageEnabled)video=null;
		    video2=null;
		    window.setTimeout(function() { intrael.start(); }, 3000);
		});

		window.setTimeout(function(){intrael.start();},0);
		window.setTimeout(function() { sampleImgs(); }, 1000);

		window.addEventListener('mousedown', function (e) {
	        readyToTrace=true;
	    }, false);

	}
	function sampleImgs(){
	    video=document.querySelector("#stream");
	    video2=document.querySelector("#stream2");
	}

	function process(e){
		//console.log(e)
	    if(imageEnabled){
	    	if(!video){
		        video=document.querySelector("#stream");
		        video.onload = function () {
					//videoImageContext.drawImage( video, 0, 0 );
				}
		        video.src=intrael.uri+"/21"+Date.now();
		    }
		}
	    if(!video2){
	        video2=document.querySelector("#stream2");
	        video2.onload = function () {
				//videoImageContextDepth.drawImage( video2, 0, 0 );
			}
	        video2.src=intrael.uri+"/11"+Date.now();
	    }   
	}


    function animatedShape(){
		if(animateMesh && personVisible()){

			if(readyToTrace){
				readyToTrace=false;
			}

			groupHolder.remove( animateMesh );

			if(Math.random()<.04||previousAnimateMesh){

				if(!previousAnimateMesh){
					previousAnimateMesh=animateMesh
				}else{
					Items.addItem(animateMesh,previousAnimateMesh)
					previousAnimateMesh=null;
				}
			}else{
				Assets.destroy(animateMesh)
				animateMesh=null;
			}
			
		}

		var width=videoImageDepth.width
		var height=videoImageDepth.height
		var resize ={x:1,y:1};

		var imgd = videoImageContextDepth.getImageData(0,0, width, height);
        boxBlurCanvasRGB( videoImageContextDepth,imgd, 0,0, width, height,.1, 1 );
		var pix = imgd.data;
 
 		var scale=12;
	    var size = width * height;
	    var data = new Float32Array( size );
	    var j=0;
	    var endPos=10.5
	    var top=-1000
	    for (var i = 0; i<pix.length; i +=4) {
	        var all = pix[i]+pix[i+1]+pix[i+2];
	        var scaled=-all/(scale)
	        if(scaled<-30){
	        	scaled+=70
	        }else{
	        	scaled=endPos
	        }
	        data[j++] = scaled
	        if(scaled>top)top=scaled;
	    }

	     
	    var PLANE_WIDTH=64;
	    var PLANE_HEIGHT=48;
		var geometry = new THREE.PlaneGeometry( PLANE_WIDTH,PLANE_HEIGHT,width-1,height-1 );
		/*var tessellateModifier = new THREE.TessellateModifier( 4 );

		for ( var i = 0; i < 2; i ++ ) {
			tessellateModifier.modify( geometry );
		}*/

		var lastGood={x:0,y:0,z:0}
		//console.log(data[0])
		//1426

		for (var i = 0; i < geometry.vertices.length; i++) {
         	geometry.vertices[i].z = data[i]
	        /*//if(Math.random()<.1)geometry.vertices[i].z	+=5+Math.random()*7;
         	if(data[i]<=0){
         		//if(Math.abs(geometry.vertices[i].x,lastGood.x)<20){
	         		geometry.vertices[i].x=lastGood.x
	         		geometry.vertices[i].y=lastGood.y
	         		geometry.vertices[i].z=lastGood.z-15.5
         		//}

         	}else{
         		//lastGood.x=geometry.vertices[i].x
         		//lastGood.y=geometry.vertices[i].y
         		lastGood.z=geometry.vertices[i].z
         	}*/
			//geometry.vertices[i].z=Math.random()*10//Math.sqrt(geometry.vertices[i].x*geometry.vertices[i].x+geometry.vertices[i].y*geometry.vertices[i].y)*112//*(1-Math.random()*.1)
		};



		for (var i = 0; i < geometry.faces.length; i++) {
			var id=Math.floor(i/2+i/(width*60/(64/2)));//-2;
			if(id<0)id=0
			if(geometry.vertices[id].z==endPos){
				geometry.faces[i].materialIndex=1;
			}
		}

		/*
		// faces: 1426
		// vertices: 767
		var i=0;
		for (var _x = 0; _x < PLANE_WIDTH; _x++) {
			for (var _y = 0; _y < PLANE_HEIGHT; _x++) {
				if(_x=0||_y==0||_x==PLANE_WIDTH-1||_y==PLANE_HEIGHT-1){
					var id=i;
					//if(geometry.vertices[id].z==0){
						//geometry.faces[i].materialIndex=1;
					//}
				}
				i++
			};		
		};
		*/



		//for (var i = 0; i < geometry.faces.length; i++) {
         	//geometry.faces[i].z = data[i];
			//geometry.vertices[i].z=Math.random()*10//Math.sqrt(geometry.vertices[i].x*geometry.vertices[i].x+geometry.vertices[i].y*geometry.vertices[i].y)*112//*(1-Math.random()*.1)
		//};

		//console.log(geometry)

		geometry.verticesNeedUpdate = true;
		geometry.normalsNeedUpdate=true;
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		//animateMesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ material, new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } ) ] );
		animateMesh=new THREE.Mesh(geometry,
			new THREE.MeshFaceMaterial([
				movieMaterial.clone(),
				new THREE.MeshBasicMaterial( { visible: false } )
			])
		);


	    if(top==endPos)animateMesh.visible=false;
	    //console.log(personVisible())
		/*animateMesh=THREE.SceneUtils.createMultiMaterialObject(
			geometry,[
				new THREE.MeshFaceMaterial([
					movieMaterial.clone(),
					new THREE.MeshBasicMaterial({ 
						//wireframe: true,
						transparent:true,
						opacity:0
					})
				])//,
				//material.clone()
			]
		);*///material


		//var materials =[movieMaterial,material];
		//animateMesh=new THREE.Mesh(geometry,new THREE.MeshFaceMaterial( materials ));//material

		//mesh.rotation.set( rx, ry, rz );
		var s=1
		animateMesh.scale.set( -s*resize.x, s*resize.y, s );
		//animateMesh.scale.x=-animateMesh.scale.x;
		//animateMesh.rotation.z=-Math.PI/2
		groupHolder.add( animateMesh );

		groupHolder.scale.x=groupHolder.scale.y=groupHolder.scale.z=10/height*32;

		imgd=null;
		geometry=null;
		pix=null;
		data=null;
	}

	function update() {
		if(ControlsHandler.fxParams.person){
			groupHolder.visible=true;
		}else{
			groupHolder.visible=false;
			return;
		}
		
		var time = Date.now();

		//groupHolder.rotation.y=Math.sin(time*.001)*.3
		//groupHolder.rotation.x=Math.sin(time*.00135)*.1
		if(imageEnabled){
			if(video)videoImageContext.drawImage( video, 0, 0, videoImage.width,videoImage.height );
			if ( videoTexture ) 
				videoTexture.needsUpdate = true;
		}

		if(video2)videoImageContextDepth.drawImage( video2, 0, 0, videoImageDepth.width,videoImageDepth.height );
		if ( videoTextureDepth ) 
			videoTextureDepth.needsUpdate = true;

		if(Math.random()<.5)animatedShape()

		//groupHolder.rotation.y += 0.01; 
		var gotoScale = AudioHandler.getVolume()*10*1.2 + 30*.5;
		scl += (gotoScale - scl)/3;
		groupHolder.scale.x = groupHolder.scale.y = groupHolder.scale.z = scl
	}

	function personVisible(){
		return animateMesh.visible
	}

	function onBeat(){

		var basic=[.5+ControlsHandler.fxParams.colorProgress*.5,ControlsHandler.fxParams.colorProgress*.5,(1-ControlsHandler.fxParams.colorProgress)*.5]
		material.color.setRGB(basic[0]+Math.random()/2,basic[1]+Math.random()/2,basic[2]+Math.random()/2);
	}

	return {
		init:init,
		update:update,
		onBeat:onBeat,
		personVisible:personVisible,
	};

}();