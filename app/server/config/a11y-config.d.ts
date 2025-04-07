declare module '*/a11y-config.json' {
  interface Config {
    name: string
    json: boolean
    resultsPath: string
    resultsPathPerUrl: string
    launchOptions: {
      headless: boolean
      devtools: boolean
      args: string[]
    }
    urlsToAnalyze: string[]
    viewports: Array<{
      width: number
      height: number
    }>
    resultTypes: readonly ['violations', 'incomplete', 'passes', 'inapplicable']
    threshold: number
    timeout: number
    debugMode: boolean
    runOnly: string[]
    crawl: boolean
  }

  const config: Config
  export default config
} 