

export function cancelAxiosRequest(cancelTokenSource) {
  if (cancelTokenSource) {
    cancelTokenSource.cancel('Request manually canceled');
    cancelTokenSource = null;
  }
}
