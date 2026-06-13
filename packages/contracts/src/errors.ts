export type GateZeroErrorType =
  | "validation_error"
  | "data_quality_error"
  | "risk_blocked"
  | "phase_blocked"
  | "security_blocked"
  | "unsupported_scope";

export class GateZeroError extends Error {
  constructor(
    public readonly type: GateZeroErrorType,
    message: string
  ) {
    super(message);
    this.name = "GateZeroError";
  }
}

export class ContractValidationError extends GateZeroError {
  constructor(message: string) {
    super("validation_error", message);
    this.name = "ContractValidationError";
  }
}

export class DataQualityError extends GateZeroError {
  constructor(message: string) {
    super("data_quality_error", message);
    this.name = "DataQualityError";
  }
}

export class RiskBlockedError extends GateZeroError {
  constructor(message: string) {
    super("risk_blocked", message);
    this.name = "RiskBlockedError";
  }
}

export class PhaseBlockedError extends GateZeroError {
  constructor(message: string) {
    super("phase_blocked", message);
    this.name = "PhaseBlockedError";
  }
}

export class SecurityBlockedError extends GateZeroError {
  constructor(message: string) {
    super("security_blocked", message);
    this.name = "SecurityBlockedError";
  }
}

export class UnsupportedScopeError extends GateZeroError {
  constructor(message: string) {
    super("unsupported_scope", message);
    this.name = "UnsupportedScopeError";
  }
}
