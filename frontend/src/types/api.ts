export interface ApiError {
    message: string;
    response?: {
      data?: {
        message?: string;
        errors?: Array<{
          message: string;
        }>;
      };
    };
    status?: number;
  }