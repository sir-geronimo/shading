#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_normal;

// Glossiness would be an uniform
// uniform float glossiness;

float m_dot(vec3 a, vec3 b) {
  return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
}

float m_length(vec3 a) {
  return sqrt(m_dot(a, a));
}

vec3 m_normalize(vec3 a) {
  return a / m_length(a);
}

vec3 m_reflect(vec3 a, vec3 normal) {
  vec3 t = normal * m_dot(a, normal) * 2.0;

  return a - t;
}

void main() {
  float glossiness = 64.0;

  vec3 cameraSource = vec3(0.0, 0.0, 1.0);
  vec3 viewSource = m_normalize(cameraSource);

  vec3 modelColor = vec3(0.75);
  vec3 normal = m_normalize(v_normal.xyz);

  // Light source
  vec3 lightSource = vec3(1.0, 1.0, 0.5);
  vec3 lightColor = vec3(1.0);

  // Ambient light (global illuminance)
  vec3 ambient = vec3(0.65);

  // Diffuse (Lambertian) light
  float diffuseStrength = max(0.0, m_dot(lightSource, normal));
  vec3 diffuse = diffuseStrength * lightColor;

  // Specular light
  vec3 reflectSource = m_normalize(m_reflect(-lightSource, normal));
  float specularStrength = max(0.0, m_dot(viewSource, reflectSource));
  specularStrength = pow(specularStrength, glossiness);
  vec3 specular = specularStrength * lightColor;

  // Lighting = ambient + diffuse + specular
  vec3 lighting = ambient * 0.0 + diffuse + specular;

  // Coloring
  vec3 color = modelColor * lighting;

  gl_FragColor = vec4(color, 1.0);
}