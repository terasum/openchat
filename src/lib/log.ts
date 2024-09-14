export class Logger {
  filename: string;
  constructor(filename: string) {
    this.filename = filename;
  }

  log(func: string, ...args: any) {
    console.log(`[${this.filename}](%s)`, func, ...args);
  }

  error(func: string, ...args: any) {
    console.error(`[${this.filename}](%s)`, func, ...args);
  }
}
