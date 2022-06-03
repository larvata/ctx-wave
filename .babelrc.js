module.exports = {
  plugins: [],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          chrome: '100'
        },
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ]
  ]
}
