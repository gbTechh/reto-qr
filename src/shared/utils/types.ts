export type ActionResponse<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      code?: "INVALID_FORMAT" | "NOT_FOUND" | "SERVER_ERROR";
    };
