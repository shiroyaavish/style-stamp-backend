import { IsNumber, IsString, IsEnum } from 'class-validator';
import { plainToClass, Transform } from 'class-transformer';
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

  @IsString()
  TWILIO_ACCOUNT_SID: string;

  @IsString()
  TWILIO_AUTH_TOKEN: string;

  @IsString()
  TWILIO_SERVICE_SID: string;

  @IsString()
  MAIL_HOST: string

  @IsString()
  MAIL_PORT: string

  @IsString()
  MAIL_SECURE: string

  @IsString()
  MAIL_USER: string

  @IsString()
  MAIL_PASSWORD: string

  @IsString()
  MAIL_FROM: string

  @IsNumber()
  @Transform(({ value }) => Number(value))
  SPACE_ID: number

  @IsNumber()
  @Transform(({ value }) => Number(value))
  USER_ID: number

  @IsString()
  API_SECRET: string
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true, // Automatically converts string to numbers, etc.
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((err) => Object.values(err.constraints))
      .flat();
    console.error(
      '❌ Environment Variable Validation Failed:',
      errorMessages.join(', '),
    );
    process.exit(1);
  }

  return validatedConfig;
}
