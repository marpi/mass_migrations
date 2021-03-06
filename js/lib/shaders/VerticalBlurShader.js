/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

THREE.VerticalBlurShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"v":        { type: "f", value: 1.0 / 512.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"uniform float v;",

		"varying vec2 v0;",
		"varying vec2 v1;",
		"varying vec2 v2;",
		"varying vec2 v3;",
		"varying vec2 v4;",
		"varying vec2 v5;",
		"varying vec2 v6;",
		"varying vec2 v7;",
		"varying vec2 v8;",
		"void main() {",

			"vUv = uv;",
			"v0 =  vec2(uv.x, uv.y - 4.0 * v);",
			"v1 =  vec2(uv.x, uv.y - 3.0 * v);",
			"v2 =  vec2(uv.x, uv.y - 2.0 * v);",
			"v3 =  vec2(uv.x, uv.y - 1.0 * v);",
			"v4 =  vec2(uv.x, uv.y);",
			"v5 =  vec2(uv.x, uv.y + 1.0 * v);",
			"v6 =  vec2(uv.x, uv.y + 2.0 * v);",
			"v7 =  vec2(uv.x, uv.y + 3.0 * v);",
			"v8 =  vec2(uv.x, uv.y + 4.0 * v);",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float v;",

		
		"varying vec2 v0;",
		"varying vec2 v1;",
		"varying vec2 v2;",
		"varying vec2 v3;",
		"varying vec2 v4;",
		"varying vec2 v5;",
		"varying vec2 v6;",
		"varying vec2 v7;",
		"varying vec2 v8;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 sum = vec4( 0.0 );",

			"sum += texture2D( tDiffuse, v0 ) * 0.051;",
			"sum += texture2D( tDiffuse, v1 ) * 0.0918;",
			"sum += texture2D( tDiffuse, v2 ) * 0.12245;",
			"sum += texture2D( tDiffuse, v3 ) * 0.1531;",
			"sum += texture2D( tDiffuse, v4 ) * 0.1633;",
			"sum += texture2D( tDiffuse, v5 ) * 0.1531;",
			"sum += texture2D( tDiffuse, v6 ) * 0.12245;",
			"sum += texture2D( tDiffuse, v7 ) * 0.0918;",
			"sum += texture2D( tDiffuse, v8 ) * 0.051;",

			"gl_FragColor = sum;",

		"}"

	].join( "\n" )

};
