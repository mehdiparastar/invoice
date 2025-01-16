module.exports = async () => {
    console.log('Waiting for 20 seconds to come up other services completely.');
    await new Promise(resolve => setTimeout(resolve, 20000)); // 20 seconds delay
    console.log('Starting tests...');
};