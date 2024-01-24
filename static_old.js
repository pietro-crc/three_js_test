import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js";
import { ImprovedNoise } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/math/ImprovedNoise.js";
import getStarfield from "./src/getStarfield.js";

var scene, camera, renderer;

let LINE_COUNT = 1000;
let geom = new THREE.BufferGeometry();
geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6*LINE_COUNT), 3));
geom.setAttribute("velocity", new THREE.BufferAttribute(new Float32Array(2*LINE_COUNT), 1));
let pos = geom.getAttribute("position");
let pa = pos.array;
let vel = geom.getAttribute("velocity");
let va = vel.array;

function star() {
    starGeo = new THREE.Geometry();
    for(let i=0;i<6000;i++) {
    let star = new THREE.Vector3(
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 300
  );
  starGeo.vertices.push(star);
    }
    let sprite = new THREE.TextureLoader().load( '../png/circle.jpg' );
 let starMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.7,
  map: sprite
});
stars = new THREE.Points(starGeo,starMaterial);
scene.add(stars);
}   


function star1() {

        // Parametri scena

        // Geometria e materiale stelle
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(10000 * 3); 
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.4
        });

        // Punti
        const stars = new THREE.Points(geometry, material);
        scene.add(stars);

        // Posizioni casuali fisse
        generateStarsPositions(); 

        // Luce ambientale


        // Rendering statico
        function render() {
        renderer.render(scene, camera);  
        }

        // Genera posizioni casuali unicamente
        function generateStarsPositions() {

        for(let i = 0; i < positions.length; i+=3) {

            const x = Math.random() * 1000 - 500;
            const y = Math.random() * 1000 - 500; 
            const z = Math.random() * 1000 - 500;

            positions[i] = x;
            positions[i+1] = y; 
            positions[i+2] = z;

  }

  geometry.attributes.position.needsUpdate = true;

}
    
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 500);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    for (let line_index= 0; line_index < LINE_COUNT; line_index++) {
        var x = Math.random() * 400 - 200;
        var y = Math.random() * 200 - 100;
        var z = Math.random() * 500 - 100;
        var xx = x;
        var yy = y;
        var zz = z;
        //line start
        pa[6*line_index] = x;
        pa[6*line_index+1] = y;
        pa[6*line_index+2] = z;
        //line end
        pa[6*line_index+3] = xx;
        pa[6*line_index+4] = yy;
        pa[6*line_index+5] = zz;

        va[2*line_index] = va[2*line_index+1]= 0;
    }
    //debugger;
    let mat = new THREE.LineBasicMaterial({color: 0xffffff});
    let lines = new THREE.LineSegments(geom, mat);
    scene.add(lines);

    window.addEventListener("resize", onWindowResize, false);
    animate_wharp();
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
let acceleration = 0.00295;
let starsCreated = false;
let starsCreated1 = true;
let textElement = document.getElementById('ature');

let animationId = null;


const sunLight = new THREE.DirectionalLight(0xffffff);


const loader = new THREE.TextureLoader();


const geometry1 = new THREE.IcosahedronGeometry(1,12);
const material1 = new THREE.MeshStandardMaterial({
    map: loader.load("heart_map.jpg"),
 
});
const cube = new THREE.Mesh(geometry1, material1);
//aggiungere altre mesh alla terra per renderla realistica 


const earth_g = new THREE.Group();
earth_g.rotation.z = -23.4 *Math.PI/180;
//scene.add(earth_g); per renderizzare la terra

earth_g.add(cube);


const light_m1 = new THREE.MeshBasicMaterial({
  
    map: loader.load("/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
  })
  
  const light_m = new THREE.Mesh(geometry1, light_m1);
  
  earth_g.add(light_m);
  
  
  const cloud = new THREE.MeshStandardMaterial({
      map: loader.load("/05_earthcloudmaptrans.jpg"),
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    }
   
  );
  
  const cloud_mesh = new THREE.Mesh(geometry1,cloud);
  earth_g.add(cloud_mesh);
  
  cloud_mesh.scale.setScalar(1.01);
  
  
  
  function get_aura({rimHex = 0x0088ff, facingHex = 0x000000} = {}) {
    const uniforms = {
      color1: { value: new THREE.Color(rimHex) },
      color2: { value: new THREE.Color(facingHex) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 4.0 },
    };
    const vs = `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    
    varying float vReflectionFactor;
    
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    
      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    
      vec3 I = worldPosition.xyz - cameraPosition;
    
      vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
    
      gl_Position = projectionMatrix * mvPosition;
    }
    `;
    const fs = `
    uniform vec3 color1;
    uniform vec3 color2;
    
    varying float vReflectionFactor;
    
    void main() {
      float f = clamp( vReflectionFactor, 0.0, 1.0 );
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
    }
    `;
    const fresnelMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending,
      // wireframe: true,
    });
    return fresnelMat;
  }
 
  
  
  const aura_mesh = new THREE.Mesh(geometry1,get_aura());


  earth_g.add(aura_mesh);
  
  
  aura_mesh.scale.setScalar(1.02);



window.addEventListener("wheel", function(event){
    // farlo ma con uyn click del mouse , più efficace 
    if (event.deltaY > 0) {
        acceleration = 0.0000295;

        setTimeout(function() {
            acceleration = 0.00295; // Sostituisci con il valore originale di acceleration
        }, 4500);
        // Rimuovi l'oggetto esistente
        textElement.classList.add('fadeOut');

        setTimeout(function() {
            textElement.style.display = 'none';
        }, 1000);


        // Crea un nuovo oggetto
        //let geometry = new THREE.BoxGeometry(1, 1, 1);
        //let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        //let cube = new THREE.Mesh(geometry, material);

        
        // Aggiungi il nuovo oggetto alla scena
        scene.add(sunLight);
        sunLight.position.set(-2, 0.5, 0);

        //sunLight.position.z -=700;

        scene.add(earth_g);
        function animate2(){
            requestAnimationFrame(animate2);
            //cube.rotation.x += 0.01;
            cube.rotation.y += 0.000004;
            light_m.rotation.y += 0.000004;
            cloud_mesh.rotation.y += 0.000004;
            aura_mesh.rotation.y += 0.000004;
           renderer.render(scene, camera);
        }
        animate2();
        
        

        earth_g.position.z -= 700
        this.setTimeout(function(){
            for (let i = 0 ; i < 600; i++){
            camera.position.z += -0.0001;

            
            }
            // funzione print per stampare la pagina rendeerizzata earth 

            //print("text_uno_earth_hovoer");


        }, 9000);

        this.setTimeout(function(){
            function stopAnimation() {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
            stopAnimation();
        }
        , 15000);
  
        if (starsCreated == true){
            star();
        }
        
        function animate() {
            
            requestAnimationFrame(animate);
        
            // Se il cubo esiste, modifica la sua posizione z
            if (earth_g){
            if ( earth_g.position.z < camera.position.z - 10) { 
                
                if (earth_g.position.z > camera.position.z - 45){

                    earth_g.position.z += 0.1;
                }
                else{
                    earth_g.position.z += 0.8;
                }
                
                if (earth_g.position.z > camera.position.z - 100  ){

                    acceleration = 0.003;

                    
                    starsCreated = true;}
            }
            
            renderer.render(scene, camera);
        };
        if (starsCreated == true && starsCreated1 == true){
            const stars = getStarfield({numStars: 2000});
            scene.add(stars);
            stars.position.z = +200;
            starsCreated1 = false;

      
    }
    

 }animate(); 

}}
)


function animate_wharp() {
    for (let line_index= 0; line_index < LINE_COUNT; line_index++) {
        va[2*line_index] += 0.003; //bump up the velocity by the acceleration amount
        va[2*line_index+1] += acceleration;

        //pa[6*line_index]++;                       //x Start
        //pa[6*line_index+1]++;                     //y
        pa[6*line_index+2] += va[2*line_index];     //z
        //pa[6*line_index+3]++;                     //x End
        //pa[6*line_index+4]                        //y
        pa[6*line_index+5] += va[2*line_index+1];   //z

        if(pa[6*line_index+5] > 200) {
            var z= Math.random() * 200 - 100;
            pa[6*line_index+2] = z;
            pa[6*line_index+5] = z;
            va[2*line_index] = 0;
            va[2*line_index+1] = 0;
        }
    }
    pos.needsUpdate = true;
    renderer.render(scene,camera);
    animationId = requestAnimationFrame(animate_wharp);
    
}
init();

