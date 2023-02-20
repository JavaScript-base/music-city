import * as Three from 'three';
import { City } from './city';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Entity {
    constructor() {
        this.analyser = null;
        this.audioCtx = new AudioContext();
        this.source = null;
        this.analyser = null;
        this.loaded = false;
        this.city = null;
        this.musicCanPlay = false;
        // this.initCity();
    }

    // 初始化音乐
    async initMusic(url) {
        this.source = this.audioCtx.createBufferSource();
        this.analyser = this.audioCtx.createAnalyser();

        return fetch(url)
        .then( (response) => {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
            this.audioCtx.decodeAudioData(arrayBuffer, (decodedData) => {
                this.source.buffer = decodedData;
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioCtx.destination);
            });``
            this.musicCanPlay = true;
            console.log("音乐已经就绪");
        });
    }

    playMusic() {
        if(this.musicCanPlay) {
            this.source.start(0);
        } else {
            alert("音乐尚未就绪")
        }
    }

    //初始化模型
    initCity = async () => {
        const canvas = document.getElementById("webgl");
    
        const scene = new Three.Scene();

        const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 100, 1000000);
        camera.position.set(-10000, 5000, 18000);

        // camera.lookAt(200, 200, 5000);

        scene.add(camera);
    
        // 添加相机控件
        const orbitControls = new OrbitControls(camera, canvas);
    
        // 设置属性
        // 是否有惯性
        orbitControls.enableDamping = true;
        orbitControls.enableZoom = true;
        orbitControls.minDistance = 2000;
        orbitControls.maxDistance = 25000;
        orbitControls.maxPolarAngle = Math.PI/ 2 - 0.1;
    
        // 添加环境光
        const ambientLight = new Three.AmbientLight(0xadadad)
        scene.add(ambientLight);
        // 添加平行光
        const directionLight = new Three.DirectionalLight(0xffffff);
        directionLight.position.set(0, 0, 0);
        scene.add(directionLight);
    
        // const boxGeo = new Three.BoxGeometry(1,1,1);
        // const boxMesh = new Three.MeshLambertMaterial({color: 0xff0000});
        // scene.add(new Three.Mesh(boxGeo, boxMesh));
    
        const renderer = new Three.WebGLRenderer({ canvas })
    
        renderer.setSize(window.innerWidth, window.innerHeight)
    
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
        renderer.setClearColor(new Three.Color(0x000000), 1)
    
        // const axesHelper = new Three.AxesHelper( 1000 );
        // scene.add( axesHelper );
    
        this.city = new City(scene, camera);

        this.loaded = await this.city.loadCity();

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        const clock = new Three.Clock();
        let frequencyData
        const start = () => {
            if(this.analyser && clock) {
                frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
                this.analyser.getByteFrequencyData(frequencyData);
                this.city.start(clock.getDelta(), frequencyData);
            }
            orbitControls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(start);
        }
        
        if(this.loaded) start();

        return new Promise((resolve, reject) => {
            if(this.loaded === true) {
                console.log("模型已经就绪");
                resolve(true)
            }
            reject(false)
        })
    }
}
