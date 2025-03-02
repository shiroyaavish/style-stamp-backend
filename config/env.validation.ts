import { IsNumber, IsString, IsEnum } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment, {
    message: 'NODE_ENV must be one of: development, production, test',
  })
  NODE_ENV: Environment;

  @IsString()
  MONGODB_URI: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  REFRESH_SECRET: string;

  @IsNumber()
  PORT: number;

  @IsString()
  TITLE: string;

  @IsString()
  DESCRIPTION: string;

  @IsString()
  VERSION: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true, // Automatically converts string to numbers, etc.
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    const errorMessages = errors.map(err => Object.values(err.constraints)).flat();
    console.error('❌ Environment Variable Validation Failed:', errorMessages.join(', '));
    process.exit(1);
  }

  return validatedConfig;
}
