#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float sdfCircle(vec3 p, float r) {
  return length(p) - r;
}

void main() {
  // Set UV coordinates
  // vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv -= 0.5;
  uv *= u_resolution / 100.0;

  // Colors
  vec3 white = vec3(1.0);
  vec3 black = vec3(0.0);
  vec3 orange = vec3(0.9098, 0.6431, 0.3765);
  vec3 blue = vec3(0.0, 0.5176, 1.0);

  vec3 color = vec3(0.0);
  color = vec3(uv, 0.0);

  // Draw circle SDF
  float radius = 3.0;
  vec2 center = vec2(0.0);
  float distanceToCircle = sdfCircle(vec3(uv - center, 0.0), radius);
  color = distanceToCircle > 0.0 ? orange : blue;

  // Draw shadow
  color *= 1.0 - exp(-2.0 * abs(distanceToCircle));

  // Add waves
  color = color * 0.8 + color * 0.2 * sin(2.0 * distanceToCircle * u_time - 4.0);

  // Add white border
  color = mix(white, color, smoothstep(0.0, 0.1, abs(distanceToCircle)));

  gl_FragColor = vec4(color, 1.0);
}