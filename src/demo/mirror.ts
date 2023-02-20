import {
  BackgroundMode,
  BaseMaterial,
  BlendFactor,
  Camera,
  CameraClearFlags,
  Color,
  CompareFunction,
  CullMode,
  Layer,
  Matrix,
  MeshRenderer,
  PrimitiveMesh,
  Renderer,
  Script,
  StencilOperation,
  UnlitMaterial,
  Vector3,
  Vector4,
} from 'oasis-engine';
import { Entity } from 'oasis-engine';

export class Mirror extends Script {
  /** 用来设置相机culling mask */
  private static _count = 1;

  private _layer: Layer;

  private _stencilEntity: Entity | undefined;
  /** 平面初始化的法线向量 */
  private _initNormal = new Vector3(0, 1, 0);
  private _tmpVector = new Vector3();
  /** 反射平面 */
  private _refectionPlane = new Vector4();
  private _refectionMatrix = new Matrix();
  private _backgroundRefectionMatrix = new Matrix();
  private _identityMatrix = new Matrix();

  private getNormalVector(out: Vector3) {
    Vector3.transformNormal(
      this._initNormal,
      this.entity.transform.localMatrix,
      out
    );
  }

  constructor(entity: Entity) {
    super(entity);
    Mirror._count << 1;
    this._layer = Mirror._count;
  }

  init(width: number, height: number, camera: Camera) {
    this.entity.layer = this._layer;
    this._stencilEntity = this.entity.createChild('stencil_entity');
    this._stencilEntity.layer = this._layer;
    const stencilPlaneRenderer = this._stencilEntity.addComponent(MeshRenderer);
    // 优先渲染模板平面，设置模板值
    stencilPlaneRenderer.priority = -1;
    stencilPlaneRenderer.mesh = PrimitiveMesh.createPlane(
      this.engine,
      width,
      height
    );
    const stencilMaterial = new UnlitMaterial(this.engine);
    stencilPlaneRenderer.setMaterial(stencilMaterial);
    this.setStencilPlaneMatrial(stencilMaterial);

    // 镜子平面
    const mirrorPlaneRenderer = this.entity.addComponent(MeshRenderer);
    // 最后渲染镜子，开启blend混合，写入正确的深度值
    mirrorPlaneRenderer.priority = 1;
    mirrorPlaneRenderer.mesh = PrimitiveMesh.createPlane(
      this.engine,
      width,
      height
    );
    const mirrorMaterial = new UnlitMaterial(this.engine);
    mirrorPlaneRenderer.setMaterial(mirrorMaterial);
    this.setMirrorMaterial(mirrorMaterial);

    const toCameraVector = new Vector3();
    Vector3.subtract(
      camera.entity.transform.position,
      this.entity.transform.position,
      toCameraVector
    );
    this.getNormalVector(this._tmpVector);
    debugger;
    const faceToCamera = Vector3.dot(this._tmpVector, toCameraVector) > 0;
    stencilMaterial.renderState.rasterState.cullMode = faceToCamera
      ? CullMode.Back
      : CullMode.Front;
    mirrorMaterial.renderState.rasterState.cullMode = faceToCamera
      ? CullMode.Back
      : CullMode.Front;

    const script = camera.entity.addComponent(Script);
    script.onBeginRender = this.beginRender.bind(this);
    script.onEndRender = this.endRender.bind(this);
    // 只渲染Layer0和本层的对象
    camera.cullingMask = Layer.Layer0 & this._layer;
  }

  private beginRender(camera: Camera) {
    // 更新反射平面
    this.updateRefectionPlane(camera);
    camera.clearFlags = CameraClearFlags.All;
    const rootEntity = camera.scene.getRootEntity()!;
    this.traverseEntity(rootEntity, (entity) => {
      this.updateNormalEntityRenderState(entity);
    });
    this.entity.layer = Layer.Layer0;
    this._stencilEntity && (this._stencilEntity.layer = Layer.Layer0);
    this.updateBackgroundRenderState();
    camera.render();
    this.updateBackgroundRenderState(false);

    camera.clearFlags = CameraClearFlags.None;
    this.traverseEntity(rootEntity, (entity) => {
      this.updateNormalEntityRenderState(entity, false);
    });
    // 镜子只需要渲染一次
    this.entity.layer = Layer.Nothing;
    this._stencilEntity && (this._stencilEntity.layer = Layer.Nothing);
  }

  private endRender(camera: Camera): void {
    // 由于 CameraClearFlags & colorFlag === 0, 所以正常渲染管线不会渲染背景天空盒
    const sky = camera.scene.background.sky;
    // @ts-ignore
    sky._render(this.engine._renderContext);
  }

  // 更新背景渲染状态
  private updateBackgroundRenderState(beforeRender = true) {
    const background = this.entity.scene.background;
    const skyMaterial = background.sky.material;
    const targetBlend = skyMaterial.renderState.blendState.targetBlendState;
    const depthState = skyMaterial.renderState.depthState;
    const stencilState = skyMaterial.renderState.stencilState;

    if (beforeRender) {
      // 开启混合
      targetBlend.enabled = true;
      targetBlend.sourceAlphaBlendFactor = targetBlend.sourceColorBlendFactor =
        BlendFactor.OneMinusDestinationAlpha;
      targetBlend.destinationAlphaBlendFactor =
        targetBlend.destinationColorBlendFactor = BlendFactor.DestinationAlpha;

      // 开启模板测试
      stencilState.enabled = true;
      stencilState.referenceValue = 1;
      stencilState.writeMask = 0x00;
      stencilState.compareFunctionBack = CompareFunction.Equal;
      stencilState.compareFunctionFront = CompareFunction.Equal;

      // 通过深度测试，关闭深度写入
      depthState.compareFunction = CompareFunction.Always;
      depthState.writeEnabled = false;

      skyMaterial.shaderData.setMatrix(
        'u_reflectionMat',
        this._backgroundRefectionMatrix
      );
    } else {
      targetBlend.enabled = false;
      depthState.compareFunction = CompareFunction.LessEqual;
      depthState.writeEnabled = true;
      stencilState.enabled = false;

      skyMaterial.shaderData.setMatrix('u_reflectionMat', this._identityMatrix);
    }
  }

  updateNormalEntityRenderState(entity: Entity, beforeRender = true) {
    const renderer = entity.getComponent(Renderer);
    const material = renderer?.getMaterial();
    if (!material) return;

    // 镜像翻转entity
    entity.transform.position.transformToVec3(this._refectionMatrix);

    const rasterState = material.renderState.rasterState;
    const stencilState = material.renderState.stencilState;
    const depthState = material.renderState.depthState;

    depthState.writeEnabled = true;
    if (beforeRender) {
      rasterState.cullMode = CullMode.Back;
      // 开启模板测试，只渲染镜子部分像素
      stencilState.enabled = true;
      stencilState.referenceValue = 1;
      stencilState.writeMask = 0x00;
      stencilState.compareFunctionBack = CompareFunction.Equal;
      stencilState.compareFunctionFront = CompareFunction.Equal;
    } else {
      rasterState.cullMode = CullMode.Back;
      stencilState.enabled = false;
    }
  }

  private traverseEntity(entity: Entity, cb: (entity: Entity) => any) {
    if ([this.entity, this._stencilEntity].includes(entity)) return;
    cb(entity);
    for (let i = 0; i < entity.children.length; i++) {
      this.traverseEntity(entity.children[i], cb);
    }
  }

  private updateRefectionPlane(camera: Camera) {
    const { position, localMatrix } = this.entity.transform;
    const { _initNormal, _tmpVector, _refectionPlane } = this;
    Vector3.transformNormal(_initNormal, localMatrix, _tmpVector);

    // 平面方程 (point - position) * normal = 0;
    _refectionPlane.x = _tmpVector.x;
    _refectionPlane.y = _tmpVector.y;
    _refectionPlane.z = _tmpVector.z;
    _refectionPlane.w =
      -_tmpVector.x * position.x -
      _tmpVector.y * position.y -
      _tmpVector.z * position.z;

    // 更新反射矩阵 https://ami.uni-eszterhazy.hu/uploads/papers/finalpdf/AMI_40_from175to186.pdf
    const oe = this._refectionMatrix.elements;
    oe[0] = 1 - 2 * _refectionPlane.x * _refectionPlane.x;
    oe[1] = -2 * _refectionPlane.y * _refectionPlane.x;
    oe[2] = -2 * _refectionPlane.z * _refectionPlane.x;
    oe[3] = 0;
    oe[4] = -2 * _refectionPlane.x * _refectionPlane.y;
    oe[5] = 1 - 2 * _refectionPlane.y * _refectionPlane.y;
    oe[6] = -2 * _refectionPlane.y * _refectionPlane.x;
    oe[7] = 0;
    oe[8] = -2 * _refectionPlane.x * _refectionPlane.z;
    oe[9] = -2 * _refectionPlane.y * _refectionPlane.z;
    oe[10] = 1 - 2 * _refectionPlane.z * _refectionPlane.z;
    oe[11] = 0;
    oe[12] = -2 * _refectionPlane.w * _refectionPlane.x;
    oe[13] = -2 * _refectionPlane.w * _refectionPlane.y;
    oe[14] = -2 * _refectionPlane.w * _refectionPlane.z;
    oe[15] = 1;

    this._backgroundRefectionMatrix.copyFrom(this._refectionMatrix);
    const boe = this._backgroundRefectionMatrix.elements;
    // 去掉背景反射矩阵的位移量
    boe[12] = boe[13] = boe[14] = 0;
  }

  private setMirrorMaterial(material: UnlitMaterial) {
    // baseColor alpha值为0，为后续的blend操作做准备
    material.baseColor = new Color(1, 0, 0, 0);

    // 开启blend
    const targetBlend = material.renderState.blendState.targetBlendState;
    targetBlend.enabled = true;
    targetBlend.sourceAlphaBlendFactor = BlendFactor.OneMinusDestinationAlpha;
    targetBlend.sourceColorBlendFactor = BlendFactor.OneMinusDestinationAlpha;
    targetBlend.destinationAlphaBlendFactor = BlendFactor.DestinationAlpha;
    targetBlend.destinationColorBlendFactor = BlendFactor.DestinationAlpha;

    // 写入镜子正确的深度值
    const depthState = material.renderState.depthState;
    depthState.enabled = true;
    depthState.writeEnabled = true;

    // 需要保留alpha值
    material.shaderData.enableMacro('OASIS_TRANSPARENT');
  }

  setStencilPlaneMatrial(material: UnlitMaterial) {
    material.baseColor = new Color(0, 1, 0, 0);

    // 开启模板测试
    const stencilState = material.renderState.stencilState;
    stencilState.enabled = true;
    stencilState.referenceValue = 1;
    stencilState.compareFunctionFront = CompareFunction.Always;
    stencilState.compareFunctionBack = CompareFunction.Always;
    stencilState.passOperationFront = StencilOperation.Replace;
    stencilState.passOperationBack = StencilOperation.Replace;

    // 关闭深度缓冲写入
    const depthState = material.renderState.depthState;
    depthState.writeEnabled = false;

    // 需要保留alpha值
    material.shaderData.enableMacro('OASIS_TRANSPARENT');
  }

  onDestroy(): void {
    this._stencilEntity?.destroy();
  }
}
