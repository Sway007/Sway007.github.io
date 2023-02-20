#ifdef OASIS_CLIP_PLANE
uniform vec4 u_clip_plane;
#endif 

#include <common>
#include <uv_share>
#include <FogFragmentDeclaration>
#include <worldpos_share>

uniform vec4 u_baseColor;

#ifdef BASETEXTURE
uniform sampler2D u_baseTexture;
#endif

void main() {
    #ifdef OASIS_CLIP_PLANE
  if(dot(u_clip_plane, vec4(v_pos, 1.0)) < -EPSILON) {
    discard;
  }
    #endif 

  vec4 baseColor = u_baseColor;

    #ifdef BASETEXTURE
  vec4 textureColor = texture2D(u_baseTexture, v_uv);
        #ifndef OASIS_COLORSPACE_GAMMA
  textureColor = gammaToLinear(textureColor);
        #endif
  baseColor *= textureColor;
    #endif

  gl_FragColor = baseColor;

    #include <FogFragment>

     #ifndef OASIS_COLORSPACE_GAMMA
  gl_FragColor = linearToGamma(gl_FragColor);
    #endif
}
