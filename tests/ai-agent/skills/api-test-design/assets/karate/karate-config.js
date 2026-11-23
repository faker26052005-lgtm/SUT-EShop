// Cấu hình dùng chung cho mọi feature. Đổi địa chỉ bằng: java -DbaseUrl=http://localhost:3000 -jar karate.jar ...
function fn() {
  return {
    baseUrl: karate.properties['baseUrl'] || 'http://localhost:3000'
  };
}
