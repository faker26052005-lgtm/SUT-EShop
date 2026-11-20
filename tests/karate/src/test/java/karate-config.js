function fn() {
  var env = karate.env;
  karate.log('karate.env system property was:', env);
  if (!env) {
    env = 'dev';
  }
  var baseUrl = karate.properties['baseUrl'] || 'http://localhost:3000';
  var config = {
    env: env,
    baseUrl: baseUrl
  };
  karate.configure('connectTimeout', 5000);
  karate.configure('readTimeout', 5000);
  return config;
}
