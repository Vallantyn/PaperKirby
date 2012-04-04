<html>
    <head>
	<title>Paper Kirby</title>

	<meta charset="utf-8" />

	<script type="text/javascript" src="JS/glMatrix-0.9.5.min.js"></script>
	<script type="text/javascript" src="JS/webgl-utils.js"></script>
	<script type="text/javascript" src="JS/levels.js"></script>
	<?php //include("JS/Models/Models.php");?>
        <script type="text/javascript" src="JS/Models/Models.php"></script>
	<!--<script type="text/javascript" src="JS/Models/Portal.js"></script>
	<script type="text/javascript" src="JS/Models/Kirby.js"></script>-->
	<script type="text/javascript" src="JS/Colisions.js"></script>
        <script type="text/javascript" src="JS/Maths.js"></script>
	<script type="text/javascript" src="JS/Powers.js"></script>
	<script type="text/javascript" src="JS/miniMap.js"></script>

	<style type="text/css">
	    .touch {
		height: 44px;
		width: auto;
	    }
            
            .info {
                position: absolute;
                left: 10;
                top: 10;
                
                text-align: center;
                color: black;
                background: white;
                opacity: 0.4;
                
                border-radius: 10px;
                cursor: default;
            }
            
            .infoHidden {
                position: absolute;
                left: 10;
                top: 10;
                
                text-align: center;
                color: black;
                background: white;
                opacity: 0.4;
                
                border-radius: 10px;
                cursor: default;
                visibility: hidden;
            }

	    #canvas {
		position: absolute;
		z-index: -1;
	    }

	    #minicanvas {
		position: absolute;
		right: 10;
		bottom: 10;
	    }

	    body {
		font-family: 'Verdana';
		color: #FFF;
		font-size: 32;
		text-align: center;
	    }

	    footer {
		position: absolute;
		text-align: left;
		font-size: 18;
		left: 10;
		bottom: 10;
	    }
	</style>

	<script id="shader-fs" type="x-shader/x-fragment">
	    precision mediump float;

	    varying vec2 vTextureCoord;
	    varying vec3 vTransformedNormal;
	    varying vec4 vPosition;

	    uniform vec3 uAmbientColor;

	    uniform vec3 uPointLightingLocation;
	    uniform vec3 uPointLightingColor;

	    uniform sampler2D uSampler;

	    uniform bool uUseLighting;

	    void main(void) {
                vec3 lightWeighting;
                if (!uUseLighting) {
                    lightWeighting = vec3(1.0, 1.0, 1.0);
                } else {
                    vec3 lightDirection = normalize(uPointLightingLocation - vPosition.xyz);

                    float directionalLightWeighting = max(dot(normalize(vTransformedNormal), lightDirection), 0.0);
                    lightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;
                }
                vec4 fragmentColor;
                fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
                gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
	    }
	</script>

	<script id="shader-vs" type="x-shader/x-vertex">
	    attribute vec3 aVertexPosition;
	    attribute vec3 aVertexNormal;
	    attribute vec2 aTextureCoord;

	    uniform mat4 uMVMatrix;
	    uniform mat4 uPMatrix;
	    uniform mat3 uNMatrix;

	    varying vec2 vTextureCoord;
	    varying vec3 vTransformedNormal;
	    varying vec4 vPosition;


	    void main(void) {
		vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
		gl_Position = uPMatrix * vPosition;
		vTextureCoord = aTextureCoord;
		vTransformedNormal = uNMatrix * aVertexNormal;
	    }
	</script>

	<script type="text/javascript" src="JS/webgl.js"></script>
        
        <script type="text/javascript">
            
            function infoClick(e){
                console.log(e);
                if (e.target.id == "infoIcon") {
                    e.target.className += "Hidden";
                    document.getElementById("infoPanel").className = "info";
                } else if (e.target.id == "infoPanel") {
                    e.target.className += "Hidden";
                    document.getElementById("infoIcon").className = "info";
                }
            }
            
        </script>
    </head>
    <body onload="webGLStart();">
	<header>
            <div id="infoIcon" class="info" style="width: 44px; height: 44px;" onclick="infoClick(window.event);">
                i
            </div>
            <div id="infoPanel" class="infoHidden" style="width: 128px; height: 128px;" onclick="infoClick(window.event);">
                blah
            </div>
            
	    Paper Kirby
	</header>
	<div>
	    <canvas id="minicanvas"></canvas>
	</div>
<!--	<footer style="">
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/arrow_keys/computer_key_Arrow_Left_T.png" alt="←">
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/arrow_keys/computer_key_Arrow_Right_T.png" alt="←">
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/letters/computer_key_Q_T.png" alt="Q">
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/letters/computer_key_D_T.png" alt="D"> : Se déplacer <br>
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/large_keys/computer_key_Shift_T.png" alt="Maj"> : Courir <br>
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/letters/computer_key_Z_T.png" alt="Z">
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/arrow_keys/computer_key_Arrow_Up_T.png" alt="↑"> : Sauter <br>
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/letters/computer_key_A_T.png" alt="A">
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/computer_key_Ctrl_T.png" alt="Ctrl"> : Changer de Pouvoir <br>
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/letters/computer_key_E_T.png" alt="E">
	    <img class="touch" src="http://www.wpclipart.com/computer/keyboard_keys/smaller_keys/large_keys/computer_key_Space_bar_T.png" alt="Espace"> : Utiliser le Pouvoir
	</footer>-->
    </body>
</html>