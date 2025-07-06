// Test script to verify Stripe configuration
// Run this with: node test-stripe-config.js

const stripe = require('stripe');

// Test both environments
const testKey = process.env.STRIPE_TEST_SECRET_KEY;
const liveKey = process.env.STRIPE_LIVE_SECRET_KEY;

console.log('=== Stripe Configuration Test ===\n');

if (testKey) {
  console.log('✅ Test key found');
  const testStripe = new stripe(testKey);
  
  // Try to create a test payment intent
  testStripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
  })
  .then(intent => {
    console.log('✅ Test environment working - Payment intent created:', intent.id);
    console.log('   Status:', intent.status);
    console.log('   Amount:', intent.amount);
  })
  .catch(err => {
    console.log('❌ Test environment error:', err.message);
  });
} else {
  console.log('❌ Test key not found');
}

console.log('');

if (liveKey) {
  console.log('✅ Live key found');
  const liveStripe = new stripe(liveKey);
  
  // Try to create a live payment intent
  liveStripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
  })
  .then(intent => {
    console.log('✅ Live environment working - Payment intent created:', intent.id);
    console.log('   Status:', intent.status);
    console.log('   Amount:', intent.amount);
  })
  .catch(err => {
    console.log('❌ Live environment error:', err.message);
  });
} else {
  console.log('❌ Live key not found');
}

console.log('\n=== Environment Variables Check ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('STRIPE_SECRET_KEY present:', !!process.env.STRIPE_SECRET_KEY);
console.log('STRIPE_TEST_SECRET_KEY present:', !!process.env.STRIPE_TEST_SECRET_KEY);
console.log('STRIPE_LIVE_SECRET_KEY present:', !!process.env.STRIPE_LIVE_SECRET_KEY); 