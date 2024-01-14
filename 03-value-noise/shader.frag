precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

float whiteNoise2x1(vec2 p) {
  float random = dot(p, vec2(12.0, 80.0));
  random = sin(random);
  random = random * 40994.0;
  random = fract(random);

  return random;
}

float valueNoiseFn(vec2 uv) {
  vec2 gridUv = fract(uv);
  vec2 gridId = floor(uv);

  // Smooth uv coordinates
  gridUv = smoothstep(0.0, 1.0, gridUv);

  // Lerp between bottom sides
  float botLeft = whiteNoise2x1(gridId);
  float botRight = whiteNoise2x1(gridId + vec2(1.0, 0.0));
  float b = mix(botLeft, botRight, gridUv.x);

  // Lerp between top sides
  float topLeft = whiteNoise2x1(gridId + vec2(0.0, 1.0));
  float topRight = whiteNoise2x1(gridId + vec2(1.0, 1.0));
  float t = mix(topLeft, topRight, gridUv.x);

  // Lerp between both on y axis
  return mix(b, t, gridUv.y);
}

void main() {
  vec2 uv = 2.0 * gl_FragCoord.xy / u_resolution - 0.5;
  vec3 color = vec3(0.0);

  color = vec3(uv, 0.0);

  // Create white noise
  color = vec3(whiteNoise2x1(uv));

  // Add overlay
  uv = uv * 8.0;

  uv += u_time * 2.0;
  
  float valueNoise = 0.0;

  valueNoise += valueNoiseFn(uv * 4.0) * 1.0;
  valueNoise += valueNoiseFn(uv * 8.0) * 0.5;
  valueNoise += valueNoiseFn(uv * 16.0) * 0.25;
  valueNoise += valueNoiseFn(uv * 32.0) * 0.125;
  valueNoise += valueNoiseFn(uv * 64.0) * 0.0625;
  valueNoise += valueNoiseFn(uv * 128.0) * 0.03125;

  valueNoise /= 2.0;

  color = vec3(valueNoise);

  gl_FragColor = vec4(color, 1.0);
}