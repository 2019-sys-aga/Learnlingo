const qrcode = require('qrcode-terminal');

// Generate QR code for Expo Go connection
const expoUrl = 'exp://192.168.1.100:8081'; // This will be the actual IP when server starts
const tunnelUrl = 'https://exp.host/@anonymous/jungle-ai-mobile'; // Tunnel URL

console.log('🌲 Jungle AI Mobile App - QR Code');
console.log('=====================================');
console.log('');

console.log('📱 Scan this QR code with Expo Go:');
console.log('');

// Generate QR code for local connection
qrcode.generate('exp://192.168.1.100:8081', {small: true}, function (qrcode) {
    console.log(qrcode);
});

console.log('');
console.log('🔗 Or manually enter this URL in Expo Go:');
console.log('exp://192.168.1.100:8081');
console.log('');
console.log('📲 Steps to connect:');
console.log('1. Download "Expo Go" app from your phone\'s app store');
console.log('2. Open Expo Go app');
console.log('3. Scan the QR code above or enter the URL manually');
console.log('4. Your Jungle AI app will load!');
console.log('');
console.log('✅ Features ready:');
console.log('• Upload files and generate AI flashcards');
console.log('• Chat with AI assistant');
console.log('• Study with interactive quizzes');
console.log('• Track your progress');