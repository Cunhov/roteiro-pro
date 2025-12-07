/**
 * Global Debug Logger
 * Provides centralized logging with console output and visual logger
 */

import { LogEntry } from '../components/DebugConsole';

type LogLevel = 'info' | 'warn' | 'error';

class DebugLogger {
    private listeners: Set<(entry: LogEntry) => void> = new Set();

    private log(level: LogLevel, message: string, details?: any) {
        const entry: LogEntry = {
            id: `${Date.now()}-${Math.random()}`,
            timestamp: new Date(),
            level,
            message,
            details
        };

        // Console output with appropriate method
        const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
        consoleMethod(`[${level.toUpperCase()}]`, message);
        if (details) {
            consoleMethod('Details:', details);
        }

        // Notify all listeners (visual console)
        this.listeners.forEach(listener => listener(entry));
    }

    info(message: string, details?: any) {
        this.log('info', message, details);
    }

    warn(message: string, details?: any) {
        this.log('warn', message, details);
    }

    error(message: string, details?: any) {
        this.log('error', message, details);
    }

    subscribe(listener: (entry: LogEntry) => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}

export const logger = new DebugLogger();
