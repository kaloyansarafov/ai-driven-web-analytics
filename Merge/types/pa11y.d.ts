declare module "pa11y" {
  interface Pa11yOptions {
    standard?: string;
    includeNotices?: boolean;
    includeWarnings?: boolean;
    timeout?: number;
    wait?: number;
    actions?: string[];
    headers?: Record<string, string>;
    hideElements?: string;
    runners?: string[];
    rules?: string[];
    screenCapture?: string;
    chromeLaunchConfig?: {
      args?: string[];
      [key: string]: any;
    };
    [key: string]: any;
  }

  interface Pa11yResult {
    documentTitle: string;
    pageUrl: string;
    issues: Array<{
      code: string;
      context: string;
      message: string;
      selector: string;
      type: "error" | "warning" | "notice";
      typeCode: number;
      runner: string;
    }>;
    [key: string]: any;
  }

  function pa11y(url: string, options?: Pa11yOptions): Promise<Pa11yResult>;

  export = pa11y;
}
