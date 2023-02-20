import { loadFBX, mix } from '../util/index';
import * as Three from 'three';
import { SurroundLine } from '../effect/surroundLine.js'
import { Background } from '../effect/background.js'

export class City {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.tweenRotation = null;
        this.tweenPosition = null;
        this.background = null;
        this.loaded = false;
        this.beattime = {
            value: []
        };
        this.height = {
            value: 5
        };
        this.time = {
            value: 0
        };

        this.flag = false;

        this.top = {
            value: 0
        }
        this.loadCity();
        this.meshList = [];
        this.lineList = [];
    }

    async loadCity() {
        // 加载模型并且渲染到画布
        return new Promise(((resolve, reject) => {
            loadFBX('/music-city/assets/uploads_files_BusGameMap.fbx').then((object) => {
                this.loaded = true;
                object.children.forEach((child) => {
                    if(child.isMesh) {
                        const surroundLine = new SurroundLine(child, this.scene, this.height, this.time);
                        if(surroundLine.mesh.position.y <= 0) {
                            this.meshList.push(surroundLine.mesh)
                        }
                        // if(surroundLine.line.position.y <=0 ) {
                        //     this.lineList.push(surroundLine.line);
                        // } 
                    }
                })
                this.initEffectBackground('/music-city/assets/black-bg.png')
                resolve(true);
            }).catch((error) => reject(error))
        }))
    }

    // 模型上的效果
    initEffectBackground(url) {
        this.background = new Background(this.scene, url);
    }

    addClick() {
        // 解决点击事件和拖拽的冲突
        const canvas = document.getElementById("webgl")
        let flag = true;
        canvas.onmousedown = () => {
            flag = true;
            document.onmousemove = () => {
                flag = false;
            }
        }
        canvas.onmouseup = (event) => {
            if(flag) {
                this.clickEvent(event)
            }
            canvas.onmousemove = null;
        }
    }

    start(delta, frequencyData) {
        if(this.tweenRotation && this.tweenPosition) {
            this.tweenPosition.update();
            this.tweenRotation.update();
        }
        this.height.value += 0.4;

        this.rain && this.rain.animation();
        this.snow && this.snow.animation();

        let STEP = 10;
        const averageFrequencyData = [];
        for (let i = 0; i< frequencyData.length; i += STEP) {
            let sum = 0;
            for(let j = i; j < i + STEP; j++) {
                sum += frequencyData[j] || 0;
            }
            averageFrequencyData.push(sum / STEP);
        }
       
        this.beattime.value = averageFrequencyData;

       if(this.meshList.length > 0) {
            const targe = averageFrequencyData.findIndex(item => item !== 0 );
            if(targe > -1) {
                this.meshList.forEach((item, index) => {
                    item.scale.z = mix(1, 2, averageFrequencyData[index]|| 0) < 0 ? 1 : mix(1, 2, averageFrequencyData[index]);
                })
                // this.lineList.forEach((item, index) => {
                //     if(item) {
                //         item.scale.z = mix(1, 2, averageFrequencyData[index] || 0) < 0 ? 1 : mix(1, 2, averageFrequencyData[index]);
                //     }
                // })
            }
       }
        this.time.value += delta;
        if(this.top.value > 15 || this.top.value < 0) {
            this.flag = !this.flag
        }
        this.top.value += this.flag ? 0.8 : -0.8;

        if(this.height.value > 160) {
            this.height.value = 5;
        }
    }
}