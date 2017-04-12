/**
 *
 * Customized Vertical TiltShift 
 * 
 * Added H blur 
 * Added amount + brightness uniforms
 * 
 * @author alteredq / http://alteredqualia.com/
 * @author felixturner / airtight.cc
 *
 */

THREE.VerticalTiltShiftShader = {

	uniforms: {

		"tDiffuse": 	{ type: "t", value: null },
		"focusPos": 	{ type: "f", value: 0.35 }, 	// focus Y position 0 = bottom, 1 = top
		"amount": 		{ type: "f", value: 1 }, 		// amount of blur
		"brightness": 	{ type: "f", value: 0.5 } 		// 0.5 = no brightness change

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float focusPos;",
		"uniform float amount;",
		"uniform float brightness;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 sum = vec4( 0.0 );",
			"float vv = abs( focusPos - vUv.y ) * amount;",//0.0006+

			//V blur
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * vv ) ) * 0.051 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * vv ) ) * 0.0918 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * vv ) ) * 0.12245 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * vv ) ) * 0.1531 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * vv ) ) * 0.1531 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * vv ) ) * 0.12245 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * vv ) ) * 0.0918 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * vv ) ) * 0.051 * brightness;",

			//H blur
			"sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * vv , vUv.y ) ) * 0.051 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * vv, vUv.y  ) ) * 0.0918 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * vv, vUv.y  ) ) * 0.12245 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * vv, vUv.y  ) ) * 0.1531 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * vv, vUv.y ) ) * 0.1531 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * vv, vUv.y  ) ) * 0.12245 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * vv, vUv.y  ) ) * 0.0918 * brightness;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * vv, vUv.y ) ) * 0.051 * brightness;",

			"gl_FragColor = sum;",

		"}"

	].join( "\n" )

};
