// Backend and Database Test Script
const BASE_URL = 'http://localhost:3000';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      log(`✓ ${name}: SUCCESS (${response.status})`, 'green');
      return { success: true, data };
    } else {
      log(`✗ ${name}: FAILED (${response.status}) - ${data.error || 'Unknown error'}`, 'red');
      return { success: false, error: data };
    }
  } catch (error) {
    log(`✗ ${name}: ERROR - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n=== GURUKUL BACKEND & DATABASE TEST ===\n', 'blue');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test 1: Admin Auth
  log('1. Testing Admin Authentication...', 'yellow');
  const authTest = await testEndpoint(
    'Admin Auth',
    `${BASE_URL}/api/admin/auth`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey: 'GurukulAdmin123' })
    }
  );
  results.total++;
  authTest.success ? results.passed++ : results.failed++;

  // Test 2: Faculty API (GET)
  log('\n2. Testing Faculty API (Database Read)...', 'yellow');
  const facultyTest = await testEndpoint(
    'Get Faculty',
    `${BASE_URL}/api/admin/faculty`
  );
  results.total++;
  facultyTest.success ? results.passed++ : results.failed++;
  if (facultyTest.success) {
    log(`   Found ${facultyTest.data.length} faculty members`, 'blue');
  }

  // Test 3: Events API (GET)
  log('\n3. Testing Events API (Database Read)...', 'yellow');
  const eventsTest = await testEndpoint(
    'Get Events',
    `${BASE_URL}/api/admin/events`
  );
  results.total++;
  eventsTest.success ? results.passed++ : results.failed++;
  if (eventsTest.success) {
    log(`   Found ${eventsTest.data.length} events`, 'blue');
  }

  // Test 4: Toppers API (GET)
  log('\n4. Testing Toppers API (Database Read)...', 'yellow');
  const toppersTest = await testEndpoint(
    'Get Toppers',
    `${BASE_URL}/api/admin/toppers`
  );
  results.total++;
  toppersTest.success ? results.passed++ : results.failed++;
  if (toppersTest.success) {
    log(`   Found ${toppersTest.data.length} toppers`, 'blue');
  }

  // Test 5: Inquiries API (GET)
  log('\n5. Testing Inquiries API (Database Read)...', 'yellow');
  const inquiriesTest = await testEndpoint(
    'Get Inquiries',
    `${BASE_URL}/api/admin/inquiries`
  );
  results.total++;
  inquiriesTest.success ? results.passed++ : results.failed++;
  if (inquiriesTest.success) {
    log(`   Found ${inquiriesTest.data.length} inquiries`, 'blue');
  }

  // Test 6: Students API (GET)
  log('\n6. Testing Students API (Database Read)...', 'yellow');
  const studentsTest = await testEndpoint(
    'Get Students',
    `${BASE_URL}/api/admin/students`
  );
  results.total++;
  studentsTest.success ? results.passed++ : results.failed++;
  if (studentsTest.success) {
    log(`   Found ${studentsTest.data.length} students`, 'blue');
  }

  // Test 7: Google Reviews API
  log('\n7. Testing Google Reviews API...', 'yellow');
  const reviewsTest = await testEndpoint(
    'Get Google Reviews',
    `${BASE_URL}/api/google-reviews`
  );
  results.total++;
  reviewsTest.success ? results.passed++ : results.failed++;

  // Test 8: NextAuth Session
  log('\n8. Testing NextAuth Session API...', 'yellow');
  const sessionTest = await testEndpoint(
    'Get Session',
    `${BASE_URL}/api/auth/session`
  );
  results.total++;
  sessionTest.success ? results.passed++ : results.failed++;

  // Summary
  log('\n=== TEST SUMMARY ===', 'blue');
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  
  const percentage = ((results.passed / results.total) * 100).toFixed(1);
  log(`\nSuccess Rate: ${percentage}%`, percentage === '100.0' ? 'green' : 'yellow');

  // Database Status
  log('\n=== DATABASE STATUS ===', 'blue');
  const dbWorking = facultyTest.success || eventsTest.success || toppersTest.success;
  if (dbWorking) {
    log('✓ MongoDB Connection: WORKING', 'green');
    log(`  Connection String: ${process.env.MONGODB_URI?.split('@')[1] || 'configured'}`, 'blue');
  } else {
    log('✗ MongoDB Connection: FAILED', 'red');
    log('  Check your MONGODB_URI in .env.local', 'yellow');
  }

  log('\n');
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log(`\nFatal Error: ${error.message}`, 'red');
  process.exit(1);
});
