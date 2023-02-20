import {
  AssetType,
  BackgroundMode,
  Camera,
  CullMode,
  GLTFResource,
  Matrix,
  MeshRenderer,
  PrimitiveMesh,
  SkyBoxMaterial,
  TextureCube,
  Transform,
  Vector3,
  WebGLEngine,
  WebGLMode,
} from 'oasis-engine';
import { OrbitControl } from 'oasis-engine-toolkit';
import * as dat from 'dat.gui';
import { Mirror } from './mirror';
import { ClipShader } from './clipShader';

export function createOasis() {
  const engine = new WebGLEngine('canvas', {
    alpha: true,
    webGLMode: WebGLMode.WebGL1,
  });
  engine.canvas.resizeByClientSize();

  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();
  const cameraEntity = rootEntity.createChild('camera');
  const camera = cameraEntity.addComponent(Camera);
  cameraEntity.transform.setPosition(0, 0, 15);
  // @ts-ignore
  const control = cameraEntity.addComponent(OrbitControl);
  // @ts-ignore
  control.minDistance = 3;
  camera.scene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);

  const background = scene.background;
  background.mode = BackgroundMode.Sky;
  const sky = background.sky;
  const skyMaterial = new SkyBoxMaterial(engine);
  skyMaterial.shader = ClipShader.createSkyboxShader();
  sky.material = skyMaterial;
  sky.mesh = PrimitiveMesh.createCuboid(engine, 1, 1, 1);

  const mirrorEntity = rootEntity.createChild('mirror');
  const mirror = mirrorEntity.addComponent(Mirror);
  mirrorEntity.transform.setPosition(-3.5, 0.5, 0);
  mirrorEntity.transform.setRotation(0, 0, -90);
  createGui(mirrorEntity.transform);
  mirror.init(4, 4, camera);

  engine.resourceManager
    .load<TextureCube>({
      urls: [
        'https://gw.alipayobjects.com/mdn/rms_475770/afts/img/A*Gi7CTZqKuacAAAAAAAAAAABkARQnAQ',
        'https://gw.alipayobjects.com/mdn/rms_475770/afts/img/A*iRRMQIExwKMAAAAAAAAAAABkARQnAQ',
        'https://gw.alipayobjects.com/mdn/rms_475770/afts/img/A*ZIcPQZo20sAAAAAAAAAAAABkARQnAQ',
        'https://gw.alipayobjects.com/mdn/rms_475770/afts/img/A*SPYuTbHT-KgAAAAAAAAAAABkARQnAQ',
        'https://gw.alipayobjects.com/mdn/rms_475770/afts/img/A*mGUERbY77roAAAAAAAAAAABkARQnAQ',
        'https://gw.alipayobjects.com/mdn/rms_475770/afts/img/A*ilkPS7A1_JsAAAAAAAAAAABkARQnAQ',
      ],
      type: AssetType.TextureCube,
    })
    .then((cubeMap) => {
      // Load glTF
      engine.resourceManager
        .load<GLTFResource>(
          'https://gw.alipayobjects.com/os/bmw-prod/150e44f6-7810-4c45-8029-3575d36aff30.gltf'
        )
        .then((gltf) => {
          const { defaultSceneRoot } = gltf;

          rootEntity.addChild(defaultSceneRoot);

          const entities: Array<MeshRenderer> = [];
          defaultSceneRoot.getComponentsIncludeChildren(MeshRenderer, entities);
          entities.forEach((renderer) => {
            const material = renderer.getMaterial();
            if (material) {
              material.renderState.depthState.enabled = true;
              material.renderState.rasterState.cullMode = CullMode.Back;
            }
          });

          defaultSceneRoot.transform.setPosition(0, 1, 0);
          defaultSceneRoot.transform.setRotation(90, 0, 0);

          const clone = defaultSceneRoot.clone();
          clone.transform.setPosition(2, 1, 0);
          rootEntity.addChild(clone);

          const clone2 = defaultSceneRoot.clone();
          clone2.transform.setPosition(0, -3, 1);
          rootEntity.addChild(clone2);
        });

      scene.ambientLight.specularTexture = cubeMap;
      skyMaterial.textureCubeMap = cubeMap;
      engine.run();
    });
}

function createGui(transform: Transform) {
  const gui = new dat.GUI();
  const folder = gui.addFolder('rotate mirror');
  const tmpMatrix = new Matrix();
  const axis = new Vector3(0, 1, 0);
  const originPos = transform.position.clone();
  const orginRot = transform.rotation.clone();
  folder.add({ angle: 0 }, 'angle', 0, 180, 1).onChange((v) => {
    transform.setPosition(originPos.x, originPos.y, originPos.z);
    transform.setRotation(orginRot.x, orginRot.y, orginRot.z);

    transform.rotateByAxis(axis, -v, false);

    rotateByAxis(axis, v, tmpMatrix);
    Vector3.transformNormal(transform.position, tmpMatrix, transform.position);
  });
}

function rotateByAxis(axis: Vector3, angle: number, out: Matrix) {
  Vector3.normalize(axis, axis);
  const degree = (angle * Math.PI) / 180;
  const oe = out.elements;
  const cos = Math.cos(degree);
  const sin = Math.sin(degree);
  const one_minus_cos = 1 - cos;

  oe[0] = axis.x * axis.x * one_minus_cos + cos;
  oe[1] = axis.x * axis.y * one_minus_cos - axis.z * sin;
  oe[2] = axis.x * axis.z * one_minus_cos + axis.y * sin;
  oe[3] = 0;
  oe[4] = axis.y * axis.x * one_minus_cos + axis.z * sin;
  oe[5] = axis.y * axis.y * one_minus_cos + cos;
  oe[6] = axis.y * axis.z * one_minus_cos - axis.x * sin;
  oe[7] = 0;
  oe[8] = axis.z * axis.x * one_minus_cos - axis.y * sin;
  oe[9] = axis.z * axis.y * one_minus_cos + axis.x * sin;
  oe[10] = axis.z * axis.z * one_minus_cos + cos;
  oe[11] = oe[12] = oe[13] = oe[14] = 0;
  oe[15] = 1;
}
