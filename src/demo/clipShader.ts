import { Shader } from 'oasis-engine';
import clipShaders from './shader';

export class ClipShader {
  static createSkyboxShader() {
    return Shader.create(
      'clip_skybox',
      clipShaders.clip_skybox_vert,
      clipShaders.clip_skybox_frag
    );
  }
}
