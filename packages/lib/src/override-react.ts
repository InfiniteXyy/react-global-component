import React from "react";

const backupApi = {
  useState: React.useState,
  useReducer: React.useReducer,
} as const;

export function withCustomApi<T>(fn: () => T, api: { -readonly [key in keyof typeof backupApi]?: any }): T {
  // @ts-ignore
  Object.assign(React, api);
  const result = fn();
  // @ts-ignore
  Object.assign(React, backupApi);
  return result;
}
