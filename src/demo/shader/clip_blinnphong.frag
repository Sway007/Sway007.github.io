#ifdef OASIS_CLIP_PLANE
uniform vec4 u_clip_plane;
#endif 

#include <common>
#include <camera_declare>

#include <uv_share>
#include <normal_share>
#include <color_share>
#include <worldpos_share>

#include <light_frag_define>
#include <ShadowFragmentDeclaration>
#include <mobile_material_frag>

#include <FogFragmentDeclaration>
#include <normal_get>

void main() {
    #ifdef OASIS_CLIP_PLANE
  if(dot(u_clip_plane, vec4(v_pos, 1.0)) < -EPSILON) {
    discard;
  }
    #endif 

    #include <begin_mobile_frag>
    #include <begin_viewdir_frag>
    #include <mobile_blinnphong_frag>

  gl_FragColor = emission + ambient + diffuse + specular;

    #include <FogFragment>

    #ifndef OASIS_COLORSPACE_GAMMA
  gl_FragColor = linearToGamma(gl_FragColor);
    #endif
}
