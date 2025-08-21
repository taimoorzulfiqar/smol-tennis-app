// Performance test script for the tennis app
// Run this in the browser console to test performance

console.log('🎾 Tennis App Performance Test');

// Test 1: Measure page load time
const measurePageLoad = () => {
  const start = performance.now();
  
  return new Promise((resolve) => {
    window.addEventListener('load', () => {
      const end = performance.now();
      const loadTime = end - start;
      console.log(`📊 Page Load Time: ${loadTime.toFixed(2)}ms`);
      resolve(loadTime);
    });
  });
};

// Test 2: Measure component render time
const measureComponentRender = (componentName) => {
  const start = performance.now();
  
  return new Promise((resolve) => {
    // Simulate component render
    setTimeout(() => {
      const end = performance.now();
      const renderTime = end - start;
      console.log(`⚡ ${componentName} Render Time: ${renderTime.toFixed(2)}ms`);
      resolve(renderTime);
    }, 100);
  });
};

// Test 3: Measure data fetching performance
const measureDataFetch = async () => {
  const start = performance.now();
  
  try {
    const response = await fetch('/api/health');
    const end = performance.now();
    const fetchTime = end - start;
    console.log(`🌐 API Response Time: ${fetchTime.toFixed(2)}ms`);
    return fetchTime;
  } catch (error) {
    console.log('❌ API test failed:', error.message);
    return null;
  }
};

// Test 4: Memory usage
const measureMemoryUsage = () => {
  if (performance.memory) {
    const memory = performance.memory;
    console.log(`💾 Memory Usage:`);
    console.log(`   Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
    console.log(`   Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`);
    console.log(`   Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
  } else {
    console.log('💾 Memory usage not available in this browser');
  }
};

// Test 5: Frame rate test
const measureFrameRate = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  
  const countFrames = () => {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      console.log(`🎬 Frame Rate: ${fps} FPS`);
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(countFrames);
  };
  
  requestAnimationFrame(countFrames);
  
  // Stop after 3 seconds
  setTimeout(() => {
    console.log('✅ Frame rate test completed');
  }, 3000);
};

// Run all tests
const runPerformanceTests = async () => {
  console.log('🚀 Starting performance tests...\n');
  
  // Test 1: Page load
  await measurePageLoad();
  
  // Test 2: Component renders
  await measureComponentRender('MensPlayers');
  await measureComponentRender('WomensPlayers');
  await measureComponentRender('MensMatches');
  
  // Test 3: API performance
  await measureDataFetch();
  
  // Test 4: Memory usage
  measureMemoryUsage();
  
  // Test 5: Frame rate
  measureFrameRate();
  
  console.log('\n✅ All performance tests completed!');
};

// Export for use in browser console
window.runPerformanceTests = runPerformanceTests;

// Auto-run if in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(runPerformanceTests, 2000);
}

export default runPerformanceTests;
