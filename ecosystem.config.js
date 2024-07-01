module.exports = {
    apps: [
        {
            name: 'studyabroad-api',
            script: 'dist/main.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
              PORT: 9999,
            }, 
        }
    ]
}