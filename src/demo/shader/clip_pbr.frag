#ifdef OASIS_CLIP_PLANE
uniform vec4 u_clip_plane;
#endif 

#define IS_METALLIC_WORKFLOW
#include <common>
#include <camera_declare>

#include <FogFragmentDeclaration>

#include <uv_share>
#include <normal_share>
#include <color_share>
#include <worldpos_share>

#include <light_frag_define>

#include <pbr_frag_define>
#include <pbr_helper>

void main() {
    #ifdef OASIS_CLIP_PLANE
  if(dot(u_clip_plane, vec4(v_pos, 1.0)) < -EPSILON) {
    discard;
  }
    #endif 

    #include <pbr_frag>
    #include <FogFragment>

    #ifndef OASIS_COLORSPACE_GAMMA
  gl_FragColor = linearToGamma(gl_FragColor);
    #endif
}
