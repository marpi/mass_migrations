var Items = function() {

	var groupHolderLeft;
	var groupHolderRight;
	var material,materials,humanMaterials;

	var shapes = [];
	var spd = 0;
	var roz = 2000;

	var scl = 0;
	var itemsLeft=[];
	var itemsRight=[];

	function init(){

		//init event listeners
		events.on("update", update);
		events.on("onBeat", onBeat);


		groupHolderLeft = new THREE.Object3D();
		VizHandler.getVizHolder().add(groupHolderLeft);
		groupHolderRight = new THREE.Object3D();
		VizHandler.getVizHolder().add(groupHolderRight);
		
		//material = new THREE.MeshBasicMaterial( { envMap: VizHandler.getCubeCameras()[1].renderTarget,reflectivity:.8, transparent:true,color:0xffffff } );//,shading: THREE.FlatShading, blending: THREE.AdditiveBlending
		

		roz=6000;
		var MAX=150
		var gRoz=10;
		var geometries=[new THREE.TetrahedronGeometry( 20, 0),new THREE.TetrahedronGeometry( 20, 1),new THREE.IcosahedronGeometry( 20, 0),new THREE.TorusKnotGeometry( 10, 5, 10, 10)];
		for (var i = 0; i < geometries.length; i++) {
			for (var j = 0; j < geometries[i].vertices.length; j++) {
				geometries[i].vertices[j].x+=(Math.random()-.5)*gRoz;
				geometries[i].vertices[j].y+=(Math.random()-.5)*gRoz;
				geometries[i].vertices[j].z+=(Math.random()-.5)*gRoz;
			}
		};
		/*materials=[]
		for (var i = 0; i < 3; i++) {
			var material = new THREE.MeshBasicMaterial( { 
				envMap: Assets.textureCube(),reflectivity:1, 
				//opacity:.7,//.75,
				color:0xffffff*Math.random(), 
				//transparent:false,
				shading: THREE.FlatShading,
				blending: THREE.AdditiveBlending 
			} );// blending: THREE.AdditiveBlending
			materials.push(material)
		};*/
		/*humanMaterials=[]
		for (var i = 0; i < 3; i++) {
			var material = new THREE.MeshBasicMaterial( { 
				envMap: Assets.textureCube(),reflectivity:1, 
				opacity:.5,//.75,
				color:0xffffff*Math.random(), 
				transparent:false,
				shading: THREE.FlatShading,
				blending: THREE.AdditiveBlending 
			} );// blending: THREE.AdditiveBlending
			humanMaterials.push(material)
		};*/
		for (var i = 0; i < MAX; i++) {
			var material = new THREE.MeshBasicMaterial( { 
				envMap: Assets.textureCube(),reflectivity:1, 
				//opacity:.7,//.75,
				color:0xffffff*Math.random(), 
				//transparent:false,
				shading: THREE.FlatShading,
				blending: THREE.AdditiveBlending,
				side: THREE.DoubleSide
			} );// blending: THREE.AdditiveBlending
			var geom = geometries[Math.floor(Math.random()*geometries.length)].clone()
			var sphere = new THREE.Mesh(geom , material );
			while(Math.abs(sphere.position.x)<200||Math.abs(sphere.position.y)<10){
				sphere.position.x=-roz/2/2+Math.random()*roz/2;
				sphere.position.y=-roz/2+Math.random()*roz;
				sphere.position.z=-roz/2+Math.random()*roz;
			}
			sphere.scale.x=sphere.scale.y=sphere.scale.z=(Math.abs(sphere.position.x)+Math.abs(sphere.position.z))/400*Math.random()*3+10;
			groupHolderLeft.add( sphere );
			itemsLeft.push(sphere);

			var material2=material.clone()

			var sphere2 = new THREE.Mesh(geom , material2 );
			sphere2.position.x=-sphere.position.x;
			sphere2.position.y=sphere.position.y;
			sphere2.position.z=sphere.position.z;
			sphere2.scale.x=sphere2.scale.y=sphere2.scale.z=sphere.scale.z
			sphere2.scale.x=-sphere2.scale.x
			groupHolderRight.add( sphere2 );
			itemsRight.push(sphere2);
		};
		

	}

	function onBeat() {
		var basic=[ControlsHandler.fxParams.colorProgress*.75,ControlsHandler.fxParams.colorProgress*.75,(1-ControlsHandler.fxParams.colorProgress)*.5]
		for (var i = 0; i < groupHolderLeft.children.length; i++) {
			var childLeft=groupHolderLeft.children[i]
			var childRight=groupHolderRight.children[i]
			var rgb=[basic[0]+Math.random()/2,basic[1]+Math.random()/2,basic[2]+Math.random()/2]
			if(ControlsHandler.fxParams.black)rgb=[.2,.2,.2];

			if(ControlsHandler.fxParams.wireframe){
				childLeft.material.wireframe=true;
				childRight.material.wireframe=true;
			}else{
				childLeft.material.wireframe=false;
				childRight.material.wireframe=false;
			}

			if(childLeft.material.materials){
				childLeft.material.materials[0].color.setRGB(rgb[0],rgb[1],rgb[2]);
			}else if(childLeft.children.length==0){
				childLeft.material.color.setRGB(rgb[0],rgb[1],rgb[2]);
			}else {
				childLeft.children[1].material.color.setRGB(rgb[0],rgb[1],rgb[2]);
			}
			if(childRight.material.materials){
				childRight.material.materials[0].color.setRGB(rgb[0],rgb[1],rgb[2]);
			}else if(childRight.children.length==0){
				childRight.material.color.setRGB(rgb[0],rgb[1],rgb[2]);
			}else {
				childRight.children[1].material.color.setRGB(rgb[0],rgb[1],rgb[2]);
			}
		}
		
	}

	function update() {
		var time = Date.now();

		if(AudioHandler.getVolume()>.01){
			spd-=(spd-ControlsHandler.fxParams.animSpeed)/5;
		}else{
			spd-=spd/5;
		}
		var gotoScale = 1*AudioHandler.getVolume()*15+.5;
		scl += (gotoScale - scl)/3;

		if(ControlsHandler.fxParams.items){
			groupHolderLeft.visible=true;
			groupHolderRight.visible=true;
		}else{
			groupHolderLeft.visible=false;
			groupHolderRight.visible=false;
			return;
		}

		for (var i = 0; i < itemsLeft.length; i++) {
			var itemLeft=itemsLeft[i]
			var itemRight=itemsRight[i]

			itemLeft.rotation.x+=.01;
			itemRight.rotation.x+=.01;
			//item.position.x = Math.sin( time * 0.001 ) * 30;
			itemLeft.position.y = Math.sin( Math.abs(itemLeft.position.x)+time * 0.0011 ) * 60;//-100;
			itemLeft.position.y +=Math.sin(i+Math.abs(itemLeft.position.x))*800
			itemLeft.position.y *= ControlsHandler.fxParams.spreadProgress*(1+2*ControlsHandler.fxParams.waterProgress);
			itemLeft.position.y += -1400*ControlsHandler.fxParams.waterProgress
			itemRight.position.y=itemLeft.position.y;
			//item.position.z = Math.sin( time * 0.0012 ) * 30;
			//item.material.opacity = (AudioHandler.getVolume()-.1)*5

			if(!itemLeft.children.length){
				//item.rotation.x += Math.sin(i)/100;
				//item.rotation.y += Math.sin(i+.03)/100;
			}
			itemLeft.position.z+=spd
			if(itemLeft.position.z>roz/2){
				itemLeft.position.z-=roz;
			} else if(itemLeft.position.z<-roz/2){
				itemLeft.position.z+=roz;
			}

			itemRight.position.z=itemLeft.position.z;

			var j=i%8;
			var scales = (AudioHandler.getLevelsData()[j] * AudioHandler.getLevelsData()[j] + 0.05)*15;
			//scales=1
			//item.scale.z-=(item.scale.z-scales)/1;
			if(scales>0){
				itemLeft.scale.x-=(itemLeft.scale.x-scales)/5
				itemLeft.scale.y=itemLeft.scale.z=itemLeft.scale.x;

				itemRight.scale.x=-itemLeft.scale.x
				itemRight.scale.y=itemLeft.scale.y
				itemRight.scale.z=itemLeft.scale.z
			}
		};
		//groupHolder.rotation.y += 0.001; 
		//groupHolder.scale.x = groupHolder.scale.y = groupHolder.scale.z = 2;
		
	}

	function addItem(mesh,meshRight){
		if(!itemsLeft.length)return;

		var id=Math.floor(Math.random()*itemsLeft.length/2);



		var pos=itemsLeft[id].position.clone()
		var item = mesh;

		item.material.materials[1]=item.material.materials[1].clone();
		item.material.materials[0]=item.material.materials[0].clone();
		if(item.material.materials[0].map){
			item.material.materials[0].map=new THREE.Texture(item.material.materials[0].map.image);
			item.material.materials[0].map.needsUpdate=true;
		}
		/*alert(item.material)
		item.children[0].material=item.children[0].material.clone();
		item.children[1].material=item.children[1].material.clone();
		item.children[1].reflectivity=1
		item.children[0].material.map=new THREE.Texture(item.children[0].material.map.image);
		item.children[0].material.map.needsUpdate=true;*/
		item.position.x=pos.x
		item.position.y=pos.y
		item.position.z=pos.z
		groupHolderLeft.remove( itemsLeft[id] );
		Assets.destroy(itemsLeft[id], true)

		itemsLeft[id]=null;

		itemsLeft[id]=item
		groupHolderLeft.add( itemsLeft[id] );

		//

		var itemRight = meshRight
		itemRight.material.materials[1]=itemRight.material.materials[1].clone();
		itemRight.material.materials[0]=itemRight.material.materials[0].clone();
		if(itemRight.material.materials[0].map){
			itemRight.material.materials[0].map=new THREE.Texture(itemRight.material.materials[0].map.image);
			itemRight.material.materials[0].map.needsUpdate=true;		
		}
		itemRight.position.x=-pos.x
		itemRight.position.y=pos.y
		itemRight.position.z=pos.z
		groupHolderRight.remove( itemsRight[id] );
		Assets.destroy(itemsRight[id], true)

		itemsRight[id]=null;

		itemsRight[id]=itemRight
		groupHolderRight.add( itemsRight[id] );
	}

	return {
		init:init,
		update:update,
		onBeat:onBeat,
		addItem:addItem,
	};

}();