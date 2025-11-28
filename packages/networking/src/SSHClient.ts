import { Client, ClientChannel } from 'ssh2';
import * as fs from 'fs';

export interface SSHConfig {
  host: string;
  port?: number;
  username: string;
  privateKeyPath?: string;
  password?: string;
}

export class SSHClient {
  private client: Client;

  constructor(private config: SSHConfig) {
    this.client = new Client();
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client
        .on('ready', resolve)
        .on('error', reject)
        .connect({
          host: this.config.host,
          port: this.config.port || 22,
          username: this.config.username,
          privateKey: this.config.privateKeyPath
            ? fs.readFileSync(this.config.privateKeyPath)
            : undefined,
          password: this.config.password,
        });
    });
  }

  execute(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.exec(command, (err, stream) => {
        if (err) return reject(err);

        let stdout = '';
        let stderr = '';

        stream
          .on('close', (code: number, signal: string) => {
            if (code === 0) resolve(stdout);
            else reject(new Error(`Command failed with code ${code}: ${stderr}`));
          })
          .on('data', (data: Buffer) => {
            stdout += data.toString();
          })
          .stderr.on('data', (data: Buffer) => {
            stderr += data.toString();
          });
      });
    });
  }

  disconnect(): void {
    this.client.end();
  }
}
