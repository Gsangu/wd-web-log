module.exports = {
  title: 'wd-web-log',
  description: 'Just playing around',
  base: '/wd-web-log/',
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Github', link: 'https://github.dev/Gsangu/wd-web-log' },
    ],
    sidebar: {
      '/guide/': [
        '',
      ],
      '/api/': [
          'queue',
          'stack',
          'day',
      ],
      '/changelog/': ['']
    }
  }
}