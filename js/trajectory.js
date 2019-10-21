var scene, camera, trajectorySurface;
var geometry, material, mesh;
var renderer;

init();

function init() {
    trajectorySurface = document.getElementById("trajectory_3d");
    scene = new THREE.Scene();

    var aspectRatio = trajectorySurface.offsetWidth / trajectorySurface.offsetHeight;
    startPosition = new THREE.Vector3( 50, 50, 200 );
    camera = new THREE.PerspectiveCamera( 95, aspectRatio, 1, 10000 );
    camera.position.set( startPosition.x, startPosition.y, startPosition.z );
    scene.add( camera );

    //light
    var light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(50, 50, 50);
    camera.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(50, 50, -100);
    camera.add(light);
    
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(50, 50, 200);
    scene.add(spotLight);

    //render
    renderer = new THREE.WebGLRenderer({ canvas: trajectorySurface });
    renderer.setSize(trajectorySurface.offsetWidth, trajectorySurface.offsetHeight);
    renderer.setClearColor(0xffffff, 1);

    //control
    var controls = new THREE.OrbitControls(camera);
    controls;

    var ah = new THREE.AxesHelper(150);
    ah.position.y -= 0.1;  // The axis helper should not intefere with the grid helper
    scene.add(ah);

    var material = new THREE.MeshPhysicalMaterial({
        color: "#d0d9d9",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    });
    var tubularSegments = 150;
    var radius = 3;
    var radialSegments = 64;
    var closed = false;
    depth = 110;
    var x = Math.acos(0.587);
    var y = Math.asin(0.567);
    var z = Math.cos(360);
    var x1 = Math.atan(0.879);
    var y1 = Math.sin(49);
    var z1 = Math.cos(90);
    // var curve = new THREE.CatmullRomCurve3([
    //     new THREE.Vector3(depth * x, depth * y, depth * z),
    //     new THREE.Vector3(x, y, z),
    //     new THREE.Vector3(x1 * depth, depth * y1, depth * z1)
    // ]);
    // var newList = [{depth:0,inclination:0,azimuth:0},{depth:234.01,inclination:1.21,azimuth:20.11},{depth:244.01,inclination:0.23,azimuth:313.94},{depth:254.01,inclination:0.13,azimuth:327.66},{depth:264.01,inclination:0.34,azimuth:337.68},{depth:274.01,inclination:0.38,azimuth:310.4},{depth:284.01,inclination:0.28,azimuth:317.52},{depth:294.01,inclination:0.39,azimuth:310.01},{depth:304.01,inclination:0.4,azimuth:287.27},{depth:314.01,inclination:0.25,azimuth:268.66},{depth:324.01,inclination:0.48,azimuth:253.98},{depth:334.01,inclination:1.05,azimuth:240.24},{depth:344.01,inclination:1.63,azimuth:231.7},{depth:354.02,inclination:2.19,azimuth:227.76},{depth:364.03,inclination:2.69,azimuth:223.42},{depth:374.04,inclination:2.99,azimuth:220.22},{depth:384.05,inclination:3.17,azimuth:221.15},{depth:394.07,inclination:3.27,azimuth:221.96},{depth:404.09,inclination:3.23,azimuth:218.7},{depth:414.1,inclination:3.11,azimuth:215.02},{depth:424.12,inclination:2.86,azimuth:213.89},{depth:434.13,inclination:2.59,azimuth:214.97},{depth:444.14,inclination:2.38,azimuth:214.77},{depth:454.14,inclination:2.15,azimuth:210.01},{depth:464.15,inclination:1.89,azimuth:200.66},{depth:474.15,inclination:1.64,azimuth:193.43},{depth:484.16,inclination:1.58,azimuth:186.78},{depth:494.16,inclination:1.74,azimuth:180.63},{depth:504.17,inclination:1.89,azimuth:182.62},{depth:514.17,inclination:1.99,azimuth:190.99},{depth:524.18,inclination:2.19,azimuth:201.25},{depth:534.19,inclination:2.49,azimuth:208.66},{depth:544.2,inclination:2.75,azimuth:214.81},{depth:554.21,inclination:3.1,azimuth:218.53},{depth:564.23,inclination:3.33,azimuth:220.23},{depth:574.24,inclination:3.51,azimuth:220.53},{depth:584.27,inclination:3.83,azimuth:218.86},{depth:594.29,inclination:4,azimuth:219.55},{depth:604.31,inclination:4.07,azimuth:221.4},{depth:614.34,inclination:4.12,azimuth:221.86},{depth:624.37,inclination:4.16,azimuth:221.93},{depth:634.39,inclination:4.25,azimuth:221.75},{depth:644.42,inclination:4.55,azimuth:220.33},{depth:654.46,inclination:5,azimuth:218.78},{depth:664.5,inclination:5.49,azimuth:218.97},{depth:674.55,inclination:6.14,azimuth:220.16},{depth:684.62,inclination:6.95,azimuth:220.45},{depth:694.7,inclination:7.87,azimuth:221.11},{depth:704.81,inclination:8.76,azimuth:221.46},{depth:714.94,inclination:9.75,azimuth:220.61},{depth:725.1,inclination:10.84,azimuth:220.51},{depth:735.3,inclination:11.89,azimuth:220.96},{depth:745.55,inclination:13.1,azimuth:220.78},{depth:755.84,inclination:14.43,azimuth:220.28},{depth:766.2,inclination:15.62,azimuth:220.05},{depth:776.6,inclination:16.59,azimuth:219.94},{depth:787.06,inclination:17.38,azimuth:219.66},{depth:797.56,inclination:18.01,azimuth:218.58},{depth:808.09,inclination:18.47,azimuth:216.31},{depth:818.64,inclination:18.68,azimuth:213.65},{depth:829.2,inclination:18.78,azimuth:211.61},{depth:839.76,inclination:18.85,azimuth:210.26},{depth:850.33,inclination:18.87,azimuth:209.16},{depth:860.9,inclination:18.89,azimuth:207.72},{depth:871.47,inclination:18.98,azimuth:205.57},{depth:882.05,inclination:19.28,azimuth:203.48},{depth:892.66,inclination:19.67,azimuth:202.24},{depth:903.28,inclination:19.86,azimuth:201.56},{depth:913.92,inclination:20.07,azimuth:200.97},{depth:924.58,inclination:20.44,azimuth:200.47},{depth:935.26,inclination:20.73,azimuth:199.9},{depth:945.97,inclination:21.13,azimuth:199.32},{depth:956.71,inclination:21.7,azimuth:198.64},{depth:967.49,inclination:22.1,azimuth:197.86},{depth:978.3,inclination:22.42,azimuth:197.49},{depth:989.13,inclination:22.87,azimuth:197.48},{depth:1000,inclination:23.39,azimuth:197.6},{depth:1010.91,inclination:23.72,azimuth:197.74},{depth:1021.84,inclination:23.77,azimuth:197.73},{depth:1032.76,inclination:23.72,azimuth:197.65},{depth:1043.69,inclination:23.72,azimuth:197.61},{depth:1054.61,inclination:23.73,azimuth:197.61},{depth:1065.53,inclination:23.68,azimuth:197.54},{depth:1076.45,inclination:23.65,azimuth:197.48},{depth:1087.37,inclination:23.72,azimuth:197.38},{depth:1098.29,inclination:23.77,azimuth:197.11},{depth:1109.22,inclination:23.82,azimuth:197.1},{depth:1120.16,inclination:23.88,azimuth:197.24},{depth:1131.09,inclination:23.94,azimuth:197.17},{depth:1142.04,inclination:24.06,azimuth:197.06},{depth:1153,inclination:24.16,azimuth:196.93},{depth:1163.96,inclination:24.22,azimuth:196.96},{depth:1174.93,inclination:24.33,azimuth:197.26},{depth:1185.91,inclination:24.4,azimuth:197.36},{depth:1196.89,inclination:24.48,azimuth:197.31},{depth:1207.88,inclination:24.62,azimuth:197.39},{depth:1218.89,inclination:24.72,azimuth:197.54},{depth:1229.9,inclination:24.77,azimuth:197.63},{depth:1240.91,inclination:24.73,azimuth:197.67},{depth:1251.91,inclination:24.54,azimuth:197.68},{depth:1262.9,inclination:24.29,azimuth:197.72},{depth:1273.86,inclination:24.05,azimuth:197.84},{depth:1284.8,inclination:23.88,azimuth:197.92},{depth:1295.73,inclination:23.82,azimuth:198.03},{depth:1306.66,inclination:23.81,azimuth:198.19},{depth:1317.6,inclination:23.81,azimuth:198.23},{depth:1328.52,inclination:23.66,azimuth:198.36},{depth:1339.42,inclination:23.36,azimuth:198.53},{depth:1350.31,inclination:23.08,azimuth:198.72},{depth:1361.17,inclination:22.84,azimuth:198.93},{depth:1372.01,inclination:22.72,azimuth:198.96},{depth:1382.85,inclination:22.69,azimuth:199.05},{depth:1393.69,inclination:22.7,azimuth:199.12},{depth:1404.53,inclination:22.77,azimuth:199.16},{depth:1415.39,inclination:22.96,azimuth:199.34},{depth:1426.26,inclination:23.16,azimuth:199.72},{depth:1437.13,inclination:23.12,azimuth:200.26},{depth:1447.99,inclination:22.83,azimuth:200.74},{depth:1458.83,inclination:22.49,azimuth:201.17},{depth:1469.64,inclination:22.29,azimuth:201.57},{depth:1480.45,inclination:22.26,azimuth:202.07},{depth:1491.26,inclination:22.26,azimuth:202.35},{depth:1498.52,inclination:22.82,azimuth:200.48},{depth:1527.44,inclination:23.86,azimuth:195.03},{depth:1556.38,inclination:25.91,azimuth:186.79},{depth:1585.3,inclination:28.39,azimuth:178.41},{depth:1614.23,inclination:30.21,azimuth:175.44},{depth:1643.15,inclination:31.73,azimuth:177.18},{depth:1672.09,inclination:33.1,azimuth:178.4},{depth:1701.03,inclination:35.43,azimuth:178.28},{depth:1729.96,inclination:38.61,azimuth:180.76},{depth:1758.9,inclination:41.51,azimuth:178.79},{depth:1787.81,inclination:43.81,azimuth:176.66},{depth:1816.73,inclination:46.27,azimuth:174.06},{depth:1845.65,inclination:49.48,azimuth:172.68},{depth:1874.65,inclination:52.27,azimuth:172.03},{depth:1903.59,inclination:54.51,azimuth:171.66},{depth:1932.56,inclination:57.11,azimuth:171.25},{depth:1961.49,inclination:59.96,azimuth:170.32},{depth:1990.4,inclination:62.9,azimuth:170.5},{depth:2019.36,inclination:65.78,azimuth:170.96},{depth:2046.7,inclination:67.69,azimuth:170.74},{depth:2076.14,inclination:69.42,azimuth:171.75},{depth:2104.87,inclination:71.39,azimuth:173.61},{depth:2133.36,inclination:72.94,azimuth:175.2},{depth:2162.35,inclination:73.84,azimuth:174.88},{depth:2192.15,inclination:73.99,azimuth:173.99},{depth:2220.87,inclination:74.05,azimuth:173.32},{depth:2249.55,inclination:73.98,azimuth:172.7},{depth:2278.39,inclination:74.02,azimuth:172.39},{depth:2307.82,inclination:73.94,azimuth:171.52},{depth:2336.57,inclination:73.99,azimuth:171.41},{depth:2365.45,inclination:73.98,azimuth:171.98},{depth:2394.4,inclination:73.98,azimuth:173.44},{depth:2423.59,inclination:74.07,azimuth:173.82},{depth:2452.41,inclination:73.98,azimuth:172.68},{depth:2481.02,inclination:73.96,azimuth:172.66},{depth:2509.88,inclination:74,azimuth:174.19},{depth:2538.47,inclination:74.04,azimuth:174.45},{depth:2567.49,inclination:74.08,azimuth:173.67},{depth:2596.82,inclination:74.03,azimuth:173.4},{depth:2625.81,inclination:74.07,azimuth:173.01},{depth:2654.9,inclination:74.01,azimuth:171.69},{depth:2683.63,inclination:74,azimuth:172.22},{depth:2712.3,inclination:73.94,azimuth:172.88},{depth:2740.98,inclination:73.94,azimuth:173.68},{depth:2770.45,inclination:73.92,azimuth:174.3},{depth:2799.33,inclination:74.02,azimuth:174.82},{depth:2827.93,inclination:73.95,azimuth:174.61},{depth:2857.43,inclination:74.34,azimuth:173.58},{depth:2895.28,inclination:74.45,azimuth:172.82},{depth:2923.43,inclination:74.55,azimuth:171.17},{depth:2952.07,inclination:74.51,azimuth:171.39},{depth:3009.53,inclination:74.53,azimuth:171.91},{depth:3039.67,inclination:73.79,azimuth:170.78},{depth:3060.34,inclination:71.58,azimuth:170.9},{depth:3097.14,inclination:68.81,azimuth:169.69},{depth:3126.07,inclination:66.29,azimuth:170.19},{depth:3154.5,inclination:63.66,azimuth:168.42},{depth:3183.99,inclination:60.98,azimuth:166.83},{depth:3213.14,inclination:58.73,azimuth:165.97},{depth:3241.26,inclination:56.25,azimuth:163.93},{depth:3270.34,inclination:53.59,azimuth:160.59},{depth:3299.95,inclination:51.09,azimuth:157.41},{depth:3328.8,inclination:48.79,azimuth:155.01},{depth:3357.55,inclination:46.43,azimuth:152.84},{depth:3386.23,inclination:43.47,azimuth:149.46},{depth:3415.03,inclination:40.95,azimuth:145.5},{depth:3444.03,inclination:38.66,azimuth:141.61},{depth:3473.62,inclination:36.72,azimuth:138.83},{depth:3502.38,inclination:34.81,azimuth:134.97},{depth:3531.1,inclination:32.7,azimuth:130.16},{depth:3559.99,inclination:30.59,azimuth:125.21},{depth:3588.86,inclination:29.08,azimuth:119.19},{depth:3616.51,inclination:29.14,azimuth:119.07},{depth:3654.02,inclination:28.03,azimuth:120.84},{depth:3682.98,inclination:27.68,azimuth:121.01},{depth:3705.66,inclination:28.14,azimuth:122.68}];
    // var trajectoryData = formatTrajectoryData(newList);
    // var trajectoryData = [
    //   new THREE.Vector3( -30, 90, 20 ),
    //   new THREE.Vector3( -50, 10, 50 ),
    //   new THREE.Vector3( -52, 12, 5 ),
    //   new THREE.Vector3( -20, 0, 20 ),
    //   new THREE.Vector3( -5, 5, 5 ),
    //   new THREE.Vector3( 0, 0, 0 ),
    //   new THREE.Vector3( 5, -5, 5 ),
    //   new THREE.Vector3( 20, 0, 20 ),
    //   new THREE.Vector3( 50, 0, 50 )
    // ];
    var trajectoryData = [
      new THREE.Vector3(10, 5, 150),
      new THREE.Vector3(40, 5, 140),
      new THREE.Vector3(60, 5, 130),
      new THREE.Vector3(85, 5, 120),
      new THREE.Vector3(100, 5, 100),
      new THREE.Vector3(88, 20, 50),
      new THREE.Vector3(72, 50, 50),
      new THREE.Vector3(60, 100, 50)
    ];
    var curve = new THREE.CatmullRomCurve3(trajectoryData);

    var geometry = new THREE.TubeBufferGeometry(curve, tubularSegments, radius, radialSegments, closed);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 20;
    mesh.position.x = 12;
    scene.add(mesh);
    render();
};

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, true);
render();

// Functions :
function onWindowResize() {
  camera.aspect = surface.offsetWidth / surface.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(surface.offsetWidth, surface.offsetHeight);
}

function formatTrajectoryData(trajectoryList) {
  var measuredDepth, radian, degree, RF, north, east, tvd;
  var trajectoryArray = [];
  for(var index = 0; index < trajectoryList.length; index++) {
    var firstData = trajectoryList[index];
    var secondData = trajectoryList[index + 1];
    if(secondData) {
      measuredDepth = secondData.depth - firstData.depth;
      radian = Math.acos(Math.cos(secondData.inclination - firstData.inclination) - Math.sin(firstData.inclination) * Math.sin(secondData.inclination) * (1 - Math.cos(secondData.azimuth - firstData.azimuth)));
      degree = radian *180 / Math.PI;
      RF = (2/radian) * Math.tan(degree/2);
      north = (measuredDepth/2) * (Math.sin(firstData.inclination) * Math.cos(firstData.azimuth) + Math.sin(secondData.inclination) * Math.cos(secondData.azimuth)) * RF;
      east = (measuredDepth/2) * (Math.sin(firstData.inclination) * Math.sin(firstData.azimuth) + Math.sin(secondData.inclination) * Math.cos(secondData.azimuth)) * RF;
      tvd = (measuredDepth/2) * (Math.cos(firstData.inclination) + Math.cos(secondData.inclination)) * RF;
      trajectoryArray.push(new THREE.Vector3(north, tvd, east));
    }
  }
  return trajectoryArray;
}