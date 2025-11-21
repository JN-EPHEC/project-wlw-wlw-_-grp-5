const os = require('os');
const http = require('http');

// Fonction pour obtenir l'adresse IP locale
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

// Fonction pour tester si le serveur est accessible
async function testServer(host, port) {
    return new Promise((resolve) => {
        const req = http.get(`http://${host}:${port}`, (res) => {
            resolve(res.statusCode === 200);
        });
        
        req.on('error', () => {
            resolve(false);
        });
        
        req.setTimeout(3000, () => {
            req.abort();
            resolve(false);
        });
    });
}

async function displayNetworkInfo() {
    const localIP = getLocalIP();
    const port = 3000;
    
    console.log('🌐 =======================================');
    console.log('📡 INFORMATIONS RÉSEAU MINDLY');
    console.log('🌐 =======================================');
    console.log(`🖥️  Ordinateur : http://localhost:${port}/?dev=true`);
    console.log(`📱 Mobile/WiFi : http://${localIP}:${port}/?dev=true`);
    console.log(`🧪 Tests auto : http://localhost:${port}/test`);
    console.log('🌐 =======================================');
    
    // Test de connectivité
    console.log('🔍 Test de connectivité...');
    
    const localhostOK = await testServer('localhost', port);
    const networkOK = await testServer(localIP, port);
    
    console.log(`✅ Localhost : ${localhostOK ? '🟢 OK' : '🔴 ERREUR'}`);
    console.log(`📱 Réseau    : ${networkOK ? '🟢 OK' : '🔴 ERREUR'}`);
    
    if (!localhostOK) {
        console.log('❌ Serveur MINDLY non détecté sur localhost:3000');
        console.log('💡 Lancez: node start-mindly-dev.js');
    }
    
    if (!networkOK) {
        console.log('⚠️  Accès réseau limité - tests mobile indisponibles');
        console.log('💡 Vérifiez le pare-feu et les paramètres réseau');
    }
    
    console.log('🌐 =======================================');
    
    // Générer un QR code ASCII pour mobile
    if (networkOK) {
        console.log('📱 ACCÈS MOBILE RAPIDE:');
        console.log('┌─────────────────────────┐');
        console.log('│ Scannez avec votre      │');
        console.log('│ téléphone ou tapez:     │');
        console.log(`│ ${localIP}:${port}/?dev=true     │`);
        console.log('└─────────────────────────┘');
    }
    
    return {
        localhost: `http://localhost:${port}/?dev=true`,
        network: `http://${localIP}:${port}/?dev=true`,
        test: `http://localhost:${port}/test`,
        localhostOK,
        networkOK
    };
}

// Si appelé directement
if (require.main === module) {
    displayNetworkInfo();
}

module.exports = { getLocalIP, testServer, displayNetworkInfo };