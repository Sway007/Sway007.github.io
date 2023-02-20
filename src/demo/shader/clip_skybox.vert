#include <common_vert>

uniform mat4 u_VPMat;

varying vec3 v_cubeUV;

uniform mat4 u_reflectionMat;

void main() {

  v_cubeUV = vec3(-POSITION.x, POSITION.yz);// TextureCube is left-hand,so x need inverse
  gl_Position = u_VPMat * u_reflectionMat * vec4(POSITION, 1.0);

}
