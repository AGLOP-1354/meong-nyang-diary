export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LoggerConfig {
  level: LogLevel
  enableTimestamp: boolean
  enableContext: boolean
  enableColors: boolean
  enablePerformance: boolean
}

const defaultConfig: LoggerConfig = {
  level: __DEV__ ? LogLevel.DEBUG : LogLevel.ERROR,
  enableTimestamp: true,
  enableContext: true,
  enableColors: __DEV__,
  enablePerformance: __DEV__,
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
}

const levelColors = {
  [LogLevel.DEBUG]: colors.cyan,
  [LogLevel.INFO]: colors.blue,
  [LogLevel.WARN]: colors.yellow,
  [LogLevel.ERROR]: colors.red,
}

// 로그 레벨별 라벨
const levelLabels = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
}

class Logger {
  private config: LoggerConfig
  private performanceMarks: Map<string, number> = new Map()

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  // 설정 업데이트
  updateConfig(newConfig: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  // 컨텍스트 정보 가져오기
  private getContext(): string {
    if (!this.config.enableContext) return ''

    const stack = new Error().stack
    if (!stack) return ''

    const lines = stack.split('\n')
    const callerLine = lines[4] || lines[3] || ''

    const match = callerLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) || callerLine.match(/at\s+(.+?):(\d+):(\d+)/)

    if (match) {
      const [, , filePath, line] = match
      const fileName = filePath ? filePath.split('/').pop() : 'unknown'
      return `[${fileName}:${line}]`
    }

    return ''
  }

  // 타임스탬프 생성
  private getTimestamp(): string {
    if (!this.config.enableTimestamp) return ''
    return `[${new Date().toISOString()}]`
  }

  // 색상 적용
  private colorize(text: string, color: string): string {
    if (!this.config.enableColors) return text
    return `${color}${text}${colors.reset}`
  }

  // 로그 포맷팅
  private formatMessage(level: LogLevel, message: string, context: string, timestamp: string): string {
    const levelLabel = this.colorize(levelLabels[level], levelColors[level])
    const parts = [levelLabel]

    if (timestamp) parts.push(this.colorize(timestamp, colors.dim))
    if (context) parts.push(this.colorize(context, colors.dim))

    parts.push(message)
    return parts.join(' ')
  }

  // 기본 로그 메서드
  private log(level: LogLevel, ...args: unknown[]): void {
    if (level < this.config.level) return

    const context = this.getContext()
    const timestamp = this.getTimestamp()
    const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' ')

    const formattedMessage = this.formatMessage(level, message, context, timestamp)

    // eslint-disable-next-line no-console
    const consoleMethod =
      level === LogLevel.ERROR
        ? console.error
        : // eslint-disable-next-line no-console
          level === LogLevel.WARN
          ? console.warn
          : // eslint-disable-next-line no-console
            console.log

    // eslint-disable-next-line no-console
    consoleMethod(formattedMessage)
  }

  // 공개 메서드들
  debug(...args: unknown[]): void {
    this.log(LogLevel.DEBUG, ...args)
  }

  info(...args: unknown[]): void {
    this.log(LogLevel.INFO, ...args)
  }

  warn(...args: unknown[]): void {
    this.log(LogLevel.WARN, ...args)
  }

  error(...args: unknown[]): void {
    this.log(LogLevel.ERROR, ...args)
  }

  // 성능 측정
  time(label: string): void {
    if (!this.config.enablePerformance) return
    this.performanceMarks.set(label, Date.now())
    this.debug(`⏱️  Timer started: ${label}`)
  }

  timeEnd(label: string): void {
    if (!this.config.enablePerformance) return

    const startTime = this.performanceMarks.get(label)
    if (startTime) {
      const duration = Date.now() - startTime
      this.performanceMarks.delete(label)
      this.info(`⏱️  Timer ended: ${label} (${duration}ms)`)
    } else {
      this.warn(`Timer '${label}' was not started`)
    }
  }

  // 그룹 로깅
  group(label: string): void {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.group(label)
    }
  }

  groupEnd(): void {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.groupEnd()
    }
  }

  // 테이블 로깅
  table(data: unknown[]): void {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.table(data)
    }
  }

  // 객체 로깅
  dir(obj: unknown): void {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.dir(obj)
    }
  }

  // 스택 트레이스
  trace(...args: unknown[]): void {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.trace(...args)
    }
  }

  // 메모리 사용량 (개발 환경에서만)
  memory(): void {
    if (__DEV__ && 'memory' in performance) {
      const memory = (
        performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }
      ).memory
      this.info('Memory usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
      })
    }
  }
}

const logger = new Logger()

export default logger

export type { LoggerConfig }
