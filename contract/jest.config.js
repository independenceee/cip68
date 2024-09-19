module.exports = {
    transform: {
        '^.+\\.ts$': 'babel-jest'
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000
}
