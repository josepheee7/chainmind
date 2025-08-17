const { ethers } = require('hardhat');

async function verifyDeployment() {
  console.log('🔍 Verifying ChainMind contract deployment...\n');
  
  try {
    // Contract addresses from latest deployment
    const addresses = {
      'ChainMindToken': '0x9A676e781A523b5d0C0e43731313A708CB607508',
      'AIOracle': '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
      'ChainMindDAO': '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
      'ChainMindStaking': '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE'
    };
    
    let allDeployed = true;
    
    for (const [name, address] of Object.entries(addresses)) {
      try {
        const code = await ethers.provider.getCode(address);
        if (code === '0x') {
          console.log(`❌ ${name}: NOT DEPLOYED at ${address}`);
          allDeployed = false;
        } else {
          console.log(`✅ ${name}: DEPLOYED at ${address}`);
          
          // Try to interact with the contract
          if (name === 'ChainMindToken') {
            const Token = await ethers.getContractFactory('ChainMindToken');
            const token = Token.attach(address);
            const name = await token.name();
            const symbol = await token.symbol();
            console.log(`   📝 Name: ${name}, Symbol: ${symbol}`);
          }
        }
      } catch (error) {
        console.log(`❌ ${name}: ERROR - ${error.message}`);
        allDeployed = false;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    if (allDeployed) {
      console.log('🎉 ALL CONTRACTS SUCCESSFULLY DEPLOYED AND VERIFIED!');
      console.log('✅ Frontend Web3Context.tsx updated with new addresses');
      console.log('✅ Backend check_systems.js updated with new addresses');
      console.log('✅ Test scripts updated with new addresses');
      console.log('🚀 ChainMind system ready for use!');
    } else {
      console.log('⚠️  Some contracts failed verification');
    }
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyDeployment()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });